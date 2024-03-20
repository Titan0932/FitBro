CREATE DATABASE FITBRO;

CREATE TABLE users(
    userID SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    f_name TEXT NOT NULL,
    l_name TEXT NOT NULL,
    user_name TEXT NOT NULL UNIQUE,
    user_passw TEXT NOT NULL,
    user_dob DATE
);

CREATE TABLE members(
    memberID INTEGER PRIMARY KEY REFERENCES users(userID),
    health_metrics TEXT
);

CREATE TABLE fitness_goals(
    memberID INTEGER REFERENCES members(memberID),
    goal_type TEXT,
    goal_value TEXT,
    PRIMARY KEY (memberID)
);

CREATE TABLE trainers(
    trainerID INTEGER PRIMARY KEY REFERENCES users(userID),
    speciality TEXT[]
);

CREATE TABLE trainer_availability (
    availabilityId SERIAL PRIMARY KEY,
    trainerID INTEGER REFERENCES trainers(trainerID),
    day_of_week INTEGER, -- 1 (Monday) to 7 (Sunday)
    start_time TIME,
    end_time TIME
);

CREATE TABLE admins(
    adminId INTEGER PRIMARY KEY REFERENCES users(userID)
);

CREATE TABLE classes(
    classId SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT,
    trainerID INTEGER REFERENCES trainers(trainerID),
    price DECIMAL NOT NULL
);

CREATE TABLE rooms(
    roomID SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE equipments(
    equipmentId SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT NOT NULL,
    roomID INTEGER REFERENCES rooms(roomID)
);

CREATE TABLE schedules(
    scheduleID SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    duration INTEGER NOT NULL,
    classId INTEGER REFERENCES classes(classId),
    roomID INTEGER REFERENCES rooms(roomID)
);

CREATE TABLE member_schedule(
    memberID INTEGER REFERENCES members(memberID),
    scheduleID INTEGER REFERENCES schedules(scheduleID),
    PRIMARY KEY (memberID, scheduleID)
);

CREATE TABLE trainer_schedule(
    trainerID INTEGER REFERENCES trainers(trainerID),
    scheduleID INTEGER REFERENCES schedules(scheduleID),
    PRIMARY KEY (trainerID, scheduleID)
);

CREATE TABLE invoices(
    invoiceID SERIAL PRIMARY KEY,
    memberID INTEGER REFERENCES members(memberID),
    amount DECIMAL NOT NULL,
    date DATE NOT NULL,
    scheduleID INTEGER REFERENCES schedules(scheduleID),
    status TEXT NOT NULL
);

