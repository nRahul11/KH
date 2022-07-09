/** @format */

import nextConnect from 'next-connect';
import dbConnect from '../../../config/dbConnect';
import {
  deleteRoom,
  getSingleRoom,
  updateRoom,
} from '../../../controllers/roomController';
import { authorizeRoles, isAuthentcatedUser } from '../../../middleware/auth';
import onError from '../../../middleware/errors';

dbConnect();

const handler = nextConnect({ onError });

handler.get(getSingleRoom);
handler.use(isAuthentcatedUser, authorizeRoles('Admin')).put(updateRoom);
handler.use(isAuthentcatedUser, authorizeRoles('Admin')).delete(deleteRoom);

export default handler;
