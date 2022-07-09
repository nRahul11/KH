/** @format */

import nextConnect from 'next-connect';
import dbConnect from '../../../../config/dbConnect';
import { resetPassword } from '../../../../controllers/authController';
import onError from '../../../../middleware/errors';

dbConnect();

const handler = nextConnect({ onError });

handler.put(resetPassword);

export default handler;
