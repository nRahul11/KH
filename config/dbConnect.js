/** @format */

import mongoose from 'mongoose';

const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  const res = await mongoose.connect(process.env.DB_URI);
  if (res) {
    console.log('Connected to Mongo Cloud DB');
  } else {
    console.log('Could not connect to db');
  }
};

export default dbConnect;
