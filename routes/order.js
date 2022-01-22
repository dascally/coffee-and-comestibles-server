import express from 'express';
const router = express.Router();

router
  .route('/')
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
  })
  .get((req, res) => {
    res.end('GET not supported on /order without an ID.');
  })
  .post((req, res) => {
    res.end(
      'POST on /order will be used to place an order, whose ID will be returned.'
    );
  })
  .put((req, res) => {
    res.end('PUT not supported on /order.');
  })
  .delete((req, res) => {
    res.end('DELETE not supported on /order without an ID.');
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
