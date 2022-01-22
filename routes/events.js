import express from 'express';
const router = express.Router();

router
  .route('/')
  .all((req, res, next) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write(`Received a ${req.method} request for ${req.url}.\n`);
    next();
  })
  .get((req, res) => {
    res.end(
      'Got a GET request for /events. This will return JSON for all events.'
    );
  })
  .post((req, res) => {
    res.end('This will be used to add an event. (POST)');
  })
  .put((req, res) => {
    res.end('PUT not supported');
  })
  .delete((req, res) => {
    res.end('DELETE not supported');
  });

router
  .route('/:eventId')
  .all((req, res, next) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write(`Got a request at /events/${req.params.eventId}.\n`);
    next();
  })
  .get((req, res) => {
    res.end(`Got a GET request for the event ${req.params.eventId}.`);
  })
  .post((req, res) => {
    res.end('This will be used to edit an event. (POST)');
  })
  .put((req, res) => {
    res.end('PUT not supported');
  })
  .delete((req, res) => {
    res.end('This will DELETE an event.');
  });

export default router;
