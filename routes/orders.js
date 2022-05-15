import express from 'express';
import { createOrderList } from '../utils/helpers.js';
import Invoice from '../models/invoice.js';
import User from '../models/user.js';
const router = express.Router();

const extractOrderList = async (req, res, next) => {
  const { userId, orderList: rawOrderList } = req.body;

  const cookedOrderList = await createOrderList(rawOrderList);
  const populatedOrderList = await Promise.all(
    cookedOrderList.map((orderItem) => orderItem.populate('menuItem'))
  );

  // 1 reward point is equivalent to 1 cent
  const totalRewardsBeingSpent = populatedOrderList.reduce((sum, orderItem) => {
    return sum + (orderItem.useRewards ? orderItem.menuItem.price : 0);
  }, 0);

  if (totalRewardsBeingSpent > 0 && !userId) {
    return res.status(400).json({
      message: 'Can not spend rewards points without an account.',
    });
  }

  const user = await User.findById(userId);
  if (userId && !user) {
    return res
      .status(400)
      .json({ message: `User ID ${userId} can not be found.` });
  }

  if (user && totalRewardsBeingSpent > user.rewards) {
    return res
      .status(400)
      .json({ message: 'User does not have enough rewards points.' });
  }

  const cookedOrderIdList = cookedOrderList.map((orderItem) => orderItem._id);
  req.orderIdList = cookedOrderIdList;

  return next();
};

router
  .route('/')
  .post(extractOrderList, async (req, res, next) => {
    try {
      const newInvoice = new Invoice({
        status: 'received',
        contactPhone: req.body.contactPhone,
        contactName: req.body.contactName,
        ccInfo: req.body.ccInfo,
        user: req.body.userId,
        orderList: req.orderIdList,
      });

      const savedInvoice = await newInvoice.save();
      const invoice = await Invoice.findById(savedInvoice._id).populate(
        'orderList'
      );

      return res
        .status(201)
        .set('Location', `/${savedInvoice._id}`)
        .json(invoice);
    } catch (err) {
      next(err);
    }
  })
  .all((req, res, next) => {
    try {
      return res
        .status(405)
        .set('Allow', 'POST')
        .json({
          message: `${req.method} is not supported on the /order path.`,
        });
    } catch (err) {
      return next(err);
    }
  });

router
  .route('/:orderId')
  .get(async (req, res, next) => {
    try {
      const invoice = await Invoice.findById(req.params.orderId).populate(
        'orderList'
      );

      if (invoice) {
        return res.status(200).json(invoice);
      } else {
        return res.status(404).end();
      }
    } catch (err) {
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      const invoice = await Invoice.findById(req.params.orderId);
      if (!invoice) {
        return res.status(404).end();
      }

      if (invoice.status === 'received' && req.body.status === 'canceled') {
        invoice.status = req.body.status;
        const updatedInvoice = await invoice.save();
        return res.status(200).json(updatedInvoice);
      } else {
        return res.status(400).json({
          message: 'POST may only be used to cancel a standing order.',
        });
      }
    } catch (err) {
      next(err);
    }
  })
  .put(extractOrderList, async (req, res, next) => {
    try {
      const invoice = await Invoice.findById(req.params.orderId);
      if (!invoice) {
        return res.status(404).end();
      } else if (invoice.status !== 'received') {
        return res
          .status(400)
          .json({ message: 'PUT may only be used to modify standing orders.' });
      }

      const updatedInvoice = await Invoice.findByIdAndUpdate(
        req.params.orderId,
        {
          status: 'received',
          contactPhone: req.body.contactPhone,
          contactName: req.body.contactName,
          ccInfo: req.body.ccInfo,
          user: req.body.userId,
          orderList: req.orderIdList,
        },
        { new: true, runValidators: true }
      );

      return res.status(200).json(updatedInvoice);
    } catch (err) {
      next(err);
    }
  })
  .all((req, res, next) => {
    try {
      return res
        .status(405)
        .set('Allow', 'GET, POST, PUT')
        .json({
          message: `${req.method} is not supported on the /order/\${ID} path.`,
        });
    } catch (err) {
      return next(err);
    }
  });

export default router;
