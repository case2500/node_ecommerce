const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      text:true
    },
    description: {
      type: String,
    },
    brand: {
      type: String,
    },
    color: {
      type: String,
      default:"No color"
    },
    category: {
      type: ObjectId,
      ref: "category",
    },
    price: {
      type: Number,
    },
    sold:{
      type:Number,
      default:0
    },
    quantity: Number,
    images: {
      type: Array,
    },
  },
  { timestamps: true }
);
module.exports = Product = mongoose.model("Product", ProductSchema);
