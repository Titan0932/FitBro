require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET;

const jwt = require("jsonwebtoken");

const verifyToken = (authHeader) => {
    return new Promise((resolve, reject) => {
        const token = authHeader && authHeader.split(' ')[1];
        console.log(token)
        if (token == null) return reject({status: 401, message: ""});
        jwt.verify(token, SECRET_KEY, (tokenErr, user) => {
            if (tokenErr) {
                return reject({tokenErr, user: {}});
            } else {
                return resolve({tokenErr, user});
            }
        });
    })
    .catch((tokenErr) => {
        console.log("ERROR123!!!: " , tokenErr)
        return ({tokenErr, user: {}});
    });
}
module.exports = verifyToken