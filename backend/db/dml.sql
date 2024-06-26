

Insert into users(email, f_name, l_name, user_passw, user_dob) values('johndoe@test.com','John','Doe','$2b$10$ki/l9ZwMlppeiIdTSX3dQ.qznTZm2u8BTNrGG7a9Pl9SiIReFPuYm','1990-01-01'); /* password */
Insert into members(memberID, height, weight) values(1, 6, 79);
Insert into fitness_goals(memberID, goal_title, goal_value, target_date, status) values(1, 'Weight Loss', '65', '2024-12-31', 'incomplete');

Insert into users(email, f_name, l_name, user_passw, user_dob) values('sarahFowler@test.com', 'Sarah', 'Fowler', '$2b$10$MRFdzIjjxc2k8aesAeLgOuWjaQMeDXLnU56OHx0P15QXzurz.51va', '1991-01-01'); /* password1 */
Insert into members(memberID, height, weight) values(2, 5.6, 59);

Insert into users(email, f_name, l_name, user_passw, user_dob) values('jasonThompson@test.com', 'Jason', 'Thompson', '$2b$10$dnwJE2pwLpKLSzTUgZpHoOLCrE10tSNwWjztLSFrur.UM7qhFE8Rm', '1992-01-01');/* password2 */
insert into trainers(trainerID, speciality) values(3, ARRAY['yoga', 'pilates']);

Insert into users(email, f_name, l_name, user_passw, user_dob) values('amyShwartz@test.com', 'Amy', 'Shwarts', '$2b$10$Zan3FhRSDYOezP2PaLloYOxoYKiBSIlk8S9jkpUfXuYU1XRAk9YDu', '1993-01-01');/* password3 */
insert into trainers(trainerID, speciality) values(4, ARRAY['yoga', 'lifting']);

insert into trainer_availability(trainerID, date, start_time, end_time) values(3, '2024-04-21' ,'08:00:00', '14:00:00');
insert into trainer_availability(trainerID, date, start_time, end_time) values(3, '2024-04-22' ,'08:00:00', '15:00:00');
insert into trainer_availability(trainerID, date, start_time, end_time) values(3, '2024-04-23' ,'08:00:00', '14:00:00');
insert into trainer_availability(trainerID, date, start_time, end_time) values(3, '2024-04-24' ,'08:00:00', '13:00:00');
insert into trainer_availability(trainerID, date, start_time, end_time) values(3, '2024-04-25' ,'08:00:00', '17:00:00');

insert into trainer_availability(trainerID, date, start_time, end_time) values(4, '2024-04-21' ,'08:00:00', '17:00:00');
insert into trainer_availability(trainerID, date, start_time, end_time) values(4, '2024-04-22' ,'08:00:00', '16:00:00');

insert into classes(name, description, type, trainerID, price) values('Yoga', 'Yoga for beginners', 'group', 3, 20);
insert into classes(name, description, type, trainerID, price) values('Personal Training', 'Strength Training', 'personal', 3, 50);
insert into classes(name, description, type, trainerID, price) values('Personal Training', 'Pilates Training', 'personal', 4, 50);

insert into users(email, f_name, l_name, user_passw, user_dob) values('margieThatcher@test.com', 'Margie', 'Thatcher', '$2b$10$cjqNt4B37StS14Bbx/OGXew3cm4luQyQ.o2a2kiEPHK20ni3G7kGu', '1993-01-01'); /* password3 */
insert into admins(adminID) values(5);

insert into users(email, f_name, l_name, user_passw, user_dob) values('ravisKumar@test.com', 'Ravis', 'Kumar', '$2b$10$HNwWou8p2/O.de1J62ilhOW7bcHRdCinF0Xgy.2AdtEFlTk4YgXZm', '1994-01-01'); /* password4 */
insert into Admins(adminID) values(6);

insert into rooms(name, status) values('Room 1', 'AVAILABLE');
insert into rooms(name, status) values('Room 2', 'AVAILABLE');
insert into rooms(name, status) values('Room 3', 'AVAILABLE');
insert into rooms(name, status) values('Room 4', 'UNAVAILABLE');

insert into schedules(roomID, classID, date ,start_time, duration, status) values(3, 1, '2024-04-11' ,'08:00:00', 2, 'CONFIRMED');
insert into schedules(roomID, classID, date ,start_time, duration, status) values(3, 1, '2024-04-11' ,'10:00:00', 2, 'CONFIRMED');
insert INTO schedules(roomID, classID, date ,start_time, duration, status) values(2, 1, '2024-04-11' ,'12:00:00', 2, 'CONFIRMED');
insert into schedules(roomID, classID, date ,start_time, duration, status) values(1, 2, '2024-04-11' ,'14:00:00', 2, 'CONFIRMED');

insert into trainer_schedule(trainerID, scheduleID) values(3, 1);
insert into trainer_schedule(trainerID, scheduleID) values(3, 2);
insert INTO trainer_schedule(trainerID, scheduleID) values(3, 3);

insert into trainer_schedule(trainerID, scheduleID) values(4, 4);


insert into equipments(name, status) values('Treadmill', 'working');
insert into equipments(name, status) values('Elliptical', 'working');
insert into equipments(name, status) values('Dumbells', 'broken');

insert into member_schedule(memberID, scheduleID) values(1, 1);
insert into member_schedule(memberID, scheduleID) values(1, 2);
insert into member_schedule(memberID, scheduleID) values(2, 2);
insert into member_schedule(memberID, scheduleID) values(2, 4);

insert into invoices(memberID, amount, date, scheduleID, status) values(1, 20, '2024-04-09', 1, 'paid');
insert into invoices(memberID, amount, date, scheduleID, status) values(1, 20, '2024-04-09', 2, 'paid');
insert into invoices(memberID, amount, date, scheduleID, status) values(2, 20, '2024-04-09', 2, 'paid');
insert into invoices(memberID, amount, date, scheduleID, status) values(2, 50, '2024-04-09', 4, 'paid');

insert into exercises(name, description, type) values('Squats', 'Squat down and get back up. Legs shoulder width apart.', 'legs, glutes');
insert into exercises(name, description, type) values('Pushups', 'Get down on the floor and push yourself up.', 'chest, triceps');
insert into exercises(name, description, type) values('Deadlifts', 'Lift the barbell from the floor to your hips.', 'back, legs');

insert into member_exercises(memberID, exerciseID, reps, weight, start_week) values(1, 1, 12, 50, '2024-04-09');
insert into member_exercises(memberID, exerciseID, reps, weight, start_week) values(1, 2, 12, 0, '2024-04-09');