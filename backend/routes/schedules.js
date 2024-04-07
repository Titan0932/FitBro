const express = require('express');
const router = express.Router();

const { eq, asc, and, not } = require("drizzle-orm");


const db = require("../dbConnect");
const {
  users,
  classes,
  member_schedule,
  schedules,
  trainer_schedule,
  rooms,
  invoices
} = require("../db/schema");

const { getid } = require("../db/userOperations");

//get member schedule
router.get("/getMemberSchedule", async (req, res) => {
    const { memberid, status='' } = req.query;
    const { user } = req;
    let whereClause;
    if(status){
      whereClause = and(eq(member_schedule.memberid, memberid), eq(schedules.status, status));
    }else{
      whereClause = and(eq(member_schedule.memberid, memberid), not(eq(schedules.status, "CANCELLED")));
    }

    const result = await db
      .select({
        scheduleid: schedules.scheduleid,
        date: schedules.date,
        start_time: schedules.start_time,
        duration: schedules.duration,
        classid: schedules.classid,
        className: classes.name,
        classDescription: classes.description,
        classType: classes.type,
        classPrice: classes.price,
        roomid: schedules.roomid,
        trainerid: classes.trainerid,
        trainerFname: users.f_name,
        trainerLname: users.l_name,
        roomName: rooms.name,
        status: schedules.status,
        paid: invoices.status
        // trainer_name: users.f_name.concat(" ").concat(users.l_name)
      })
      .from(schedules)
      .innerJoin(member_schedule, eq(schedules.scheduleid, member_schedule.scheduleid))
      .innerJoin(classes, eq(schedules.classid, classes.classid))
      .innerJoin(users, eq(classes.trainerid, users.userid))
      .innerJoin(rooms, eq(schedules.roomid, rooms.roomid))
      .innerJoin(invoices, eq(schedules.scheduleid, invoices.scheduleid))
      .where(whereClause)
      .execute()
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("An error occurred while fetching member schedule");
      })
})  


router.delete("/deletePersonalClass", async (req, res) => {
    const { memberid, scheduleid } = req.query;
    const { user } = req;
    const curUserid = await getid(user.email);
    
    if( (user.role == "member" && curUserid == memberid) || user.role == "admin"){
      await db.update(schedules)
              .set({ status: "CANCELLED" })
              .where(eq(schedules.scheduleid, scheduleid))
              .execute()
              .then(async () => {
                console.log("Schedule Status Changed!");
                await db.delete(member_schedule)
                        .where(eq(member_schedule.scheduleid, scheduleid))
                        .execute()
                        .then(async () => {
                          console.log("Member schedule deleted successfully");
                          await db.delete(trainer_schedule)
                                  .where(eq(trainer_schedule.scheduleid, scheduleid))
                                  .execute()
                                  .then(() => {
                                    console.log("Trainer schedule deleted successfully");
                                    res.status(200).send("Schedule deleted successfully");
                                  })
                        })
                        .catch((err) => {
                          console.log(err);
                          res.status(500).send("An error occurred while deleting member schedule");
                        })
              })
              .catch((err) => {
                console.log(err);
                res.status(500).send("An error occurred while deleting schedule");
              })
    }
    else{
      return res.status(401).send("Unauthorized access");
    }
})

router.delete("/cancelGroupBooking", async (req, res) => {
  const { memberid, scheduleid } = req.query;
  const { user } = req;
  const curUserid = await getid(user.email)

  if(curUserid != memberid && user.role != "admin"){
    res.status(401).send("Unauthorized access");
    return;
  }

  const result = await db
    .delete(member_schedule)
    .where(and(eq(member_schedule.memberid, memberid), eq(member_schedule.scheduleid, scheduleid)))
    .execute()
    .then(() => {
      res.status(200).send("Group class booking cancelled successfully");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("An error occurred while cancelling group class booking");
    });
})

//create a schedule
async function insertSchedule( classid, roomid, date, start_time, duration, status ) {
    return await db.insert(schedules)
      .values({ classid, roomid, date, start_time, duration, status })
      .returning({ scheduleid: schedules.scheduleid })
      .execute();
}
  
async function insertTrainerSchedule( trainerid, scheduleid ) {
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
    const { memberid, classid, roomid, date, start_time ,duration, status="pending", trainerid } = req.body;
    const { user } = req;
    const curUserid = await getid(user.email);
    
    if( (user.role == "member" && curUserid == memberid) || user.role == "admin"){
      await insertSchedule(classid, roomid, date, start_time, duration, status)
              .then(async (data) => {
                await insertTrainerSchedule(trainerid, data[0].scheduleid)
                  .then(async() => {
                    console.log("Trainer schedule created successfully");

                    await db.insert(member_schedule)
                      .values({memberid: memberid, scheduleid: data[0].scheduleid})
                      .execute()
                      .then(() => {
                        console.log("Member schedule created successfully");
                        return
                      })
                      .catch((err) => {
                        console.log(err);
                        res.status(500).send("An error occurred while creating member schedule");
                        return;
                      })
      
                    return res.status(200).send(data[0]);
                  })
                  .catch((err) => {
                    console.log(err);
                    res.status(500).send("An error occurred while creating trainer schedule");
                    return;
                  })
              })
              .catch((err) => {
                console.log(err);
                res.status(500).send("An error occurred while creating schedule");
                return;
              })
    }
    else{
      return res.status(401).send("Unauthorized access");
    }
})

// get a trainer's schedule
router.get("/getTrainerSchedule", async (req, res) => {
    const { trainerid, date, status='' } = req.query;
    const { user } = req;
    let whereClause;
    if(date){
      whereClause = and(eq(schedules.date, date), eq(classes.trainerid, trainerid));
    }else{
      whereClause = eq(classes.trainerid, trainerid);
    }
    if(status){
      whereClause = and(whereClause, eq(schedules.status, status));
    }else{
      whereClause = and(whereClause, not(eq(schedules.status, "CANCELLED")));
    }
    const result = await db
      .select({
        scheduleid: schedules.scheduleid,
        date: schedules.date,
        start_time: schedules.start_time,
        duration: schedules.duration,
        classid: schedules.classid,
        className: classes.name,
        classDescription: classes.description,
        roomid: schedules.roomid,
        trainerid: classes.trainerid,
        roomName: rooms.name,
        status: schedules.status
      })
      .from(schedules)
      .innerJoin(trainer_schedule, eq(schedules.scheduleid, trainer_schedule.scheduleid))
      .innerJoin(classes, eq(schedules.classid, classes.classid))
      .innerJoin(users, eq(classes.trainerid, users.userid))
      .innerJoin(rooms, eq(schedules.roomid, rooms.roomid))
      .where(whereClause)
      .orderBy(asc(schedules.date))
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