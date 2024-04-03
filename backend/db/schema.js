const { serial, text, integer, date, decimal, time, pgTable } = require('drizzle-orm/pg-core');

// const db = require("../dbConnect")

const users = pgTable('users', {
  userid: serial('userid').primaryKey(),
  email: text('email').notNull().unique(),
  f_name: text('f_name').notNull(),
  l_name: text('l_name').notNull(),
  user_passw: text('user_passw').notNull(),
  user_dob: date('user_dob'),
  city: text('city'),
  country: text('country'),
  phoneno: text('phoneno'),
  state: text('state'),
});

const members = pgTable('members', {
  memberid: integer('memberid').primaryKey().references(users.userid),
  health_metrics: text('health_metrics'),
});


const fitness_goals = pgTable('fitness_goals', {
    goalid: serial('goalid').primaryKey(),
    memberid: integer('memberid').primaryKey().references(members.memberid),
    goal_title: text('goal_title'),
    goal_description: text('goal_description'),
    goal_value: text('goal_value'),
    goal_start: date('goal_start'),
    target_date: date('target_date'),
    achieved_date: date('achieved_date'),
    status: text('status'),
  });
  
  const trainers = pgTable('trainers', {
    trainerid: integer('trainerid').primaryKey().references(users.userid),
    speciality: text('speciality').array()
  });
  
  const trainer_availability = pgTable('trainer_availability', {
    availabilityid: serial('availabilityid').unique(),
    trainerid: integer('trainerid').references(trainers.trainerid),
    date: date('date').notNull(),
    start_time: time('start_time').notNull(),
    end_time: time('end_time').notNull(),
  });
  
  const admins = pgTable('admins', {
    adminid: integer('adminid').primaryKey().references(users.userid),
  });
  
  const classes = pgTable('classes', {
    classid: serial('classid').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    type: text('type'),
    trainerid: integer('trainerid').references(trainers.trainerid),
    price: decimal('price').notNull(),
  });
  
  const rooms = pgTable('rooms', {
    roomid: serial('roomid').primaryKey(),
    name: text('name').notNull(),
  });
  
  const equipments = pgTable('equipments', {
    equipmentid: serial('equipmentid').primaryKey(),
    name: text('name').notNull(),
    status: text('status').notNull(),
    roomid: integer('roomid').references(rooms.roomid),
  });
  
  const schedules = pgTable('schedules', {
    scheduleid: serial('scheduleid').primaryKey(),
    date: date('date').notNull(),
    start_time: time('start_time').notNull(),
    duration: integer('duration').notNull(),
    classid: integer('classid').references(classes.classid),
    roomid: integer('roomid').references(rooms.roomid),
    status: text('status').notNull(),
  });
  
  const member_schedule = pgTable('member_schedule', {
    memberid: integer('memberid').primaryKey().references(members.memberid),
    scheduleid: integer('scheduleid').references(schedules.scheduleid),
  });
  
  const trainer_schedule = pgTable('trainer_schedule', {
    trainerid: integer('trainerid').primaryKey().references(trainers.trainerid),
    scheduleid: integer('scheduleid').references(schedules.scheduleid),
  });
  
  const invoices = pgTable('invoices', {
    invoiceid: serial('invoiceid').unique(),
    memberid: integer('memberid').references(members.memberid).primaryKey(),
    amount: decimal('amount').notNull(),
    date: date('date').notNull(),
    scheduleid: integer('scheduleid').references(schedules.scheduleid).primaryKey(),
    status: text('status').notNull(),
  });

  
const exercises = pgTable('exercises', {
    exerciseid: serial('exerciseid').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    type: text('type'),
})

const member_exercises = pgTable('member_exercises', {
    memberid: integer('memberid').primaryKey().references(members.memberid),
    exerciseid: integer('exerciseid').primaryKey().references(exercises.exerciseid),
    reps: integer('reps'),
    weight: decimal('weight'),
    start_week: date('start_week').primaryKey(),
})

  module.exports = {
    users,
    members,
    fitness_goals,
    trainers,
    trainer_availability,
    admins,
    classes,
    rooms,
    equipments,
    schedules,
    member_schedule,
    trainer_schedule,
    invoices,
    exercises,
    member_exercises
  };

