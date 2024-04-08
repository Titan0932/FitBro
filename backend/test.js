const bcrypt = require('bcrypt');
const password = 'password'; // replace with the password you want to hash

bcrypt.hash(password, 10, function(err, hash) {
  // Store hash in your password DB.
  console.log(hash);
});