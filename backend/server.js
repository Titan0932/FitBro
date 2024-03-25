require("dotenv").config();

const { eq, or, asc } = require("drizzle-orm");

const express = require("express");

const app = express();
const port = 3005;

const {verifyToken} = require("./utils/auth");

const userRoutes = require('./routes/users');
const classRoutes = require('./routes/classes');
const scheduleRoutes = require('./routes/schedules');
const memberRoutes = require('./routes/members');
const trainerRoutes = require('./routes/trainers');
const adminRoutes = require('./routes/admin');

// Middleware for checking authorization
app.use(async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const { tokenErr, user } = await verifyToken(authHeader);
  if (tokenErr?.status) {
    return res.status(tokenErr.status).send(tokenErr.message);
  }
  req.user = user;
  next();
});


app.use('/users', userRoutes);

app.use('/classes', classRoutes);

app.use('/schedules', scheduleRoutes);

app.use('/members', memberRoutes);

app.use('/trainers', trainerRoutes);

app.use('/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).send({ message: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
