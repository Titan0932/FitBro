const express = require("express");
const router = express.Router();

const { eq } = require("drizzle-orm");

const {
  authenticateUser,
  checkUserRole,
  generateJwtToken,
  checkUserEmailRoleExists,
  checkUserEmailExists,
  authMiddleware,
} = require("../utils/auth");

const { users } = require("../db/schema");

const getPwHash = require("../utils/pw_Hashing").getPwHash;
const { insertUserIntoRoleTable } = require("../db/userOperations");
const db = require("../dbConnect");

router.post("/login", async (req, res) => {
  const { email, user_passw, role = "member" } = req.body;
  const { userAuthError, userInfo } = await authenticateUser(email, user_passw);
  console.log("AUTH: ", userAuthError);
  if (userAuthError?.status) {
    return res.status(userAuthError.status).send(userAuthError.message);
  }
  const { userRoleErr, additionalData } = await checkUserRole(role, userInfo);
  if (userRoleErr?.status!=200) {
    return res.status(userRoleErr.status).send(userRoleErr.message);
  }
  const jwtToken = generateJwtToken(email, role.toLowerCase());

  successfulObj = {
    status: 200,
    message: "Login successful",
    jwtToken,
  };
  return res.send(successfulObj);
});

router.post("/register", async (req, res) => {

  const { email, f_name, l_name, user_passw, user_dob, role } = req.body;
  // console.log("QUERY: " ,req.body)
  // Query database to insert the new user
  // code that inserts the new user into the database
  const { checkErr, check } = await checkUserEmailExists(email);
  console.log(checkErr, check);
  if (checkErr?.status) {
    return res.status(checkErr.status).send(checkErr.message);
  }
  let userId;
  if (!check) {
    const { getHasherr, hashedPw } = await getPwHash(user_passw);
    if (getHasherr) {
      res.status(500).send("Error registering user");
      return;
    }
    // Insert user into users table and get userId
    userId = await db
      .insert(users)
      .values({
        email: email,
        user_passw: hashedPw,
        f_name: f_name,
        l_name: l_name,
        user_dob: user_dob,
      })
      .returning({ userid: users.userid })
      .execute();
    userId = userId[0].userid;
  } else {
    // Get userId of existing user
    userId = await db
      .select({ userid: users.userid })
      .from(users)
      .where(eq(users.email, email))
      .execute();
    userId = userId[0].userid;
  }
  const { userCheckError, userExists } = await checkUserEmailRoleExists(
    email,
    role
  );
  if (userExists) {
    return res.status(400).send("User already exists");
  }else if (userCheckError?.status) {
    return res.status(userCheckError.status).send(userCheckError.message);
  }
  // Insert user into the appropriate role table
  try {
    await insertUserIntoRoleTable(role, userId);
  } catch (err) {
    return res.status(500).send(err.message);
  }
  return res.status(200).send("User registered successfully");
});

router.get("/getUserInfo", authMiddleware, async (req, res) => {
  const { user } = req;

  if (!user) {
    res.status(401).send("Unauthorized access");
    return;
  }
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, user.email))
    .execute()
    .then((data) => {
      const { user_passw, ...userData } = data["0"];
      res.status(200).send(userData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("An error occurred while fetching user info");
    });
});

router.put("/updateUserInfo", authMiddleware, async (req, res) => {

  const { email, f_name, l_name, user_passw, user_dob, new_passw } = req.body;
  const { user } = req;
  if (user.email != email) {
    res.status(401).send("Unauthorized access");
    return;
  }
  const { userAuthError, userInfo } = await authenticateUser(email, user_passw);
  if (userAuthError?.status) {
    return res.status(userAuthError.status).send(userAuthError.message);
  }
  updateObj = {};
  if (f_name) {
    updateObj.f_name = f_name;
  }
  if (l_name) {
    updateObj.l_name = l_name;
  }
  if (user_dob) {
    updateObj.user_dob = user_dob;
  }
  if (new_passw) {
    const { getHasherr, hashedPw } = await getPwHash(new_passw);
    if (getHasherr) {
      res.status(500).send("Error updating user info");
      return;
    }
    updateObj.user_passw = hashedPw;
  }
  if (Object.keys(updateObj).length == 0) {
    res.status(404).send("No data provided to update user info");
    return;
  }
  db.update(users)
    .set(updateObj)
    .where(eq(users.userid, userInfo.userid))
    .execute()
    .then(() => {
      res.status(200).send("User info updated successfully");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("An error occurred while updating user info");
    });
});

router.post("/checkUserEmailRoleExists", authMiddleware, async (req, res) => {
  const { user } = req;
  if (!user) {
    res.status(401).send("Unauthorized access");
    return;
  }
  const { role } = req.body;
  const { userCheckError, userExists } = await checkUserEmailRoleExists(
    user.email,
    role
  );
  if(userExists){
    res.status(200).send(userExists);
  }else if(userCheckError?.status){
    res.status(userCheckError.status).send(userCheckError.message);
  }else{
    res.status(404).send("User not found");
  }
})

module.exports = router;
