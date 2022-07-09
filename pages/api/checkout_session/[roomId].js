/** @format */

import nextConnect from 'next-connect';
import dbConnect from '../../../config/dbConnect';
import { stripeCheckoutSession } from '../../../controllers/paymentController';
import { isAuthentcatedUser } from '../../../middleware/auth';
import onError from '../../../middleware/errors';

dbConnect();

const handler = nextConnect({ onError });

handler.use(isAuthentcatedUser).get(stripeCheckoutSession);

export default handler;
