/** @format */

import NextAuth from 'next-auth';
import Provider from 'next-auth/providers';

import User from '../../../models/user';
import dbConnect from '../../../config/dbConnect';

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    Provider.Credentials({
      async authorize(credentials) {
        dbConnect();

        const { email, password } = credentials;

        if (!email || !password) {
          throw new Error('Please enter email and password');
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
          throw new Error('Please enter valid credentials');
        }

        const matchPassword = await user.comparePassword(password);
        if (!matchPassword) {
          throw new Error('Please enter valid credentials');
        }

        return Promise.resolve(user);
      },
    }),
  ],
  callbacks: {
    jwt: async (token, user) => {
      user && (token.user = user);
      return Promise.resolve(token);
    },
    session: async (session, user) => {
      session.user = user.user;
      return Promise.resolve(session);
    },
  },
});
