const express = require('express');
const router = express.Router();

const { eq, and } = require("drizzle-orm");

const db = require("../dbConnect");
const {
  users,
  trainers,
  trainer_availability,
} = require("../db/schema");

// to get all trainers 
router.get("/getAllTrainers", async (req, res) => {
    const { user } = req;
    
    const result = await db
      .select({
        trainerid: trainers.trainerid,
        email: users.email,
        f_name: users.f_name,
        l_name: users.l_name,
        speciality: trainers.speciality,
      })
      .from(trainers)
      .innerJoin(users)
      .on(eq(trainers.trainerid, users.userid))
      .execute()
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("An error occurred while fetching trainers");
      });
})
  
  // anyone can see the availability for a trainer
router.get("/getTrainerAvailability", async (req, res) => {
    const { trainerid } = req.body;
    const { user } = req;
    
    const result = await db
      .select({
        availabilityid: trainer_availability.availabilityid,
        day_of_week: trainer_availability.day_of_week,
        start_time: trainer_availability.start_time,
        end_time: trainer_availability.end_time,
      })
      .from(trainer_availability)
      .where(eq(trainer_availability.trainerid, trainerid))
      .execute()
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("An error occurred while fetching trainer availability");
      });
})
  
router.get("getTrainerSchedule/:filterDate", async (req, res) => {
    const { trainerid } = req.body;
    const { user } = req;
    const {filterDate} = req.params;

    if(user.role != "trainer" && user.userid != trainerid){
        res.status(401).send("Unauthorized access");
        return;
    }

    const whereClause = eq(trainer_availability.trainerid, trainerid)
    if(filterDate != 'all')
      whereClause = and(eq(trainer_availability.trainerid, trainerid), eq(trainer_availability.date, filterDate));
    
    const result = await db
      .select()
      .from(trainer_availability)
      .where(whereClause)
      .execute()
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("An error occurred while fetching trainer availability");
      });
})
  
// TODO: Post requests for trainer stuffs
  // add new availability
router.post('/addAvailability', async (req, res) => {
  const {curuser} = req.user;
  const {date, start_time, end_time, trainerid} = req.body; 
  if(curuser.role != "trainer" && curuser.userid != trainerid){
    res.status(401).send("Unauthorized access");
    return;
  }
  const result = await db
    .insert(trainer_availability)
    .values({
      trainerid: trainerid,
      date: date,
      start_time: start_time,
      end_time: end_time,
    })
    .execute()
    .then((data) => {
      res.status(200).send("Availability added successfully");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
})

  //remove availability
  router.post("/removeAvailability", async (req, res) => {
    const {curuser} = req.user;
    const {availabilityid} = req.body
    if(curuser.role != "trainer" && curuser.userid != trainerid){
      res.status(401).send("Unauthorized access");
      return;
    }
    const result = await db
      .delete()
      .from(trainer_availability)
      .where(eq(trainer_availability.availabilityid, availabilityid))
      .execute()
      .then((data) => {
        res.status(200).send("Availability removed successfully");
        return;
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(err);
        return;
      });
  
  })

  //update availability
  router.put("/updateAvailability", async (req, res) => {
    const {curuser} = req.user;
    const {availabilityid, date, start_time, end_time} = req.body;
    if(curuser.role != "trainer" && curuser.userid != trainerid){
      res.status(401).send("Unauthorized access");
      return;
    }
    const result = await db
      .update(trainer_availability)
      .set({
        date: date,
        start_time: start_time,
        end_time: end_time,
      })
      .where(eq(trainer_availability.availabilityid, availabilityid))
      .execute()
      .then((data) => {
        res.status(200).send("Availability updated successfully");
        return;
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(err);
        return;
      });
  })

module.exports = router;