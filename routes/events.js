import express from 'express';
import { userExtractor, verifyAdmin } from '../utils/middleware.js';
import Event from '../models/event.js';
const router = express.Router();

router
  .route('/')
  .get(async (req, res, next) => {
    try {
      const events = await Event.find({});

      return res.status(200).json(events);
    } catch (err) {
      return next(err);
    }
  })
  .post(userExtractor, verifyAdmin, async (req, res, next) => {
    try {
      const newEvent = new Event({
        title: req.body.title,
        datetime: new Date(req.body.datetime),
        description: req.body.description,
        image: req.body.image || undefined,
      });

      const savedEvent = await newEvent.save();

      return res
        .status(201)
        .set('Location', `/${savedEvent._id}`)
        .json(savedEvent);
    } catch (err) {
      return next(err);
    }
  })
  .all((req, res, next) => {
    try {
      return res
        .status(405)
        .set('Allow', 'GET, POST')
        .json({
          message: `${req.method} is not supported on the /events path.`,
        });
    } catch (err) {
      return next(err);
    }
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
