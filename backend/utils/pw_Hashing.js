const bcrypt = require('bcrypt');

const saltRounds = 10;

/**
 * Generates a hash for the given password using bcrypt.
 *
 * @param {string} password - The password to be hashed.
 * @returns {Promise<{getHasherr: string, hashedPw: string}>} A promise that resolves to an object containing the hash error (if any) and the hashed password.
 */
const getPwHash = (password) => {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, saltRounds, function(getHasherr, hashedPw) {
        if (getHasherr) {
          return reject({getHasherr, hashedPw: ""});
        } else {
          return resolve({getHasherr: "", hashedPw});
        }
      });
    }
)}

/**
 * Compares a password with a hash using bcrypt.
 * @param {string} password - The password to compare.
 * @param {string} hash - The hash to compare against.
 * @returns {Promise<{err: Error, result: boolean}>} A promise that resolves with an object containing an error (if any) and the comparison result.
 */
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