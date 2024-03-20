const {eq} = require("drizzle-orm");


const express = require("express");

const app = express();
const port = 3005;

// const userInfo = {};
const db = require("./dbConnect");
const jwt = require("jsonwebtoken");
const {users, members, fitness_goals, trainers, trainer_availability, admins, classes, rooms, equipments} = require("./db/schema");

const secretKey = process.env.JWT_SECRET;
const verifyToken = require("./utils/verifyToken");
const getPwHash = require("./utils/pw_Hashing").getPwHash;
const checkPwHash = require("./utils/pw_Hashing").checkPwHash;


app.post("/login", (req, res) => {
  // console.log(req)
  const { user_name, user_passw, role } = req.query;
  // Query database at the user_name to validate the authentication
  // code that validates the user with the database
  db.select().from(users).where(eq(users.user_name, user_name))
  .then(async (data) => {
    if (data.length > 0) {
      userInfo = data[0];
      const {err, result} = await checkPwHash(user_passw, userInfo.user_passw);
      if(result){
        const jwtToken = jwt.sign({ user_name, role }, secretKey, {
          expiresIn: "1h",
        });
        successfulObj = {
          status: 200,
          message: "Login successful",
          jwtToken,
        };
        res.send(successfulObj);
      }else{
        console.log(err)
        res.status(401).send("Invalid username or password");
      }
    }else{
      res.status(401).send("Invalid username or password");
    }
  })
  .catch((err) => {
    console.log("LOGIN ERROR: ", err);
    res.status(500).send("An error occurred during the login process");
  })
});



app.post("/register", async (req, res) => {
  const { email, f_name, l_name, user_name, user_passw, user_dob } = req.query;
  // Query database to insert the new user
  // code that inserts the new user into the database
  const {err, hashedPw} = await getPwHash(user_passw);
  if(err){
    res.status(500).send("Error registering user");
    return;
  }
  db.insert(users).values({
    user_name: user_name,
    user_passw: hashedPw,
    f_name: f_name,
    l_name: l_name,
    email: email,
    user_dob: user_dob,
  }).execute().then(() => {
    console.log("User registered successfully");
    res.send("User registered successfully");
  }).catch((err) => {
    console.log(err);
    res.status(500).send("Error registering user");
  });
});




app.get("/getAllMembersByName", (req, res) => {
  const authHeader = req.headers['authorization'];
  const {err, user} = verifyToken(authHeader);
  if (err == 401) {
    return res.sendStatus(401);
  } else if(err){
    return res.sendStatus(403);
  }
  // Query database to get all members by name
  res.send("Here's the data");
});




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
