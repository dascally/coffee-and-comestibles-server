import express from 'express';
import events from './routes/events.js';
import menu from './routes/menu.js';
import order from './routes/order.js';
import users from './routes/users.js';

const app = express();

if (process.env.NODE_ENV === 'development') {
  const { default: morgan } = await import('morgan');
  app.use(morgan('dev'));
}

app.use('/events', events);
app.use('/menu', menu);
app.use('/order', order);
app.use('/users', users);

export default app;
