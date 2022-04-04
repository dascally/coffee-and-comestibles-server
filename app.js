import express from 'express';
import eventsRouter from './routes/events.js';
import menuRouter from './routes/menu.js';
import ordersRouter from './routes/orders.js';
import usersRouter from './routes/users.js';

const app = express();

if (process.env.NODE_ENV === 'development') {
  const { default: morgan } = await import('morgan');
  app.use(morgan('dev'));
}

app.use(express.json());
app.use('/events', eventsRouter);
app.use('/menu', menuRouter);
app.use('/orders', ordersRouter);
app.use('/users', usersRouter);

export default app;
