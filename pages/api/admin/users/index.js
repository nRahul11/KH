/** @format */

import nextConnect from 'next-connect';
import dbConnect from '../../../../config/dbConnect';
import { allAdminUsers } from '../../../../controllers/authController';
import {
  authorizeRoles,
  isAuthentcatedUser,
} from '../../../../middleware/auth';
import onError from '../../../../middleware/errors';

dbConnect();

const handler = nextConnect({ onError });

handler.use(isAuthentcatedUser, authorizeRoles('Admin')).get(allAdminUsers);

export default handler;
