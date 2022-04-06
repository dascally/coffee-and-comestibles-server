import express from 'express';
import bcrypt from 'bcrypt';
import {
  userExtractor,
  verifyAdmin,
  verifySelfOrAdmin,
} from '../utils/middleware.js';
import User from '../models/user.js';
import PaymentInfo from '../models/paymentInfo.js';
const router = express.Router();

router
  .route('/')
  .get(userExtractor, verifyAdmin, async (req, res, next) => {
    try {
      const users = await User.find({});
      // .populate([
      //   'savedPayments',
      //   'savedOrders',
      // ]);

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
  .get(userExtractor, verifySelfOrAdmin, async (req, res, next) => {
    try {
      const user = await User.findById(req.params.userId);
      return res.status(200).json(user);
    } catch (err) {
      return next(err);
    }
  })
  .delete(userExtractor, verifySelfOrAdmin, async (req, res, next) => {
    try {
      const result = await User.findByIdAndDelete(req.params.userId);
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
        .set('Allow', 'GET, DELETE')
        .json({
          message: `${req.method} is not supported on the /users/\${ID} path.`,
        });
    } catch (err) {
      return next(err);
    }
  });

router
  .route('/:userId/savedPayments')
  .get(userExtractor, async (req, res, next) => {
    try {
      const user = await req.user.populate('savedPayments');
      return res.status(200).json(user.savedPayments);
    } catch (err) {
      return next(err);
    }
  })
  .post(userExtractor, async (req, res, next) => {
    try {
      const newPaymentInfo = new PaymentInfo(req.body);
      const savedPaymentInfo = await newPaymentInfo.save();

      req.user.savedPayments.push(savedPaymentInfo._id);
      await req.user.save();

      return res
        .status(201)
        .set('Location', `/${savedPaymentInfo._id}`)
        .json(savedPaymentInfo);
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
          message: `${req.method} is not supported on the /users/\${ID}/paymentInfo path.`,
        });
    } catch (err) {
      return next(err);
    }
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
