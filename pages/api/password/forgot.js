/** @format */

import nextConnect from 'next-connect';
import dbConnect from '../../../config/dbConnect';
import { forgotPassword } from '../../../controllers/authController';
import onError from '../../../middleware/errors';

dbConnect();

const handler = nextConnect({ onError });

handler.post(forgotPassword);

export default handler;
