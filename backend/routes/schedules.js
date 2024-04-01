const express = require('express');
const router = express.Router();

const { eq, asc } = require("drizzle-orm");


const db = require("../dbConnect");
const {
  users,
  classes,
  member_schedule,
  schedules,
  trainer_schedule
} = require("../db/schema");

//get member schedule
router.get("/getMemberSchedule", async (req, res) => {
    const { memberid } = req.body;
  
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
      .innerJoin(member_schedule)
      .on(eq(schedules.scheduleid, member_schedule.scheduleid))
      .innerJoin(classes)
      .on(eq(schedules.classid, classes.classid))
      .innerJoin(users)
      .on(eq(classes.trainerid, users.userid))
      .where(eq(member_schedule.memberid, memberid))
      .execute()
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("An error occurred while fetching member schedule");
      })
})

//create a schedule
async function insertSchedule({ classid, roomid, date, start_time, duration, status }) {
    return await db.insert(schedules)
      .values({ classid, roomid, date, start_time, duration, status })
      .returning({ scheduleid: schedules.scheduleid })
      .execute();
}
  
async function insertTrainerSchedule({ trainerid, scheduleid }) {
    return await db.insert(trainer_schedule)
      .values({ trainerid, scheduleid })
      .execute();
}
  
router.post("/createGroupSchedule", async (req, res) => {
    const { id, classid, roomid, date, start_time, duration, type ,status="pending", trainerid } = req.body;
    const { user } = req;
  
    if(type == "group" && user.role == "admin"){
      await insertSchedule(classid, roomid, date, start_time, duration, status)
              .then(async (data) => {
                await insertTrainerSchedule(trainerid, data.scheduleid)
                  .then(() => {
                    console.log("Trainer schedule created successfully");
                  })
                  .catch((err) => {
                    console.log(err);
                    res.status(500).send("An error occurred while creating trainer schedule");
                    return;
                  })
                return res.status(200).send("Schedule created successfully");
              })
              .catch((err) => {
                console.log(err);
                res.status(500).send("An error occurred while creating schedule");
                return;
              })
      return;
    }
    return req.status(401).send("Unauthorized access");
})
  
router.post("/createPersonalSchedule", async (req, res) => {
    const { id, classid, roomid, date, start_time, type ,duration, status="pending", trainerid } = req.body;
    const { user } = req;
  
    if(type == "personal" && user.role == "member"){
      await insertSchedule(classid, roomid, date, start_time, duration, status)
              .then(async (data) => {
                await insertTrainerSchedule(trainerid, data.scheduleid)
                  .then(() => {
                    console.log("Trainer schedule created successfully");
                  })
                  .catch((err) => {
                    console.log(err);
                    res.status(500).send("An error occurred while creating trainer schedule");
                    return;
                  })
                
                await db.insert(member_schedule)
                  .values({memberid: id, scheduleid: data.scheduleid})
                  .execute()
                  .then(() => {
                    console.log("Member schedule created successfully");
                  })
                  .catch((err) => {
                    console.log(err);
                    res.status(500).send("An error occurred while creating member schedule");
                    return;
                  })
  
                return res.status(200).send("Schedule created successfully");
              })
              .catch((err) => {
                console.log(err);
                res.status(500).send("An error occurred while creating schedule");
                return;
              })
    }
    return req.status(401).send("Unauthorized access");
})
  
// get a trainer's schedule
router.get("/getTrainerSchedule", async (req, res) => {
    const { trainerid } = req.body;
  
    const { user } = req;
    if(user.userid != trainerid){
      res.status(401).send("Unauthorized access");
      return;
    }
  
    const result = await db
      .select({
        scheduleid: schedules.scheduleid,
        date: schedules.date,
        start_time: schedules.start_time,
        duration: schedules.duration,
        classid: schedules.classid,
        class_name: classes.name,
        class_description: classes.description,
        roomid: schedules.roomid,
        trainerid: classes.trainerid,
      })
      .from(schedules)
      .innerJoin(trainer_schedule)
      .on(eq(schedules.scheduleid, trainer_schedule.scheduleid))
      .innerJoin(classes)
      .on(eq(schedules.classid, classes.classid))
      .innerJoin(users)
      .on(eq(classes.trainerid, users.userid))
      .where(eq(classes.trainerid, trainerid))
      .orderBy(asc(schedules.date), asc(schedules.start_time))
      .execute()
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("An error occurred while fetching trainer schedule");
      })
})
  


module.exports = router;