const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "", 
    },
    username: {
      type: String,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    address:{
      type: String,  
      default: "", 
    },
    phone:{
      type: String,  
      default: "", 
    },
    wishlist:[{
      type: ObjectId,
      ref: 'product'
    }]
  },
  { timestamps: true }
);
module.exports = User = mongoose.model("User", UserSchema);
