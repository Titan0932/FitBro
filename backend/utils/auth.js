const checkPwHash = require("./pw_Hashing").checkPwHash;
const {users, members, fitness_goals, trainers, trainer_availability, admins, classes, rooms, equipments} = require("../db/schema");
const {eq} = require("drizzle-orm");

require("dotenv").config();
const SECRET_KEY = process.env.JWT_SECRET;

const db = require("../dbConnect");
const jwt = require("jsonwebtoken");



// Middleware for checking authorization
async function authMiddleware(req, res, next){
  const authHeader = req.headers["authorization"];
  const { tokenErr, user } = await verifyToken(authHeader);

  if (tokenErr?.status) {
    return res.status(tokenErr.status).send(tokenErr.message);
  }
  req.user = user;
  next();
};

/**
 * Authenticates a user based on their email and password.
 *
 * @param {string} email - The email of the user.
 * @param {string} user_passw - The password of the user.
 * @returns {Promise<{userAuthError: Object, userInfo: Object}>} - A promise that resolves to an object containing the user authentication error and user information.
 */
async function authenticateUser(email, user_passw) {
    // code to authenticate user
    userAuthError = {}; //status: 401, message: "..."
    userInfo = {};
    await db.select().from(users).where(eq(users.email, email))
    .then(async (data) => {
      if (data.length > 0) {
        userInfo = data[0];
        const {err, result} = await checkPwHash(user_passw, userInfo.user_passw);
        if(err || !result){
          console.log(err)
          userAuthError.status = 401;
          userAuthError.message = "Invalid username or password";
        }
      }else{
        userAuthError.status = 401;
        userAuthError.message = "Invalid username or password";
      }
    })
    .catch((err) => {
      console.log("LOGIN ERROR: ", err);
      userAuthError.status = 500;
      userAuthError.message = "An error occurred during the login process";
    })
    return {userAuthError, userInfo};
}
  
/**
 * Checks the role of a user and fetches additional data based on the role.
 * @param {string} role - The role to check (e.g., "member", "trainer", "admin").
 * @param {object} userInfo - The user information object.
 * @returns {Promise<{userRoleErr: object, additionalData: object}>} - A promise that resolves to an object containing the user role error and additional data.
 */
async function checkUserRole(role, userInfo) {
    // code to check user's role and fetch additional data
    additionalData = {};
    userRoleErr = {status:200}; //status: 500, message: "..."
    if(role.toLowerCase() == "member"){
      await db.select().from(members).where(eq(members.memberid, userInfo.userid))
      .then((memberData) => {
        console.log("memberData: ", memberData);
        if(memberData.length == 0){
          userRoleErr.status = 404;
          userRoleErr.message = "User not registered as a Member!";
        }
        else{
          additionalData['health_metrics'] = memberData[0].health_metrics;
        }
      })
      .catch((err) => {
        console.log(err)
        userRoleErr.status = 500;
        userRoleErr.message = "An error occurred while fetching member data";
      })
    }else if(role.toLowerCase() == "trainer"){
      await db.select().from(trainers).where(eq(trainers.trainerid, userInfo.userid))
      .then((trainerData) => {
        console.log("trainerData: ", trainerData);
        if(trainerData.length == 0){
          userRoleErr.status = 404;
          userRoleErr.message = "User not registered as a Trainer!";
        }else{
          additionalData['speciality'] = trainerData[0].speciality;
        }
      })
    }else if(role.toLowerCase() == "admin"){
        await db.select().from(admins).where(eq(admins.adminid, userInfo.userid))
        .then((adminData) => {
          if(adminData.length == 0){
            userRoleErr.status = 404;
            userRoleErr.message = "User not registered as an Admin!";
          }
        })
      }else{
        userRoleErr.status = 500;
        userRoleErr.message = "Invalid role";
      }
    return {userRoleErr, additionalData};
  
}
  
/**
 * Generates a JWT token for the given email and role.
 *
 * @param {string} email - The email of the user.
 * @param {string} role - The role of the user.
 * @returns {string} - The generated JWT token.
 */
function generateJwtToken(email, role) {
    // code to generate JWT token
    const jwtToken = jwt.sign({ email, role }, SECRET_KEY, {
      expiresIn: "1h",
    });
    return jwtToken;
}


/**
 * Verifies the authenticity of a token.
 * @param {string} authHeader - The authorization header containing the token.
 * @returns {Promise<{tokenErr: Error, user: Object}>} A promise that resolves with an object containing the token error (if any) and the user object.
 * @throws {Error} If the token is missing or invalid.
 */
const verifyToken = (authHeader) => {
  tokenErr = {};
  user = {};
  return new Promise((resolve, reject) => {
      const token = authHeader && authHeader.split(' ')[1];
      console.log(token)
      if (token == null) {
        tokenErr = {status: 401, message: "Token is missing"};
        return reject(tokenErr, user);
      }
      jwt.verify(token, SECRET_KEY, (err, user) => {
          if (err) {
              tokenErr = {status: 403, message: err.message};
              return reject({tokenErr, user: {}});
          } else {
              return resolve({tokenErr, user});
          }
      });
  })
  .catch((err) => {
      console.log("ERROR123!!!: " , err)
      tokenErr = {status: 500, message: err};
      return ({tokenErr, user: {}});
  });
}

/**
 * Checks if a user with the given email exists in the database.
 * @param {string} email - The email to check.
 * @returns {Promise<{checkErr: Object, check: boolean}>} - A promise that resolves to an object containing the check error and the check result.
 */
async function checkUserEmailExists(email){
  checkErr = {};
  check = false;
  await db.select({userid: users.userid,}).from(users).where(eq(users.email, email))
  .then((data) => {
    console.log("DATA: ", data.length);
    if(data.length > 0){
      return check = true
    }
  })
  .catch((err) => {
    console.log(err);
    return checkErr = {status: 500, msg: "An error occurred while checking if user exists"}
  })
  return {checkErr, check};
}

/**
 * Checks if a user with the specified email and role exists.
 *
 * @param {string} email - The email of the user to check.
 * @param {string} role - The role of the user to check.
 * @returns {Promise<{userCheckError: Object, userExists: boolean}>} - A promise that resolves to an object containing the user check error and a boolean indicating if the user exists.
 */
async function checkUserEmailRoleExists(email, role) {
  let userExists = true;
  let userCheckError = {};
  await db.select({userid: users.userid,}).from(users).where(eq(users.email, email))
  .then( async (data) => {
    if(data.length > 0){
      const {userRoleErr, additionalData} = await checkUserRole(role, data[0]);
      console.log("userRoleErr: ", userRoleErr)
      if(userRoleErr?.status != 200){
        userCheckError = userRoleErr;
        userExists = false;
      }
    }else{
      userExists = false;
    }
  })
  .catch((err) => {
    console.log(err);
    userCheckError = {status: 500, message: "An error occurred while checking if user exists"};
  })
  console.log("userCheckError, userExists : ", userCheckError, userExists)
  return {userCheckError, userExists};
}

module.exports = {
    authenticateUser,
    checkUserRole,
    generateJwtToken,
    checkUserEmailExists,
    checkUserEmailRoleExists,
    verifyToken,
    authMiddleware
  };