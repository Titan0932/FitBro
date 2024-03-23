


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

  module.exports = insertUserIntoRoleTable;