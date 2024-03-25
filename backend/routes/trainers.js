const express = require('express');
const router = express.Router();

const { eq } = require("drizzle-orm");

const db = require("../dbConnect");
const {
  users,
  trainers,
  trainer_availability,
} = require("../db/schema");

// to get all trainers 
router.get("/getAllTrainers", async (req, res) => {
    const { user } = req.user;
    
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
    const { trainerid } = req.query;
    const { user } = req.user;
    
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
  
  
// TODO: Post requests for trainer stuffs
  


module.exports = router;