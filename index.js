import express from 'express';
import morgan from 'morgan';
import events from './routes/events.js';
import menu from './routes/menu.js';
import order from './routes/order.js';
import users from './routes/users.js';

const hostname = 'localhost';
const port = 3002;

const app = express();
if (app.settings.env === 'development') {
  app.use(morgan('dev'));
}

app.use('/events', events);
app.use('/menu', menu);
app.use('/order', order);
app.use('/users', users);

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
