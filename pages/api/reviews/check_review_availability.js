/** @format */

import nextConnect from 'next-connect';
import dbConnect from '../../../config/dbConnect';
import { checkReviewAvailibility } from '../../../controllers/roomController';
import { isAuthentcatedUser } from '../../../middleware/auth';
import onError from '../../../middleware/errors';

dbConnect();

const handler = nextConnect({ onError });

handler.use(isAuthentcatedUser).get(checkReviewAvailibility);

export default handler;
