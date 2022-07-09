/** @format */

import nextConnect from 'next-connect';
import dbConnect from '../../../config/dbConnect';
import { checkBookedDates } from '../../../controllers/bookingController';
import onError from '../../../middleware/errors';

dbConnect();

const handler = nextConnect({ onError });

handler.get(checkBookedDates);

export default handler;
