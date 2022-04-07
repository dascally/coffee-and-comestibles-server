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
  .get(async (req, res, next) => {
    try {
      const event = await Event.findById(req.params.eventId);

      if (event) {
        res.status(200).json(event);
      } else {
        res.status(404).end();
      }
    } catch (err) {
      return next(err);
    }
  })
  .put(userExtractor, verifyAdmin, async (req, res, next) => {
    try {
      const updatedEvent = await Event.findByIdAndUpdate(
        req.params.eventId,
        {
          title: req.body.title,
          datetime: new Date(req.body.datetime),
          description: req.body.description,
          image: req.body.image || undefined,
        },
        { new: true, runValidators: true }
      );

      return res.status(200).json(updatedEvent);
    } catch (err) {
      return next(err);
    }
  })
  .delete(userExtractor, verifyAdmin, async (req, res, next) => {
    try {
      const result = await Event.findByIdAndDelete(req.params.eventId);

      if (result) {
        return res.status(204).end();
      } else {
        return res.status(404).end();
      }
    } catch (err) {
      return next(err);
    }
  })
  .all((req, res, next) => {
    try {
      return res
        .status(405)
        .set('Allow', 'GET, PUT, DELETE')
        .json({
          message: `${req.method} is not supported on the /events/\${ID} path.`,
        });
    } catch (err) {
      return next(err);
    }
  });

export default router;
