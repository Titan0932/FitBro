const { drizzle } = require("drizzle-orm/node-postgres");
const { Client } = require("pg");
const eq = require("drizzle-orm");
require("dotenv").config();


const client = new Client({
  host: (process.env.DB_HOST).toString(),
  port: (process.env.DB_PORT).toString(),
  user: (process.env.DB_USERNAME).toString(),
  password: (process.env.DB_PASSWORD).toString(),
  database: (process.env.DB_NAME).toString(),
});

client.connect();
const db = drizzle(client);


const express = require("express");

const app = express();
const port = 3005;

// const userInfo = {};

const jwt = require("jsonwebtoken");
secretKey = process.env.JWT_SECRET;



app.post("/login", (req, res) => {
  const { user_name, user_passw, role } = req.body;
  // Query database at the user_name to validate the authentication
  // code that validates the user with the database
  db.select().from(users).where(eq(users.user_name, user_name))
  .then((data) => {
    if (data.length > 0) {
      userInfo = data[0];
      const {err, result} = checkPwHash(user_passw, userInfo.user_passw);
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
    }
  })
  .catch((err) => {
    console.log(err);
  })
});



app.post("/register", (req, res) => {
  const { email, f_name, l_name, user_name, user_passw, user_dob } = req.body;
  // Query database to insert the new user
  // code that inserts the new user into the database
  const {err, hashedPw} = getPwHash(user_passw);
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
