const express = require("express");

const app = express();
const port = 3005;

const userInfo = {};

require("dotenv").config();
const jwt = require("jsonwebtoken");
secretKey = process.env.JWT_SECRET;




app.post("/login", (req, res) => {
  const { user_name, user_passw, role } = req.body;
  // Query database at the user_name to validate the authentication
  // code that validates the user with the database
  if (validated) {
    const jwtToken = jwt.sign({ user_name, role }, secretKey, {
      expiresIn: "1h",
    });
    successfulObj = {
      status: 200,
      message: "Login successful",
      jwtToken,
    };
    res.send(successfulObj);
  } else {
    res.status(401).send("Invalid username or password");
  }
});



app.post("/register", (req, res) => {
  const { email, f_name, l_name, user_name, user_passw, user_dob } = req.body;
  // Query database to insert the new user
  // code that inserts the new user into the database
  res.send("User registered successfully");
});




// Define your routes here
app.get("/getAllMembersByName", (req, res) => {
  const authHeader = req.headers['authorization'];
  (err, user) = verifyToken(authHeader);
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
