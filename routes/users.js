import express from 'express';
import bcrypt from 'bcrypt';
import { userExtractor, verifyAdmin } from '../utils/middleware.js';
import User from '../models/user.js';
const router = express.Router();

router
  .route('/')
  .get(userExtractor, verifyAdmin, async (req, res, next) => {
    try {
      const users = await User.find({}).populate([
        'savedPayments',
        'savedOrders',
      ]);

      return res.status(200).json(users);
    } catch (err) {
      return next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      const { email, firstName, lastName, password } = req.body;

      const userExists = await User.findOne({ email });
      if (userExists) {
        const err = new Error('A user with that email already exists.');
        err.name = 'ValidationError';
        throw err;
      }

      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const newUser = new User({ email, firstName, lastName, passwordHash });
      const savedUser = await newUser.save();

      return res
        .status(201)
        .set('Location', `/${savedUser._id}`)
        .json(savedUser);
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
          message: `${req.method} is not supported on the /users path.`,
        });
    } catch (err) {
      return next(err);
    }
  });

router
  .route('/:userId')
  .get(userExtractor, async (req, res, next) => {
    try {
      if (req.params.userId === req.user?._id.toString() || req.user?.admin) {
        const user = await User.findById(req.params.userId);
        return res.status(200).json(user);
      } else {
        const err = new Error(
          "You are not authorized to view other users' data."
        );
        err.name = 'AuthError';
        err.status = 403;
        throw err;
      }
    } catch (err) {
      return next(err);
    }
  })
  .delete(userExtractor, async (req, res, next) => {
    try {
      if (req.params.userId === req.user?._id.toString() || req.user?.admin) {
        const result = await User.findByIdAndDelete(req.params.userId);
        if (result) {
          return res.status(204).end();
        } else {
          return res.status(404).end();
        }
      } else {
        const err = new Error(
          "You are not authorized to delete other users' accounts."
        );
        err.name = 'AuthError';
        err.status = 403;
        throw err;
      }
    } catch (err) {
      return next(err);
    }
  })
  .all((req, res, next) => {
    try {
      return res
        .status(405)
        .set('Allow', 'GET, DELETE')
        .json({
          message: `${req.method} is not supported on the /users/\${ID} path.`,
        });
    } catch (err) {
      return next(err);
    }
  });

router
  .route('/:userId/paymentInfo')
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
  })
  .get((req, res) => {
    res.end(`GET payment info for user ${req.params.userId}`);
  })
  .post((req, res) => {
    res.end(`POST to create paymentInfo for user ${req.params.userId}`);
  })
  .put((req, res) => {
    res.end('PUT not supported for payment info.');
  })
  .delete((req, res) => {
    res.end('DELETE not supported for paymentInfo without ID');
  });
router.post('/:userId/paymentInfo/:paymentInfoId', (req, res) => {
  res.end(
    `POST to edit payment info (id ${req.params.paymentInfoId}) for user ${req.params.userId}`
  );
});
router.delete('/:userId/paymentInfo/:paymentInfoId', (req, res) => {
  res.end(
    `DELETE to remove payment info (id ${req.params.paymentInfoId}) for user ${req.params.userId}`
  );
});

router
  .route('/:userId/savedOrders')
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
  })
  .get((req, res) => {
    res.end(`GET saved orders for user ${req.params.userId}`);
  })
  .post((req, res) => {
    res.end(`POST to create saved order for user ${req.params.userId}`);
  })
  .put((req, res) => {
    res.end('PUT not supported for saved orders.');
  })
  .delete((req, res) => {
    res.end('DELETE not supported for savedOrders without ID');
  });
router.post('/:userId/savedOrders/:savedOrderId', (req, res) => {
  res.end(
    `POST to edit saved order (id ${req.params.savedOrderId}) for user ${req.params.userId}`
  );
});
router.delete('/:userId/savedOrders/:savedOrderId', (req, res) => {
  res.end(
    `DELETE to remove saved order (id ${req.params.savedOrderId}) for user ${req.params.userId}`
  );
});

export default router;
