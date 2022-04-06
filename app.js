import express from 'express';
import mongoose from 'mongoose';
import eventsRouter from './routes/events.js';
import menuRouter from './routes/menu.js';
import ordersRouter from './routes/orders.js';
import usersRouter from './routes/users.js';
import loginRouter from './routes/login.js';
import { DB_URL } from './utils/config.js';

const app = express();
mongoose
  .connect(DB_URL)
  .then(() => {
    console.log('Connected to DB.');
  })
  .catch((err) => {
    console.error('Error connecting to DB:', err.message);
  });

if (process.env.NODE_ENV === 'development') {
  const { default: morgan } = await import('morgan');
  app.use(morgan('dev'));
}

app.use(express.json());
app.use('/events', eventsRouter);
app.use('/menu', menuRouter);
app.use('/orders', ordersRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);

app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  } else if (err.name === 'AuthError') {
    return res
      .status(401)
      .set('WWW-Authenticate', 'Bearer')
      .json({ message: err.message });
  }

  return next(err);
});

export default app;
