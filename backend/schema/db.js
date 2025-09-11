const mongoose = require('mongoose');
const { minLength, lowercase } = require('zod');

mongoose.connect('mongodb://localhost:27017/payeasy')

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
      maxLength: 15,
      minLength: 3,
      lowercase: true,
      trim: true // Trim whitespace from the beginning and end of the string
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensures email addresses are unique
      lowercase: true // Converts email to lowercase before saving
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 8
    },
    firstName: {
      type: String,
      required: true,
      maxLength: 15,
      minLength: 3
    },
    lastName: {
      type: String,
      required: true,
      maxLength: 15,
      minLength: 3
    }
  });

  const accountSchema = new mongoose.Schema({
    userId: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: false
    }
  });

  const User = mongoose.model('User', userSchema);
  const Account = mongoose.model('Account', accountSchema);

  module.exports = {User, Account};