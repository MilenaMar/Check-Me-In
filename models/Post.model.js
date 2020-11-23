const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const slugify = require('slugify');

const postSchema = new Schema({
  country:{
    type:String,
    required: true,
  },
  city:String,
  budget:Number,
  currency:{
  type:String,
  enum: ["USD", "EUR"]
},
  days:Number,
  when: {
    type: Date,
  },
  createdAt:{
    type:Date,
    default:new Date(),
  },
  title:String,
  description:String,
  body: String,
  image: String,
  likes:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  likeCount:{
    type:Number,
    default:0
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  slug: {
    type: String,
    required: true,
    unique: true
  }
});


postSchema.pre('validate', function(next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }
  next()
})
module.exports = model('Post', postSchema);
