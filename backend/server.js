require("dotenv").config();

const { eq, or, asc } = require("drizzle-orm");

const express = require("express");

const app = express();
const port = 3005;

const {
  authenticateUser,
  checkUserRole,
  generateJwtToken,
  checkUserEmailRoleExists,
  checkUserEmailExists,
  verifyToken
} = require("./utils/auth");

const { insertUserIntoRoleTable } = require('./db/userOperations');
const db = require("./dbConnect");
const {
  users,
  members,
  fitness_goals,
  trainers,
  trainer_availability,
  admins,
  classes,
  rooms,
  equipments,
  exercises,
  member_exercises,
  invoices,
  member_schedule,
  schedules
} = require("./db/schema");

const e = require("express");
const getPwHash = require("./utils/pw_Hashing").getPwHash;

app.post("/login", async (req, res) => {
  // console.log(req)
  const { email, user_passw, role="Member" } = req.query;

  const { userAuthError, userInfo } = await authenticateUser(email, user_passw);
  console.log("AUTH: ", userAuthError)
  if (userAuthError?.status) {
    return res.status(userAuthError.status).send(userAuthError.message);
  }
  const { userRoleErr, additionalData } = checkUserRole(role, userInfo);
  if (userRoleErr?.status) {
    return res.status(userRoleErr.status).send(userRoleErr.message);
  }
  const jwtToken = generateJwtToken(email, role.toLowerCase());

  successfulObj = {
    status: 200,
    message: "Login successful",
    jwtToken,
  };
  return res.send(successfulObj);
});

app.post("/register", async (req, res) => {
  const { email, f_name, l_name, user_passw, user_dob, role } = req.query;
  // console.log("QUERY: " ,req.query)
  // Query database to insert the new user
  // code that inserts the new user into the database
  const { checkErr, check } = await checkUserEmailExists(email);
  console.log(checkErr, check);
  if (checkErr?.status) {
    return res.status(checkErr.status).send(checkErr.message);
  }
  let userId;
  if (!check) {
    const { getHasherr, hashedPw } = await getPwHash(user_passw);
    if (getHasherr) {
      res.status(500).send("Error registering user");
      return;
    }
    // Insert user into users table and get userId
    userId = await db
      .insert(users)
      .values({
        email: email,
        user_passw: hashedPw,
        f_name: f_name,
        l_name: l_name,
        user_dob: user_dob,
      })
      .returning({ userid: users.userid })
      .execute();
    userId = userId[0].userid;
  } else {
    // Get userId of existing user
    userId = await db
      .select({ userid: users.userid })
      .from(users)
      .where(eq(users.email, email))
      .execute();
    userId = userId[0].userid;
  }
  const { userCheckError, userExists } = await checkUserEmailRoleExists(
    email,
    role
  );
  if (userCheckError?.status) {
    return res.status(userCheckError.status).send(userCheckError.message);
  }
  if (userExists) {
    return res.status(400).send("User already exists");
  }
  // Insert user into the appropriate role table
  try {
    await insertUserIntoRoleTable(role, userId);
  } catch (err) {
    return res.status(500).send(err.message);
  }
  return res.status(200).send("User registered successfully");
});


app.get("/getUserInfo", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const { email } = req.query;
  const { tokenErr, user } = await verifyToken(authHeader);
  if (tokenErr?.status == 401) {
    return res.status(tokenErr.status).send(tokenErr.message);
  } else if (tokenErr?.status) {
    return res.status(tokenErr.status).send(tokenErr.message);
  }
  if(user.email != email){
    res.status(401).send("Unauthorized access");
    return;
  }
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .execute()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("An error occurred while fetching user info");
    });
});

app.post("/updateUserInfo", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const { email, f_name, l_name, user_passw, user_dob, new_passw } = req.query;
  const { tokenErr, user } = await verifyToken(authHeader);
  if (tokenErr?.status == 401) {
    return res.status(tokenErr.status).send(tokenErr.message);
  } else if (tokenErr?.status) {
    return res.status(tokenErr.status).send(tokenErr.message);
  }
  if(user.email != email){
    res.status(401).send("Unauthorized access");
    return;
  }
  const { userAuthError, userInfo } = await authenticateUser(email, user_passw);
  if (userAuthError?.status) {
    return res.status(userAuthError.status).send(userAuthError.message);
  }
  updateObj = {};
  if (f_name) {
    updateObj.f_name = f_name;
  }
  if (l_name) {
    updateObj.l_name = l_name;
  }
  if (user_dob) {
    updateObj.user_dob = user_dob;
  }
  if (new_passw) {
    const { getHasherr, hashedPw } = await getPwHash(new_passw);
    if (getHasherr) {
      res.status(500).send("Error updating user info");
      return;
    }
    updateObj.user_passw = hashedPw;
  }
  if(Object.keys(updateObj).length == 0){
    res.status(404).send("No data provided to update user info");
    return;
  }
  db.update(users)
    .set(updateObj)
    .where(eq(users.userid, userInfo.userid))
    .execute()
    .then(() => {
      res.status(200).send("User info updated successfully");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("An error occurred while updating user info");
    });

})

// to get all group classes
app.get("/getAllGroupClasses", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const { tokenErr, user } = await verifyToken(authHeader);
  if (tokenErr?.status == 401) {
    return res.status(tokenErr.status).send(tokenErr.message);
  } else if (tokenErr?.status) {
    return res.status(tokenErr.status).send(tokenErr.message);
  }

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
app.get("/getClassSchedule", async (req, res) => {
 const authHeader = req.headers["authorization"];
 const { classid } = req.query;

  const { tokenErr, user } = await verifyToken(authHeader);
  if (tokenErr?.status == 401) {
    return res.status(tokenErr.status).send(tokenErr.message);
  } else if (tokenErr?.status) {
    return res.status(tokenErr.status).send(tokenErr.message);
  }
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

//get member schedule
app.get("/getMemberSchedule", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const { memberid } = req.query;

  const { tokenErr, user } = await verifyToken(authHeader);
  if (tokenErr?.status == 401) {
    return res.status(tokenErr.status).send(tokenErr.message);
  } else if (tokenErr?.status) {
    return res.status(tokenErr.status).send(tokenErr.message);
  }
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

// to get all trainers 
app.get("/getAllTrainers", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const { tokenErr, user } = await verifyToken(authHeader);
  if (tokenErr?.status == 401) {
    return res.status(tokenErr.status).send(tokenErr.message);
  } else if (tokenErr?.status) {
    return res.status(tokenErr.status).send(tokenErr.message);
  }

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


// to get user's incomplete fitness goals
app.get("/getFitnessGoals/:status", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const { memberid } = req.query;
  const { status } = req.params;

  const { tokenErr, user } = await verifyToken(authHeader);
  if (tokenErr?.status == 401) {
    return res.status(tokenErr.status).send(tokenErr.message);
  } else if (tokenErr?.status) {
    return res.status(tokenErr.status).send(tokenErr.message);
  }

  if(user.userid != memberid){
    res.status(401).send("Unauthorized access");
    return;
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
app.get("/getHealthMetrics", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const { memberid } = req.query;

  const { tokenErr, user } = await verifyToken(authHeader);
  if (tokenErr?.status == 401) {
    return res.status(tokenErr.status).send(tokenErr.message);
  } else if (tokenErr?.status) {
    return res.status(tokenErr.status).send(tokenErr.message);
  }

  if(user.userid != memberid){
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

app.get("/getWeeklyRoutines", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const { memberid } = req.query;

  const { tokenErr, user } = await verifyToken(authHeader);
  if (tokenErr?.status == 401) {
    return res.status(tokenErr.status).send(tokenErr.message);
  } else if (tokenErr?.status) {
    return res.status(tokenErr.status).send(tokenErr.message);
  }

  if(user.userid != memberid){
    res.status(401).send("Unauthorized access");
    return;
  }

  const result = await db
    .select()
    .from(member_exercises)
    .where(eq(member_exercises.memberid, memberid))
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
app.post("/selectExercise", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const { memberid, exerciseid, week_date, rep, weight } = req.query;

  const { tokenErr, user } = await verifyToken(authHeader);
  if (tokenErr?.status == 401) {
    return res.status(tokenErr.status).send(tokenErr.message);
  } else if (tokenErr?.status) {
    return res.status(tokenErr.status).send(tokenErr.message);
  }

  if(user.userid != memberid){
    res.status(401).send("Unauthorized access");
    return;
  }

  const result = await db
    .insert(member_exercises)
    .values({
      memberid: memberid,
      exerciseid: exerciseid,
      week_date: week_date,
      reps: rep,
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
app.post("/payBill", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const { memberid, scheduleid, paidAmount } = req.query;

  const { tokenErr, user } = await verifyToken(authHeader);
  if (tokenErr?.status == 401) {
    return res.status(tokenErr.status).send(tokenErr.message);
  } else if (tokenErr?.status) {
    return res.status(tokenErr.status).send(tokenErr.message);
  }
  if(user.userid != memberid){
    res.status(401).send("Unauthorized access");
    return;
  }

  await db.select({price : classes.price})
  .from(schedules)
  .innerJoin(classes)
  .on(eq(schedules.classid, classes.classid))
  .where(eq(schedules.scheduleid, scheduleid))
  .execute()
  .then((data) => {
    if(data[0].price != paidAmount){
      res.status(400).send("Incorrect amount paid");
      return;
    }
  })

  const result = await db
    .insert(invoices)
    .values({
      memberid: memberid,
      amount: paidAmount,
      date: new Date(),
      status: "paid",
      scheduleid: scheduleid,
    })
    .execute()
    .then(async () => {
      await db.set(schedules)
              .values({status: "booked"})
              .where(eq(schedules.scheduleid, scheduleid))
              .execute()
              .then(() => {
                console.log("Successfully updated schedule status")
              })
              .catch((err) => {
                console.log(err);
                res.status(500).send("An error occurred while updating schedule status");
                return;
              })
      return res.status(200).send("Bill paid successfully. Booking Complete!");
    })
    .catch((err) => {
       console.log(err)
       res.status(500).send("An error occurred while paying bill");
       return;
    })
})

// create a schedule: group for admins and personal for members
app.post("/createSchedule/:type", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const { id, classid, roomid, date, start_time, duration, status="pending", trainerid } = req.query;
  const {type} = req.params;
  const { tokenErr, user } = await verifyToken(authHeader);
  if (tokenErr?.status == 401) {
    return res.status(tokenErr.status).send(tokenErr.message);
  } else if (tokenErr?.status) {
    return res.status(tokenErr.status).send(tokenErr.message);
  }
  // creating schedule for group class for admin
  if(type == "group" && user.role == "admin"){
    await db.insert(schedules)
            .values({
              classid: classid,
              roomid: roomid,
              date: date,
              start_time: start_time,
              duration: duration,
              status: status
            })
            .returning({scheduleid: schedules.scheduleid})
            .execute()
            .then(async (data) => {
              await db.insert(trainer_schedule)
                .values({trainerid: trainerid, scheduleid: data.scheduleid})
                .execute()
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
  // creating schedule for personal class for member
  else if(type == "personal" && user.role == "member"){
    await db.insert(schedules)
            .values({
              classid: classid,
              roomid: roomid,
              date: date,
              start_time: start_time,
              duration: duration,
              status: status
            })
            .returning({scheduleid: schedules.scheduleid})
            .execute()
            .then(async (data) => {
              await db.insert(trainer_schedule)
                .values({trainerid: trainerid, scheduleid: data.scheduleid})
                .execute()
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
  else{
    res.status(401).send("Unauthorized access");
    return;
  }
})


// book a group class 
app.get("/bookPersonalTrainer", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const { memberid, date, start_time, duration, classid, } = req.query;

  const { tokenErr, user } = await verifyToken(authHeader);
  if (tokenErr?.status == 401) {
    if (user.userid != memberid) {
      // Handle unauthorized access
      return res.status(401).json({ error: "Unauthorized access" });
    }
  }
  await db.select({scheduleid: schedules.scheduleid})
          .from(schedules)
          .where(and(eq(schedules.date, date), eq(schedules.start_time, start_time), eq(schedules.duration, duration), eq(schedules.classid, classid)))
});



// browse list of trainers and book a personal session from their available hours


//trainer getters
app.get("/getAllMembersByName", async (req, res) => {
  const authHeader = req.headers["authorization"];
  // console.log(authHeader)
  const {user_fname, user_lname} = req.query;
  const { tokenErr, user } = await verifyToken(authHeader);
  if (tokenErr?.status == 401) {
    return res.status(tokenErr.status).send(tokenErr.message);
  } else if (tokenErr?.status) {
    return res.status(tokenErr.status).send(tokenErr.message);
  }
  if(user.role != "admin" || user.role != "trainer"){
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
  }else{
    res.status(400).send("No search criteria provided");
    return;
  }
  const result = await db
    .select({
      userid: users.userid,
      email: users.email,
      user_fname: users.f_name,
      user_lname: users.l_name,
      user_email: users.email,
      user_dob: users.user_dob,
    })
    .from(users)
    .where(whereClause)
    .then((data) => {
      console.log("DATA: ", data);
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("An error occurred while fetching members");
    });
});

// anyone can see the availability for a trainer
app.get("/getTrainerAvailability", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const { trainerid } = req.query;
  const { tokenErr, user } = await verifyToken(authHeader);
  if (tokenErr?.status == 401) {
    return res.status(tokenErr.status).send(tokenErr.message);
  } else if (tokenErr?.status) {
    return res.status(tokenErr.status).send(tokenErr.message);
  }
  
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

// get a trainer's schedule
app.get("/getTrainerSchedule", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const { trainerid } = req.query;

  const { tokenErr, user } = await verifyToken(authHeader);
  if (tokenErr?.status == 401) {
    return res.status(tokenErr.status).send(tokenErr.message);
  } else if (tokenErr?.status) {
    return res.status(tokenErr.status).send(tokenErr.message);
  }
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

// TODO: Post requests for trainer stuffs

//admin getters:

// get all rooms
app.get("/getAllRooms", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const { tokenErr, user } = await verifyToken(authHeader);
  if (tokenErr?.status == 401) {
    return res.status(tokenErr.status).send(tokenErr.message);
  } else if (tokenErr?.status) {
    return res.status(tokenErr.status).send(tokenErr.message);
  }
  if(user.role != "admin"){
    res.status(401).send("Unauthorized access");
    return;
  }
  const result = await db
    .select()
    .from(rooms)
    .execute()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("An error occurred while fetching rooms");
    });
})

app.get("/getAllEquipments", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const { roomid } = req.query;
  const { tokenErr, user } = await verifyToken(authHeader);
  if (tokenErr?.status == 401) {
    return res.status(tokenErr.status).send(tokenErr.message);
  } else if (tokenErr?.status) {
    return res.status(tokenErr.status).send(tokenErr.message);
  }
  if(user.role != "admin"){
    res.status(401).send("Unauthorized access");
    return;
  }
  const result = await db
    .select()
    .from(equipments)
    .where(eq(equipments.roomid, roomid))
    .execute()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("An error occurred while fetching equipments");
    });
})

// get all classes
app.get("/getAllClasses", async (req, res) => {
  const authHeader = req.headers["authorization"];
  // const { classid } = req.query;
  const { tokenErr, user } = await verifyToken(authHeader);
  if (tokenErr?.status == 401) {
    return res.status(tokenErr.status).send(tokenErr.message);
  } else if (tokenErr?.status) {
    return res.status(tokenErr.status).send(tokenErr.message);
  }
  if(user.role != "admin"){
    res.status(401).send("Unauthorized access");
    return;
  }
  const result = await db
    .select()
    .from(classes)
    // .where(eq(classes.classid, classid))  // maybe add filtering later
    .execute()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("An error occurred while fetching classes");
    });
})

// get all invoices
app.get("/getAllInvoices", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const { memberid } = req.query;
  const { tokenErr, user } = await verifyToken(authHeader);
  if (tokenErr?.status == 401) {
    return res.status(tokenErr.status).send(tokenErr.message);
  } else if (tokenErr?.status) {
    return res.status(tokenErr.status).send(tokenErr.message);
  }
  if(user.role != "admin"){
    res.status(401).send("Unauthorized access");
    return;
  }
  const result = await db
    .select()
    .from(invoices)
    // .where(eq(invoices.memberid, memberid)) // filter specific member invoices later
    .execute()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("An error occurred while fetching invoices");
    });
})


// TODO: Post requests for admin stuffs


app.use((req, res) => {
  res.status(404).send({ message: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
