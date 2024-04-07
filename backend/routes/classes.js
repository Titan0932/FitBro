const express = require('express');
const router = express.Router();


const { eq, asc, and } = require("drizzle-orm");


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
   const { classid } = req.query;
  
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
        trainerFname: users.f_name,
        trainerLname: users.l_name,
        price: classes.price
      })
      .from(schedules)
      .innerJoin(classes, eq(schedules.classid, classes.classid))
      .innerJoin(users, eq(classes.trainerid, users.userid))
      .where(eq(schedules.classid, classid))
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

  let whereClause = conditions.length > 0 ? and(...conditions) : null;

  let query = db.select().from(classes)

  if(whereClause) query.where(whereClause);

  const result = await query
            .execute()
            .then((data) => {
              res.status(200).send(data);
            })
            .catch((err) => {
              console.log(err);
              res.status(500).send("An error occurred while fetching classes");
            });
})

router.delete("/deleteClass", async (req, res) => {
  const { classid } = req.query;
  const { user } = req;

  if(user.role?.toLowerCase() != "admin"){
    res.status(401).send("Unauthorized access");
    return;
  }

  const classTimings  = await db.select().from(schedules).where(eq(schedules.classid, classid)).execute();

  if(classTimings.length == 0){
    const result = await db
      .delete(classes)
      .where(eq(classes.classid, classid))
      .execute()
      .then((data) => {
        res.status(200).send("Class deleted successfully");
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("An error occurred while deleting class");
      });
    } else {
      res.status(400).send("Class has registered schedules or previous recorded bookings. Cannot delete class!");
    }
})

router.post("/addClass", async (req, res) => {
  const { name, description, type, trainerid, price } = req.body;
  const { user } = req;

  if(user.role?.toLowerCase() != "admin"){
    res.status(401).send("Unauthorized access");
    return;
  }

  if(type?.toLowerCase() == 'personal'){
    // check if the sent trainer already has a personal class
      // if yes, return error
    const personalClasses = await db.select().from(classes).where(and(eq(classes.type, 'personal'), eq(classes.trainerid, trainerid))).execute();
    if(personalClasses.length > 0){
      res.status(400).send("Trainer already has a personal class");
      return;
    }
  }

  const result = await db
    .insert(classes)
    .values({
      name: name,
      description: description,
      type: type,
      trainerid: trainerid,
      price: price
    })
    .execute()
    .then((data) => {
      res.status(200).send("Class added successfully");
      return;
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("An error occurred while adding class");
      return;
    });
})

module.exports = router;