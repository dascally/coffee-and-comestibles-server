import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { CLIENT_ORIGIN, SECRET } from './config.js';

const cors = async (req, res, next) => {
  try {
    if (req.get('Origin')) {
      res.set({ 'Access-Control-Allow-Origin': CLIENT_ORIGIN });
    }

    return next();
  } catch (err) {
    return next(err);
  }
};

const corsPreflight = async (req, res, next) => {
  try {
    if (
      req.get('Access-Control-Request-Method') &&
      req.get('Access-Control-Request-Headers')
    ) {
      res.set({
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Header': 'Content-Type',
      });
    }
    return next();
  } catch (err) {
    return next(err);
  }
};

const userExtractor = async (req, res, next) => {
  try {
    const authorizationHeader = req.get('Authorization');
    const tokenMatch = authorizationHeader?.match(/(?<=^Bearer )\S+$/i);
    const token = tokenMatch?.[0];

    if (!token) {
      const err = new Error('Missing token.');
      err.name = 'AuthError';
      err.status = 401;
      throw err;
    }

    const tokenPayload = jwt.verify(token, SECRET);
    if (!tokenPayload?.id) {
      const err = new Error('Invalid token.');
      err.name = 'AuthError';
      err.status = 401;
      throw err;
    }

    req.user = await User.findById(tokenPayload.id);
    return next();
  } catch (err) {
    return next(err);
  }
};

const verifyAdmin = async (req, res, next) => {
  try {
    if (req.user?.admin) {
      return next();
    } else {
      const err = new Error('Only admins can perform that action.');
      err.name = 'AuthError';
      err.status = 403;
      throw err;
    }
  } catch (err) {
    return next(err);
  }
};

const verifySelfOrAdmin = async (req, res, next) => {
  try {
    if (
      req.user &&
      (req.params.userId === req.user._id.toString() || req.user.admin)
    ) {
      return next();
    } else {
      const err = new Error('You are not authorized to perform that action.');
      err.name = 'AuthError';
      err.status = 403;
      throw err;
    }
  } catch (err) {
    return next(err);
  }
};

export { cors, corsPreflight, userExtractor, verifyAdmin, verifySelfOrAdmin };
