const asyncHandler = require("express");
const { Order } = require("../models/Order");
const express = require("express");
const { OrderItem } = require("../models/order-item.js");
const AutoNumber = require("../models/AutoNumber");

// Create Prouct
const createOrder = async (req, res) => {
  //update autonumber ==>AutoNumber
  try {
    const Find = await AutoNumber.find({}).exec();
    const auto = Find.map((p) => p.autonumber + 1); //เพิ่ม NO +1
    const filter = { name: "autonumber" };
    const update = { autonumber: Number(auto) };
    let updatedorder = await AutoNumber.findOneAndUpdate(filter, update, {
      new: true,
    });
    //เพิ่มรายการ จำนวน สั่งซื้อสินค้า save order  ==>order-item
    const { id, orderItems, quantity, totalprice, userid } = req.body.formData;
    const orderItemsIds = Promise.all(
      orderItems.map(async (orderItem) => {
        let newOrderItem = new OrderItem({
          quantity: orderItem.quantity,
          product: orderItem._id,
        });

        //  - จำนวน quantity + sold products
        let bulkOption = orderItems.map((productNewOrder) => {
          return {
            updateOne: {
              filter: { _id: productNewOrder._id },
              update: {
                $inc: {
                  quantity: -productNewOrder.quantity,
                  sold: +productNewOrder.quantity,
                },
              },
            },
          };
        });
        let updated = Product.bulkWrite(bulkOption, {});
        newOrderItem = await newOrderItem.save();
        return newOrderItem._id;
      })
    );
    const orderItemsIdsResolved = await orderItemsIds;

    //save order  ==>Order
    let order = new Order({
      orderItems: orderItemsIdsResolved,
      user: userid,
      totalPrice: totalprice,
      autobill: Number(auto),
    });
    order = await order.save();
    if (!order) return res.status(400).send("the order cannot be created!");
    res.send(req.body);
  } catch (error) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
};

// Get all Order
const getOrders = async (req, res) => {
  const allorder = await Order.find({})
    .populate("user")
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        //  populate: "category",
      },
    })


  
};

const updateOrderAdmin = async (req, res) => {
  try {
    // console.log(req.body)
    var { _id, newstatus } = req.body;
    const filter = { _id: _id };
    const update = { status: newstatus };
    const opts = { new: true };
    let results = await Order.findOneAndUpdate(filter, update, opts);
    // console.log(results);
    res.send(results);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
};

// Get single order
const getOrder = async (req, res) => {
  const orderuserid = req.params.id;
  const order = await Order.find({ user: orderuserid })
    .populate("user")
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        // populate: "category",
      },
    })
    .sort({ dateOrdered: -1 });
  if (!order) {
    res.status(404);
    throw new Error("order not found");
  }
  res.status(200).json(order);
};

// Delete bill order
const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.find({ autoNumber: id });
  console.log(order);
  // // if product doesnt exist
  var myquery = { autoNumber: id };
  if (order !== []) {
    await Order.deleteMany(myquery);
    res.status(200).json({ message: "order deleted." });
  } else {
    res.status(404);
    throw new Error("order not found");
  }
});

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  deleteOrder,
  updateOrder,
  updateOrderAdmin,
};
