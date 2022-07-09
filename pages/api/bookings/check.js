/** @format */

import nextConnect from 'next-connect';
import dbConnect from '../../../config/dbConnect';
import { checkAvailablity } from '../../../controllers/bookingController';
import onError from '../../../middleware/errors';

dbConnect();

const handler = nextConnect({ onError });

handler.get(checkAvailablity);

export default handler;
