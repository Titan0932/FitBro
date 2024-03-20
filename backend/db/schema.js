const { serial, text, integer, date, decimal, time, pgTable } = require('drizzle-orm/pg-core');

// const db = require("../dbConnect")

const users = pgTable('users', {
  userid: serial('userid').primaryKey(),
  email: text('email').notNull(),
  f_name: text('f_name').notNull(),
  l_name: text('l_name').notNull(),
  user_name: text('user_name').notNull(),
  user_passw: text('user_passw').notNull(),
  user_dob: date('user_dob'),
});

const members = pgTable('members', {
  memberid: integer('memberid').primaryKey().references(users.userid),
  health_metrics: text('health_metrics'),
});


const fitness_goals = pgTable('fitness_goals', {
    memberid: integer('memberid').primaryKey().references(members.memberid),
    goal_type: text('goal_type'),
    goal_value: text('goal_value'),
  });
  
  const trainers = pgTable('trainers', {
    trainerid: integer('trainerid').primaryKey().references(users.userid),
    speciality: text('speciality').array()
  });
  
  const trainer_availability = pgTable('trainer_availability', {
    availabilityid: serial('availabilityid').primaryKey(),
    trainerid: integer('trainerid').references(trainers.trainerid),
    day_of_week: integer('day_of_week'),
    start_time: time('start_time'),
    end_time: time('end_time'),
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
    invoiceid: serial('invoiceid').primaryKey(),
    memberid: integer('memberid').references(members.memberid),
    amount: decimal('amount').notNull(),
    date: date('date').notNull(),
    scheduleid: integer('scheduleid').references(schedules.scheduleid),
    status: text('status').notNull(),
  });

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
  };
