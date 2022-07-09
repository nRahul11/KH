/** @format */

import cloudinary from 'cloudinary';
import crypto from 'crypto';
import User from '../models/user';
import catchAsyncErrors from '../middleware/catchAsyncErrors';
import ErrorHandler from '../utils/errorHandler';
import absoluteUrl from 'next-absolute-url';
import { sendEmail } from '../utils/sendEmail';

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// REGISTER USER
export const registerUser = catchAsyncErrors(async (req, res) => {
  const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: 'scapes/avatars',
    width: '150',
    crop: 'scale',
  });

  const { name, email, password } = req.body;

  await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: result.public_id,
      url: result.secure_url,
    },
  });

  res.status(200).json({
    success: true,
    message: 'Account registered successfully',
  });
});

// GET USER PROFILE
export const currentUserProfile = catchAsyncErrors(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    user,
  });
});

// UPDATE USER PROFILE
export const updateProfile = catchAsyncErrors(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name;
    user.email = req.body.email;

    if (req.body.password) {
      user.password = req.body.password;
    }
  }

  if (req.body.avatar !== '') {
    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: 'scapes/avatars',
      width: '150',
      crop: 'scale',
    });

    user.avatar = { public_id: result.public_id, url: result.secure_url };
  }

  await user.save();

  res.status(200).json({
    success: true,
  });
});

// FORGOT PASSWORD
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body });
  if (!user) {
    return next(new ErrorHandler('User with that email does not exist', 404));
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const { origin } = absoluteUrl(req);

  const resetUrl = `${origin}/password/reset/${resetToken}`;

  const message = `Please click on the link to reset your password\n\n ${resetUrl} \n\n. This link is valid for 30 mins.\n\n If you have not requested this please ignore.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password recovery',
      message,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }

  res.status(200).json({
    success: true,
    message: `Email sent to ${user.email}`,
  });
});

// RESET PASSWORD
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.query.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler('Invalid token please request a new one', 404)
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler('Password does not match', 404));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: `Password update successfully`,
  });
});

// GET ALL USERS - ADMIN
export const allAdminUsers = catchAsyncErrors(async (req, res) => {
  const user = await User.find();

  res.status(200).json({
    success: true,
    user,
  });
});

// GET USER  DETAILS - ADMIN
export const getUserDetails = catchAsyncErrors(async (req, res) => {
  const user = await User.findById(req.query.id);

  if (!user) {
    return next(new ErrorHandler('User not found with this id', 400));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// UPDATE USER  DETAILS - ADMIN
export const updateUserDetails = catchAsyncErrors(async (req, res) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.query.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// DELETE USER - ADMIN
export const deleteUser = catchAsyncErrors(async (req, res) => {
  const user = await User.findById(req.query.id);

  if (!user) {
    return next(new ErrorHandler('User not found with this id', 400));
  }

  const image_id = user.avatar.public_id;
  await cloudinary.v2.uploader.destroy(image_id);

  await user.remove();

  res.status(200).json({
    success: true,
    user,
  });
});
