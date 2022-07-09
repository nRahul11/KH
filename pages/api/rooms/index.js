/** @format */

import nextConnect from 'next-connect';
import dbConnect from '../../../config/dbConnect';
import { getAllRooms, newRoom } from '../../../controllers/roomController';
import { authorizeRoles, isAuthentcatedUser } from '../../../middleware/auth';
import onError from '../../../middleware/errors';

dbConnect();

const handler = nextConnect({ onError });

handler.get(getAllRooms);
handler.use(isAuthentcatedUser, authorizeRoles('Admin')).post(newRoom);

export default handler;
