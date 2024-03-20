

Insert into users(email, f_name, l_name, user_name, user_passw, user_dob) values('johndoe@test.com','John','Doe','johndoe','$2b$10$A63RoL1ZRrV7lPuJkrCW5Oef5Ta8umet0tuO4Gux1YbI47xcRXdd2','1990-01-01'); /* password */
Insert into members(memberID, health_metrics) values(1, 'weight: 79, height: 6ft');
Insert into fitness_goals(memberID, goal_type, goal_value) values(1, 'weight', '70');

Insert into users(email, f_name, l_name, user_name, user_passw, user_dob) values('sarahFowler@test.com', 'Sarah', 'Fowler', 'sarahFowler', '$2b$10$MRFdzIjjxc2k8aesAeLgOuWjaQMeDXLnU56OHx0P15QXzurz.51va', '1991-01-01'); /* password1 */
Insert into members(memberID, health_metrics) values(2, 'weight: 59, height: 5.6ft');

Insert into users(email, f_name, l_name, user_name, user_passw, user_dob) values('jasonThompson@test.com', 'Jason', 'Thompson', 'jasonThompson', '$2b$10$dnwJE2pwLpKLSzTUgZpHoOLCrE10tSNwWjztLSFrur.UM7qhFE8Rm', '1992-01-01');/* password2 */
insert into trainers(trainerID, speciality) values(3, ARRAY['yoga', 'pilates']);

Insert into users(email, f_name, l_name, user_name, user_passw, user_dob) values('amyShwartz@test.com', 'Amy', 'Shwarts', 'amyShwarts', '$2b$10$Zan3FhRSDYOezP2PaLloYOxoYKiBSIlk8S9jkpUfXuYU1XRAk9YDu', '1993-01-01');/* password3 */
insert into trainers(trainerID, speciality) values(4, ARRAY['yoga', 'lifting']);

insert into trainer_availability(trainerID, day_of_week, start_time, end_time) values(3, 1 ,'08:00:00', '14:00:00');
insert into trainer_availability(trainerID, day_of_week, start_time, end_time) values(3, 2 ,'08:00:00', '15:00:00');
insert into trainer_availability(trainerID, day_of_week, start_time, end_time) values(3, 3 ,'08:00:00', '14:00:00');
insert into trainer_availability(trainerID, day_of_week, start_time, end_time) values(3, 4 ,'08:00:00', '13:00:00');
insert into trainer_availability(trainerID, day_of_week, start_time, end_time) values(3, 5 ,'08:00:00', '17:00:00');

insert into trainer_availability(trainerID, day_of_week, start_time, end_time) values(4, 6 ,'08:00:00', '17:00:00');
insert into trainer_availability(trainerID, day_of_week, start_time, end_time) values(4, 7 ,'08:00:00', '16:00:00');

insert into classes(name, description, type, trainerID, price) values('Yoga', 'Yoga for beginners', 'group', 3, 20);
insert into classes(name, description, type, trainerID, price) values('Personal Training', 'Pilates Training', 'personal', 4, 50);

insert into users(email, f_name, l_name, user_name, user_passw, user_dob) values('margieThatcher@test.com', 'Margie', 'Thatcher', 'margieThatcher', 'password3', '1993-01-01');
insert into admins(adminID) values(5);

insert into users(email, f_name, l_name, user_name, user_passw, user_dob) values('ravisKumar@test.com', 'Ravis', 'Kumar', 'ravisKumar', 'password4', '1994-01-01');
insert into Admins(adminID) values(6);

insert into rooms(name) values('Room 1');
insert into rooms(name) values('Room 2');
insert into rooms(name) values('Room 3');

insert into schedules(roomID, classID, date ,start_time, duration) values(3, 1, '2024-04-11' ,'08:00:00', 2);
insert into schedules(roomID, classID, date ,start_time, duration) values(3, 1, '2024-04-11' ,'10:00:00', 2);
insert INTO schedules(roomID, classID, date ,start_time, duration) values(2, 1, '2024-04-11' ,'12:00:00', 2);
insert into schedules(roomID, classID, date ,start_time, duration) values(1, 2, '2024-04-11' ,'14:00:00', 2);

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



