/** @format */

import nextConnect from 'next-connect';
import dbConnect from '../../../config/dbConnect';
import {
  createRoomReview,
  getRoomReviews,
  deleteReview,
} from '../../../controllers/roomController';
import { isAuthentcatedUser, authorizeRoles } from '../../../middleware/auth';
import onError from '../../../middleware/errors';

dbConnect();

const handler = nextConnect({ onError });

handler.use(isAuthentcatedUser).put(createRoomReview);
handler.use(isAuthentcatedUser, authorizeRoles('Admin')).get(getRoomReviews);
handler.use(isAuthentcatedUser, authorizeRoles('Admin')).delete(deleteReview);

export default handler;
