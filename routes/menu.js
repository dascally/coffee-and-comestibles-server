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
  .all((req, res, next) => {
    try {
      return res
        .status(405)
        .set('Allow', 'GET, POST')
        .json({
          message: `${req.method} is not supported on the /menu path.`,
        });
    } catch (err) {
      return next(err);
    }
  });

router
  .route('/:menuItemId')
  .get(async (req, res, next) => {
    try {
      const menuItem = await MenuItem.findById(req.params.menuItemId);

      if (menuItem) {
        return res.status(200).json(menuItem);
      } else {
        return res.status(404).end();
      }
    } catch (err) {
      next(err);
    }
  })
  .put(async (req, res, next) => {
    try {
      const updatedMenuItem = await MenuItem.findByIdAndUpdate(
        req.params.menuItemId,
        req.body,
        { new: true, runValidators: true }
      );

      if (updatedMenuItem) {
        return res.status(200).json(updatedMenuItem);
      } else {
        return res.status(404).end();
      }
    } catch (err) {
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const result = await MenuItem.findByIdAndDelete(req.params.menuItemId);

      if (result) {
        return res.status(204).end();
      } else {
        return res.status(404).end();
      }
    } catch (err) {
      next(err);
    }
  })
  .all((req, res, next) => {
    try {
      return res
        .status(405)
        .set('Allow', 'GET, PUT, DELETE')
        .json({
          message: `${req.method} is not supported on the /menu/\${ID} path.`,
        });
    } catch (err) {
      return next(err);
    }
  });

export default router;
