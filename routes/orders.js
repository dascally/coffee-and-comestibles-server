import express from 'express';
import { createOrderIdList } from '../utils/helpers.js';
import Invoice from '../models/invoice.js';
const router = express.Router();

router
  .route('/')
  .post(async (req, res, next) => {
    try {
      const {
        contactPhone,
        contactName,
        ccInfo,
        user,
        orderList: rawOrderList,
      } = req.body;

      const cookedOrderList = await createOrderIdList(rawOrderList);

      const newInvoice = new Invoice({
        status: 'received',
        contactPhone,
        contactName,
        ccInfo,
        user,
        orderList: cookedOrderList,
      });

      const savedInvoice = await newInvoice.save();

      return res
        .status(201)
        .set('Location', `/${savedInvoice._id}`)
        .json(savedInvoice);
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
      const invoice = await Invoice.findById(req.params.orderId);

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
  .put(async (req, res, next) => {
    try {
      const invoice = await Invoice.findById(req.params.orderId);
      if (!invoice) {
        return res.status(404).end();
      } else if (invoice.status !== 'received') {
        return res
          .status(400)
          .json({ message: 'PUT may only be used to modify standing orders.' });
      }

      const {
        contactPhone,
        contactName,
        ccInfo,
        user,
        orderList: rawOrderList,
      } = req.body;

      const cookedOrderList = await createOrderIdList(rawOrderList);

      const updatedInvoice = await Invoice.findByIdAndUpdate(
        req.params.orderId,
        {
          status: 'received',
          contactPhone,
          contactName,
          ccInfo,
          user,
          orderList: cookedOrderList,
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
