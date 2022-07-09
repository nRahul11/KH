/** @format */

import nextConnect from 'next-connect';
import dbConnect from '../../config/dbConnect';
import { webhookCheckout } from '../../controllers/paymentController';
import { isAuthentcatedUser } from '../../middleware/auth';
import onError from '../../middleware/errors';

dbConnect();

const handler = nextConnect({ onError });

export const config = {
  api: { bodyParser: false },
};

handler.post(webhookCheckout);

export default handler;
