/** @format */

import ErrorHandler from '../utils/errorHandler';
import catchAsyncErrors from './catchAsyncErrors';
import { getSession } from 'next-auth/client';

export const isAuthentcatedUser = catchAsyncErrors(async (req, res, next) => {
  const session = await getSession({ req });

  if (!session) {
    return next(new ErrorHandler('You are not logged in', 401));
  }

  req.user = session.user;
  next();
});

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role ${req.user.role} is not allowed to access this route`,
          403
        )
      );
    }
    next();
  };
};
