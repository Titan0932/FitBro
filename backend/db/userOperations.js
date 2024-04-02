
const db  = require("../dbConnect");
const { members, trainers, admins  } = require("../db/schema");
/**
 * Inserts a user into the appropriate role table based on the provided role.
 * @param {string} role - The role of the user (member, trainer, admin).
 * @param {number} userId - The ID of the user.
 * @throws {Error} If an invalid role is provided.
 * @throws {Error} If there is an error registering the user.
 */
async function insertUserIntoRoleTable(role, userId) {
    try {
      if (role.toLowerCase() == "member") {
        await db
          .insert(members)
          .values({
            memberid: userId,
          })
          .execute();
      } else if (role.toLowerCase() == "trainer") {
        await db
          .insert(trainers)
          .values({
            trainerid: userId,
          })
          .execute();
      } else if (role.toLowerCase() == "admin") {
        await db
          .insert(admins)
          .values({
            adminid: userId,
          })
          .execute();
      } else {
        throw new Error("Invalid role");
      }
    } catch (err) {
      console.log(err);
      throw new Error("Error registering user");
    }
  }

  module.exports = {insertUserIntoRoleTable};