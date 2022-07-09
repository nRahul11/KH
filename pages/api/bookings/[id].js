/** @format */

import nextConnect from 'next-connect';
import dbConnect from '../../../config/dbConnect';
import { getBookingDetails } from '../../../controllers/bookingController';
import { isAuthentcatedUser } from '../../../middleware/auth';
import onError from '../../../middleware/errors';

dbConnect();

const handler = nextConnect({ onError });

handler.use(isAuthentcatedUser).get(getBookingDetails);

export default handler;
