CREATE DATABASE FITBRO;

CREATE TABLE users(
    userID SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    f_name TEXT NOT NULL,
    l_name TEXT NOT NULL,
    user_passw TEXT NOT NULL,
    user_dob DATE,
    city TEXT,
    country TEXT,
    phoneNo TEXT,
    state TEXT
);

CREATE TABLE members(
    memberID INTEGER PRIMARY KEY REFERENCES users(userID),
    height DECIMAL,
    weight DECIMAL
    -- health_metrics TEXT
);

CREATE TABLE fitness_goals(
    goalID SERIAL,
    memberID INTEGER REFERENCES members(memberID),
    goal_title TEXT NOT NULL,
    goal_description TEXT,
    goal_value TEXT,
    goal_start DATE,
    target_date DATE,
    achieved_date DATE,
    status TEXT NOT NULL,
    PRIMARY KEY (goalID, memberID)
);

CREATE TABLE trainers(
    trainerID INTEGER PRIMARY KEY REFERENCES users(userID),
    speciality TEXT[]
);

CREATE TABLE trainer_availability (
    availabilityId SERIAL UNIQUE,
    trainerID INTEGER REFERENCES trainers(trainerID),
    date DATE Not NULL, -- specific date of availability
    start_time TIME Not NULL,
    end_time TIME Not NULL,
    CONSTRAINT unique_availability UNIQUE (trainerID, date)
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
    roomID INTEGER REFERENCES rooms(roomID),
    status TEXT NOT NULL
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
    invoiceID SERIAL UNIQUE,
    memberID INTEGER REFERENCES members(memberID),
    amount DECIMAL NOT NULL,
    date DATE NOT NULL,
    scheduleID INTEGER REFERENCES schedules(scheduleID),
    status TEXT NOT NULL,
    PRIMARY KEY (scheduleID, memberID)
);


CREATE TABLE exercises(
    exerciseid SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT
);

CREATE TABLE member_exercises (
    memberID INTEGER REFERENCES members(memberID),
    exerciseID INTEGER REFERENCES exercises(exerciseID),
    reps INTEGER,
    weight DECIMAL,
    start_week Date, -- week starting date
    PRIMARY KEY (memberID, exerciseID, start_week)
);

