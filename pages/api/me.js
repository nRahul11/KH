/** @format */

import nextConnect from 'next-connect';
import dbConnect from '../../config/dbConnect';
import { currentUserProfile } from '../../controllers/authController';
import { isAuthentcatedUser } from '../../middleware/auth';
import onError from '../../middleware/errors';

dbConnect();

const handler = nextConnect({ onError });

handler.use(isAuthentcatedUser).get(currentUserProfile);

export default handler;
