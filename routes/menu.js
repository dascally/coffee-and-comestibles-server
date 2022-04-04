import express from 'express';
import MenuItem from '../models/menuItem.js';
const router = express.Router();

router
  .route('/')
  .get(async (req, res, next) => {
    try {
      const menuItems = await MenuItem.find({});
      return res.status(200).json(menuItems);
    } catch (err) {
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      const {
        name,
        menuSection,
        description,
        image,
        allergens,
        price,
        options,
      } = req.body;

      const newMenuItem = new MenuItem({
        name,
        menuSection,
        description,
        image,
        allergens,
        price,
        options,
      });
      const savedMenuItem = await newMenuItem.save();

      return res
        .status(201)
        .set('Location', `/${savedMenuItem._id}`)
        .json(savedMenuItem);
    } catch (err) {
      next(err);
    }
  })
  .put((req, res, next) => {
    try {
      res.status(405).set('Allow', 'GET, POST').json({
        message: 'PUT is not supported on the /menu path. Try /menu/${ID}.',
      });
    } catch (err) {
      next(err);
    }
  })
  .delete((req, res, next) => {
    try {
      res.status(405).set('Allow', 'GET, POST').json({
        message: 'DELETE is not supported on the /menu path. Try /menu/${ID}.',
      });
    } catch (err) {
      next(err);
    }
  });

export default router;
