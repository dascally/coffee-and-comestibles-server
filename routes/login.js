import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { SECRET } from '../utils/config.js';
const router = express.Router();

router
  .route('/')
  .post(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      const passwordMatches =
        user === null
          ? false
          : await bcrypt.compare(password, user.passwordHash);

      if (!passwordMatches) {
        const err = new Error('Incorrect email or password.');
        err.name = 'AuthError';
        err.status = 401;
        throw err;
      }

      const tokenPayload = { id: user._id };

      const token = jwt.sign(tokenPayload, SECRET, { expiresIn: 60 * 60 * 24 });

      return res.status(200).json({
        token,
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    } catch (err) {
      return next(err);
    }
  })
  .all((req, res, next) => {
    try {
      return res
        .status(405)
        .set('Allow', 'POST')
        .json({
          message: `${req.method} is not supported on the /login path.`,
        });
    } catch (err) {
      return next(err);
    }
  });

export default router;
