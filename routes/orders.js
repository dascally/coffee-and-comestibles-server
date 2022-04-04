import express from 'express';
import Invoice from '../models/invoice.js';
import OrderItem from '../models/orderItem.js';
const router = express.Router();

router
  .route('/')
  .all((req, res, next) => {
    res.type('application/json');
    next();
  })
  .get((req, res) => {
    res.status(405).set('Allow', 'POST').json({
      message: 'GET is not supported on the /order path. Try /order/${ID}.',
    });
  })
  .post(async (req, res, next) => {
    try {
      const {
        contactPhone,
        contactName,
        ccInfo,
        user,
        orderList: rawOrderList,
      } = req.body;

      console.log('rawOrderList', rawOrderList);

      const cookedOrderList = await Promise.all(
        rawOrderList.map(async (orderItem) => {
          const newOrderItem = new OrderItem(orderItem);
          const savedOrderItem = await newOrderItem.save();
          return savedOrderItem._id;
        })
      );

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
  .put((req, res) => {
    res.status(405).set('Allow', 'POST').json({
      message: 'PUT is not supported on the /order path. Try /order/${ID}.',
    });
  })
  .delete((req, res) => {
    res.status(405).set('Allow', 'POST').json({
      message: 'DELETE is not supported on the /order path.',
    });
  });

router
  .route('/:orderId')
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
  })
  .get((req, res) => {
    res.end(`GET order info for order ${req.params.orderId}.`);
  })
  .post((req, res) => {
    res.end(`POST to edit order ${req.params.orderId}.`);
  })
  .put((req, res) => {
    res.end('PUT not supported on /order/:orderId.');
  })
  .delete((req, res) => {
    res.end(`Cancel order ${req.params.orderId}.`);
  });

export default router;
