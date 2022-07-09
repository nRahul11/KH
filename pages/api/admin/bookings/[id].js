/** @format */

import nextConnect from 'next-connect';
import dbConnect from '../../../../config/dbConnect';
import { deleteBooking } from '../../../../controllers/bookingController';
import {
  authorizeRoles,
  isAuthentcatedUser,
} from '../../../../middleware/auth';
import onError from '../../../../middleware/errors';

dbConnect();

const handler = nextConnect({ onError });

handler.use(isAuthentcatedUser, authorizeRoles('Admin')).delete(deleteBooking);

export default handler;
