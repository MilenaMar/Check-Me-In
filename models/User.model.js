const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true
  },
  Picture: {
    default:
      "http://www.answerspoint.com/user/uploads/users/default_user.png",
    type: String,
  },
  about: String,
  location: {
    required: true,
    type: String,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

//// Export User Model So it can be used outside of this File 
module.exports = model('User', userSchema);