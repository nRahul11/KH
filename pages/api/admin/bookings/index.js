/** @format */

import nextConnect from 'next-connect';
import dbConnect from '../../../../config/dbConnect';
import { allAdminBookings } from '../../../../controllers/bookingController';
import {
  authorizeRoles,
  isAuthentcatedUser,
} from '../../../../middleware/auth';
import onError from '../../../../middleware/errors';

dbConnect();

const handler = nextConnect({ onError });

handler.use(isAuthentcatedUser, authorizeRoles('Admin')).get(allAdminBookings);

export default handler;
