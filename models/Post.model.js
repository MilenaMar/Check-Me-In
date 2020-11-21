const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const postSchema = new Schema({
  country:{
    type:String,
    required: true,
  },
  city:String,
  budget:Number,
  currency:{
  type:String,
  enum: ["USD", "EUR"]},
  days:Number,
  when: {
    type: Date,
    default: new Date(),
  },
  description:String,
  body: String,
  image: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  
});

module.exports = model('Post', postSchema);
