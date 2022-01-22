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
    res.end('/menu got a GET request.');
  })
  .post((req, res) => {
    res.end(
      'POST not supported but maybe eventually allow an admin to update menu.'
    );
  })
  .put((req, res) => {
    res.end(
      'PUT not supported but maybe eventually allow an admin to update menu.'
    );
  })
  .delete((req, res) => {
    res.end('DELETE not supported for menu.');
  });

export default router;
