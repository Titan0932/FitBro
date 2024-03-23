const checkPwHash = require("./utils/pw_Hashing").checkPwHash;
const {users, members, fitness_goals, trainers, trainer_availability, admins, classes, rooms, equipments} = require("./db/schema");
const {eq} = require("drizzle-orm");

require("dotenv").config();
const SECRET_KEY = process.env.JWT_SECRET;

const db = require("./dbConnect");


async function authenticateUser(email, user_passw) {
    // code to authenticate user
    userAuthError = {}; //status: 401, message: "..."
    userInfo = {};
    db.select().from(users).where(eq(users.email, email))
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
  
async function checkUserRole(role, userInfo) {
    // code to check user's role and fetch additional data
    additionalData = {};
    userRoleErr = {}; //status: 500, message: "..."
    if(role.toLowerCase() == "member"){
      await db.select().from(members).where(eq(members.memberid, userInfo.userid))
      .then((memberData) => {
        console.log("memberData: ", memberData);
        if(memberData.length == 0){
          userRoleErr.status = 200;
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
          userRoleErr.status = 200;
          userRoleErr.message = "User not registered as a Trainer!";
        }else{
          additionalData['speciality'] = trainerData[0].speciality;
        }
      })
    }else if(role.toLowerCase() == "admin"){
        await db.select().from(admins).where(eq(admins.adminid, userInfo.userid))
        .then((adminData) => {
          console.log("adminData: ", adminData);
          if(adminData.length == 0){
            userRoleErr.status = 200;
            userRoleErr.message = "User not registered as an Admin!";
          }
        })
    }else{
      userRoleErr.status = 500;
      userRoleErr.message = "Invalid role";
    }
    return {userRoleErr, additionalData};
  
}
  
function generateJwtToken(email, role) {
    // code to generate JWT token
    const jwtToken = jwt.sign({ email, role }, SECRET_KEY, {
      expiresIn: "1h",
    });
    return jwtToken;
}

/* Verify if a user of a specific email exists */
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

/* Verify if a user of a specific email + role exists */
async function checkUserEmailRoleExists(email, role) {
  let userExists = false;
  let userCheckError = {};
  await db.select({userid: users.userid,}).from(users).where(eq(users.email, email))
  .then( async (data) => {
    if(data.length > 0){
      const {userRoleErr, additionalData} = await checkUserRole(role, data[0]);
      console.log("userRoleErr: ", userRoleErr)
      if(userRoleErr?.status == 500){
        userCheckError = userRoleErr;
      }else if(userRoleErr?.status == 200){
        userExists = false;
      }else{
        userExists = true;
      }
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
    checkUserEmailRoleExists
  };