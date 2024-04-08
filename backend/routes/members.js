const express = require('express');
const router = express.Router();

const { eq, or, and } = require("drizzle-orm");

const db = require("../dbConnect");
const {
  users,
  members,
  fitness_goals,
  classes,
  member_exercises,
  invoices,
  schedules,
  exercises,
  member_schedule
} = require("../db/schema");

const {getid} = require('../db/userOperations')

router.put("/updateFitnessGoal", async (req, res) => {
    const { memberid, goalid, status, completeDate } = req.body;
    const { user } = req;
    const curUserid = await getid(user.email)
    console.log("REQ: ", req.body)
    if(curUserid != memberid){
      res.status(401).send("Unauthorized access");
      return;
    }
    const toUpdate= {
        status: status,
        achieved_date: completeDate == '' ? null : completeDate
      }
    const result = await db
      .update(fitness_goals)
      .set(toUpdate)
      .where(eq(fitness_goals.goalid, goalid))
      .execute()
      .then(() => {
        res.status(200).send("Fitness goal updated successfully");
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("An error occurred while updating fitness goal");
      });
})

router.post("/addFitnessGoal", async (req, res) => {
    const { memberid, goal_title, goal_description, goal_value, target_date } = req.body;
    const { user } = req;
    const curUserid = await getid(user.email)
    if(curUserid != memberid){
      res.status(401).send("Unauthorized access");
      return;
    }
    const result = await db
      .insert(fitness_goals)
      .values({
        memberid: memberid,
        goal_title: goal_title,
        goal_description: goal_description,
        goal_value: goal_value,
        target_date: target_date,
        status: "incomplete",
      })
      .execute()
      .then(() => {
        res.status(200).send("Fitness goal added successfully");
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("An error occurred while adding fitness goal");
      });
})


// to get member's incomplete fitness goals
router.get("/getFitnessGoals/:status", async (req, res) => {
    const { memberid } = req.query;
    const { status } = req.params;
    const { user } = req;
  
    const curUserid = await getid(user.email)
    if(curUserid != memberid){
      return res.status(401).send("Unauthorized Access!");
    }
  
    let whereClause;
    if (status === 'all') {
      whereClause = eq(fitness_goals.memberid, memberid);
    } else if(status == "completed" || status == "to-do" || status == "in-progress"){
      whereClause = and(eq(fitness_goals.memberid, memberid), eq(fitness_goals.status, status));
    } else if(status == "incomplete"){
      whereClause = and(eq(fitness_goals.memberid, memberid), or(eq(fitness_goals.status, "to-do"), eq(fitness_goals.status, "in-progress")));
    }else{
      res.status(400).send("Invalid status provided");
      return;
    }
  
    const result = await db
      .select()
      .from(fitness_goals)
      .where(whereClause)
      .execute()
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("An error occurred while fetching fitness goals");
      });
});
  
  // get member's health metrics
router.get("/getHealthMetrics", async (req, res) => {
    const { memberid } = req.query;
  
    const { user } = req;

    const curUserid = await getid(user.email);

    if(curUserid != memberid){
      res.status(401).send("Unauthorized access");
      return;
    }
  
    const result = await db
      .select()
      .from(members)
      .where(eq(members.memberid, memberid))
      .execute()
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("An error occurred while fetching health metrics");
      });
})

router.put("/updateHealthMetrics", async (req, res) => {
    const { memberid, height, weight } = req.body;
    const { user } = req;
    const curUserid = await getid(user.email)

    if(curUserid != memberid){
      res.status(401).send("Unauthorized access");
      return;
    }
    const result = await db
      .update(members)
      .set({
        height: height,
        weight: weight,
      })
      .where(eq(members.memberid, memberid))
      .execute()
      .then(() => {
        res.status(200).send("Health metrics updated successfully");
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("An error occurred while updating health metrics");
      });
})
  
router.get("/getWeeklyRoutines", async (req, res) => {
    const { memberid } = req.query;
    const { user } = req;
    const curUserid = await getid(user.email)
    if(curUserid != memberid){
      res.status(401).send("Unauthorized access");
      return;
    }
  
    const result = await db
      .select()
      .from(member_exercises)
      .where(eq(member_exercises.memberid, memberid))
      .innerJoin(exercises, eq(member_exercises.exerciseid, exercises.exerciseid))
      .execute()
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("An error occurred while fetching weekly routines");
      });
})

router.get("/getExcersises", async (req, res) => {
    const { user } = req;
    
    const result = await db
      .select()
      .from(exercises)
      .execute()
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("An error occurred while fetching weekly routines");
      });
})
  
  // TODO: Updating member stuffs: Post requests
  
  // select an exercise for the specific weekly routine
router.post("/selectExercise", async (req, res) => {
    const { memberid, exerciseid, start_week, reps, weight } = req.body;
  
    const { user } = req;

    const curUserid = await getid(user.email)
  
    if(curUserid != memberid){
      res.status(401).send("Unauthorized access");
      return;
    }
  
    const result = await db
      .insert(member_exercises)
      .values({
        memberid: memberid,
        exerciseid: exerciseid,
        start_week: start_week,
        reps: reps,
        weight: weight,
      })
      .execute()
      .then(() => {
        res.status(200).send("Exercise added to weekly routine");
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("An error occurred while adding exercise to weekly routine");
      });
})
  
  //pay a bill
router.post("/payBill", async (req, res) => {
    const { memberid, scheduleid, paidAmount } = req.body;
  
    const { user } = req;
    const curUserid = await getid(user.email)
    if(curUserid != memberid){
      res.status(401).send("Unauthorized access");
      return;
    }
  
    const existingInvoice = await db
      .select()
      .from(invoices)
      .where(and(eq(invoices.memberid, memberid), eq(invoices.scheduleid, scheduleid)))
      .execute();

    try{
      if (existingInvoice.length > 0) {
        // Invoice exists, update its status
        if (existingInvoice[0].status === "paid") {
          // Invoice has already been paid, return appropriate response
          res.status(400).send("Invoice has already been paid! You previously cancelled this booking and hadn't received a refund yet! Contact admin for further assistance.");
          return;
        } else {
          // Update the status of the existing invoice to "paid"
          await db
            .update(invoices)
            .set({ status: "paid" })
            .where({ memberid, scheduleid })
            .execute();
        }
      } else {
          // Invoice doesn't exist, insert a new one
          await db
            .insert(invoices)
            .values({
              memberid: memberid,
              amount: paidAmount,
              date: new Date(),
              status: "paid",
              scheduleid: scheduleid,
            })
            .execute();
      }
    }catch(err){
      console.log(err);
      res.status(500).send("An error occurred while paying bill");
    }

    // Update schedule status to "CONFIRMED"
    await db.update(schedules)
      .set({ status: "CONFIRMED" })
      .where(eq(schedules.scheduleid, scheduleid))
      .execute()
      .then(() => {
        console.log("Successfully updated schedule status")
        res.status(200).send("Bill paid successfully. Booking Complete!");
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("An error occurred while updating schedule status");
      });
})


router.get("/getAllMembersByName", async (req, res) => {
    // console.log(authHeader)
    const {user_fname, user_lname} = req.query;
    const { user } = req;
    if((user.role)?.toLowerCase() != "admin" && (user.role)?.toLowerCase() != "trainer"){
      res.status(401).send("Unauthorized access");
      return;
    }
    let whereClause = {}
    if(user_fname && user_lname){
      whereClause = and(eq(users.f_name, user_fname), eq(users.l_name, user_lname));
    }else if(user_fname){
      whereClause = eq(users.f_name, user_fname);
    }else if(user_lname){
      whereClause = eq(users.l_name, user_lname);
    // }else{
    //   res.status(400).send("No search criteria provided");
    //   return;
    }
    const result = await db
      .select({
        userid: users.userid,
        email: users.email,
        user_fname: users.f_name,
        user_lname: users.l_name,
        user_email: users.email,
        user_dob: users.user_dob,
        weight: members.weight,
        height: members.height,
      })
      .from(members)
      .leftJoin(users, eq(users.userid, members.memberid))
      .where(Object.keys(whereClause).length > 0 && whereClause)
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("An error occurred while fetching members");
      });
});
  
router.get("/getMemberInvoice", async (req, res) => {
    const { memberid } = req.body;
    const { user } = req;
    if(user.userid != memberid){
      res.status(401).send("Unauthorized access");
      return;
    }
    const result = await db
      .select()
      .from(invoices)
      .where(eq(invoices.memberid, memberid))
      .execute()
      .then((data) => {
        return res.status(200).send(data);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).send("An error occurred while fetching invoices");
      });
})

router.post("/bookGroupClass", async (req, res) => {
    const { memberid, scheduleid } = req.body;
    const { user } = req;
    const curUserid = await getid(user.email)

    if(curUserid != memberid && user.role != "admin"){
      res.status(401).send("Unauthorized access");
      return;
    }

    const result = await db
      .insert(member_schedule)
      .values({memberid: memberid, scheduleid: scheduleid})
      .execute()
      .then(() => {
        res.status(200).send("Group class booked successfully");
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error booking group class! Class already booked?");
      });
})

router.get("/getMemberSchedule:filterDate", async (req, res) => {
    const { memberid } = req.body;
    const { user } = req;
    const {filterDate} = req.params;
  
    if(user.role != "member" && user.userid != memberid){
        res.status(401).send("Unauthorized access");
        return;
    }
  
    const whereClause = eq(schedules.memberid, memberid)
    if(filterDate){
      whereClause.and(eq(schedules.date, filterDate));
    }
  
    const result = await db
      .select()
      .from(schedules)
      .where(whereClause)
      .execute()
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("An error occurred while fetching member schedule");
      });
})

module.exports = router;