const bcrypt = require('bcrypt');

const saltRounds = 10;

export const getPwHash = (password) => {
    bcrypt.hash(password, saltRounds, function(err, hash) {
        return {err, hash}
    });
}

export const checkPwHash = (password, hash) => {
    bcrypt.compare(password, hash, function(err, result) {
        return {err, result}
    });
}