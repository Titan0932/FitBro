const bcrypt = require('bcrypt');

const saltRounds = 10;

const getPwHash = (password) => {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, saltRounds, function(err, hash) {
        if (err) {
          reject(err);
        } else {
          resolve(err, hash);
        }
      });
    }
)}

const checkPwHash = (password, hash) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hash, function(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve({err, result});
        }
      });
    });
  }

module.exports = {getPwHash, checkPwHash}