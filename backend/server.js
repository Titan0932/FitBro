require("dotenv").config();

const express = require("express");
require("dotenv").config();

const app = express();
const port = process.env.APP_PORT || 3005;

const userRoutes = require('./routes/users');
const classRoutes = require('./routes/classes');
const scheduleRoutes = require('./routes/schedules');
const memberRoutes = require('./routes/members');
const trainerRoutes = require('./routes/trainers');
const adminRoutes = require('./routes/admin');

const {authMiddleware} = require("./utils/auth");

const cors = require('cors');

app.use(cors({
  origin: process.env.CORS
}));

app.use(express.urlencoded({ extended: true }));

app.use('/users', userRoutes);

app.use('/classes', authMiddleware, classRoutes);

app.use('/schedules', authMiddleware, scheduleRoutes);

app.use('/members', authMiddleware, memberRoutes);

app.use('/trainers', authMiddleware, trainerRoutes);

app.use('/admin', authMiddleware, adminRoutes);

app.use((req, res) => {
  res.status(404).send({ message: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});