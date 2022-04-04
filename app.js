import express from 'express';
import eventsRouter from './routes/events.js';
import menuRouter from './routes/menu.js';
import orderRouter from './routes/order.js';
import usersRouter from './routes/users.js';

const app = express();

if (process.env.NODE_ENV === 'development') {
  const { default: morgan } = await import('morgan');
  app.use(morgan('dev'));
}

app.use('/events', eventsRouter);
app.use('/menu', menuRouter);
app.use('/order', orderRouter);
app.use('/users', usersRouter);

export default app;
