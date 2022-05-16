import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  userExtractor,
  verifyAdmin,
  verifySelfOrAdmin,
} from '../utils/middleware.js';
import { createOrderList } from '../utils/helpers.js';
import User from '../models/user.js';
import PaymentInfo from '../models/paymentInfo.js';
import SavedOrder from '../models/savedOrder.js';
import OrderItem from '../models/orderItem.js';
import { SECRET } from '../utils/config.js';
const router = express.Router();

router
  .route('/')
  .get(userExtractor, verifyAdmin, async (req, res, next) => {
    try {
      const users = await User.find({}).populate([
        'savedPayments',
        {
          path: 'savedOrders',
          populate: {
            path: 'orderList',
            populate: { path: 'menuItem' },
          },
        },
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

      const tokenPayload = { id: savedUser._id };
      const token = jwt.sign(tokenPayload, SECRET, { expiresIn: 60 * 60 * 24 });

      const user = {
        token,
        id: savedUser._id,
        email: savedUser.email,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
      };

      return res.status(201).set('Location', `/${savedUser._id}`).json(user);
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
  .get(userExtractor, verifySelfOrAdmin, async (req, res, next) => {
    try {
      const user = await User.findById(req.params.userId).populate(
        'savedPayments'
      );
      return res.status(200).json(user.savedPayments);
    } catch (err) {
      return next(err);
    }
  })
  .post(userExtractor, verifySelfOrAdmin, async (req, res, next) => {
    try {
      const newPaymentInfo = new PaymentInfo(req.body);
      const savedPaymentInfo = await newPaymentInfo.save();

      const user = await User.findById(req.params.userId);
      user.savedPayments.push(savedPaymentInfo._id);
      await user.save();

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
          message: `${req.method} is not supported on the /users/\${ID}/savedPayments path.`,
        });
    } catch (err) {
      return next(err);
    }
  });

router
  .route('/:userId/savedPayments/:paymentInfoId')
  .get(userExtractor, verifySelfOrAdmin, async (req, res, next) => {
    try {
      const paymentInfo = await PaymentInfo.findById(req.params.paymentInfoId);

      if (paymentInfo) {
        return res.status(200).json(paymentInfo);
      } else {
        return res.status(404).end();
      }
    } catch (err) {
      return next(err);
    }
  })
  .put(userExtractor, verifySelfOrAdmin, async (req, res, next) => {
    try {
      if (Object.keys(req.body).length === 0) {
        const err = new Error('No fields were specified for updating.');
        err.name = 'ValidationError';
        throw err;
      }

      const updatedPaymentInfo = await PaymentInfo.findByIdAndUpdate(
        req.params.paymentInfoId,
        req.body,
        { new: true, runValidators: true }
      );

      if (!updatedPaymentInfo) {
        return res.status(404).end();
      }

      return res.status(200).json(updatedPaymentInfo);
    } catch (err) {
      return next(err);
    }
  })
  .delete(userExtractor, verifySelfOrAdmin, async (req, res, next) => {
    try {
      const result = await PaymentInfo.findByIdAndDelete(
        req.params.paymentInfoId
      );

      req.user.savedPayments = req.user.savedPayments.filter(
        (payment) => payment._id.toString() !== req.params.paymentInfoId
      );
      req.user.save();

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
          message: `${req.method} is not supported on the /users/\${ID}/savedPayments/\${ID} path.`,
        });
    } catch (err) {
      return next(err);
    }
  });

router
  .route('/:userId/savedOrders')
  .get(userExtractor, verifySelfOrAdmin, async (req, res, next) => {
    try {
      const user = await User.findById(req.params.userId).populate({
        path: 'savedOrders',
        populate: {
          path: 'orderList',
          populate: { path: 'menuItem' },
        },
      });
      return res.status(200).json(user.savedOrders);
    } catch (err) {
      return next(err);
    }
  })
  .post(userExtractor, verifySelfOrAdmin, async (req, res, next) => {
    try {
      const orderList = await createOrderList(req.body.orderList ?? []);

      const cookedOrderIdList = await Promise.all(
        orderList.map(async (orderItem) => {
          const newOrderItem = new OrderItem({
            menuItem: orderItem.menuItem,
            selectedOptions: orderItem.selectedOptions,
          });
          const savedOrderItem = await newOrderItem.save();
          return savedOrderItem._id;
        })
      );

      const newSavedOrder = new SavedOrder({
        name: req.body.name,
        orderList: cookedOrderIdList,
      });
      const savedSavedOrder = await newSavedOrder.save();

      const user = await User.findById(req.params.userId);
      user.savedOrders.push(savedSavedOrder._id);
      await user.save();

      const savedOrder = await SavedOrder.findById(
        savedSavedOrder._id
      ).populate({ path: 'orderList', populate: { path: 'menuItem' } });

      return res
        .status(201)
        .set('Location', `/${savedSavedOrder._id}`)
        .json(savedOrder);
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
          message: `${req.method} is not supported on the /users/\${ID}/savedOrders path.`,
        });
    } catch (err) {
      return next(err);
    }
  });

router
  .route('/:userId/savedOrders/:savedOrderId')
  .get(userExtractor, verifySelfOrAdmin, async (req, res, next) => {
    try {
      const savedOrder = await SavedOrder.findById(
        req.params.savedOrderId
      ).populate({ path: 'orderList', populate: { path: 'menuItem' } });

      if (savedOrder) {
        return res.status(200).json(savedOrder);
      } else {
        return res.status(404).end();
      }
    } catch (err) {
      return next(err);
    }
  })
  .put(userExtractor, verifySelfOrAdmin, async (req, res, next) => {
    try {
      if (Object.keys(req.body).length === 0) {
        const err = new Error('No fields were specified for updating.');
        err.name = 'ValidationError';
        throw err;
      }

      const cookedOrderList = await createOrderList(req.body.orderList ?? []);
      const cookedOrderIdList = cookedOrderList.map(
        (orderItem) => orderItem._id
      );

      const updatedSavedOrder = await SavedOrder.findByIdAndUpdate(
        req.params.savedOrderId,
        {
          name: req.body.name,
          orderList: cookedOrderIdList,
        },
        { new: true, runValidators: true }
      );

      if (!updatedSavedOrder) {
        return res.status(404).end();
      }

      return res.status(200).json(updatedSavedOrder);
    } catch (err) {
      return next(err);
    }
  })
  .delete(userExtractor, verifySelfOrAdmin, async (req, res, next) => {
    try {
      const result = await SavedOrder.findByIdAndDelete(
        req.params.savedOrderId
      );

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
          message: `${req.method} is not supported on the /users/\${ID}/savedOrders/\${ID} path.`,
        });
    } catch (err) {
      return next(err);
    }
  });

export default router;
