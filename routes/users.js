import express from 'express';
const router = express.Router();

router
  .route('/:userId')
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
  })
  .get((req, res) => {
    res.end(`GET all user data for user ${req.params.userId}`);
  })
  .post((req, res) => {
    res.end(`POST to update account info for user ${req.params.userId}`);
  })
  .put((req, res) => {
    res.end(`PUT to create user account ${req.params.userId}.`);
  })
  .delete((req, res) => {
    res.end(`DELETE user ${req.params.userId}.`);
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

router
  .route('/:userId/rewards')
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
  })
  .get((req, res) => {
    res.end(`GET rewards points count for user ${req.params.userId}`);
  })
  .post((req, res) => {
    res.end(`POST to update rewards points for user ${req.params.userId}`);
  })
  .put((req, res) => {
    res.end('PUT not supported for rewards.');
  })
  .delete((req, res) => {
    res.end('DELETE not supported for rewards.');
  });

export default router;
