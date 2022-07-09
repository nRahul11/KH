/** @format */

import nextConnect from 'next-connect';
import dbConnect from '../../../config/dbConnect';
import { updateProfile } from '../../../controllers/authController';
import onError from '../../../middleware/errors';
import { isAuthentcatedUser } from '../../../middleware/auth';

dbConnect();

const handler = nextConnect({ onError });

handler.use(isAuthentcatedUser).put(updateProfile);

export default handler;
