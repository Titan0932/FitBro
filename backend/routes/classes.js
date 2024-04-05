const express = require('express');
const router = express.Router();


const { eq, asc, and, ConsoleLogWriter } = require("drizzle-orm");


const db = require("../dbConnect");
const {
  users,
  classes,
  schedules,
} = require("../db/schema");

// to get all group classes
router.get("/getAllGroupClasses", async (req, res) => {
    const { user } = req;
  
    const result = await db
      .select({
        classid: classes.classid,
        name: classes.name,
        description: classes.description,
        type: classes.type,
        trainerid: classes.trainerid,
        price: classes.price,
      })
      .from(classes)
      .where(eq(classes.type, "group"))
      .execute()
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("An error occurred while fetching classes");
      });
})
  
  // to get the schedule of a class in ascending order of date and time
router.get("/getClassSchedule", async (req, res) => {
   const { classid } = req.body;
  
    const { user } = req;
  
    const result = await db
      .select({
        scheduleid: schedules.scheduleid,
        date: schedules.date,
        start_time: schedules.start_time,
        duration: schedules.duration,
        classid: schedules.classid,
        roomid: schedules.roomid,
        trainerid: classes.trainerid,
        trainer_name: users.f_name.concat(" ").concat(users.l_name)
      })
      .from(schedules)
      where(eq(schedules.classid, classid))
      .innerJoin(classes)
      .on(eq(schedules.classid, classes.classid))
      .innerJoin(users)
      .on(eq(classes.trainerid, users.userid))
      .orderBy(asc(schedules.date), asc(schedules.start_time))
      .execute()
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("An error occurred while fetching class schedule");
      })
})

// get all classes
router.get("/getAllClasses", async (req, res) => {
  const { classid, type, trainerid } = req.query;
  const { user } = req;
  
  let conditions = [];

  if (classid) {
      conditions.push(eq(classes.classid, classid));
  }
  if (type) {
      conditions.push(eq(classes.type, type));
  }
  if (trainerid) {
      conditions.push(eq(classes.trainerid, trainerid));
  }

  let whereClause = conditions.length > 0 ? and(...conditions) : {};


  const result = await db
    .select()
    .from(classes)
    .where(whereClause)
    .execute()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("An error occurred while fetching classes");
    });
})


module.exports = router;