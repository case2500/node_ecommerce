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
    .sort({ dateOrdered: -1 }).select({ images:0});

    const shoporder = await allorder.map( (singleorder, index) => {
      return {
          _id: singleorder._id,
          autobill:singleorder.autobill,
          name: singleorder.autobill,
          status: singleorder.status,
          totalPrice: singleorder.totalPrice,
          user:singleorder.user.name,
          createdAt:singleorder.createdAt,
          orderItems:(singleorder.orderItems).map(p=>{
          return  {  
            product:p.product.name,
            quantity:p.quantity,
            price:p.product.price,
           
          }

          })
          // photo: config.DOMAIN + '/images/' + shop.photo,
          // photo: config.DOMAIN_GOOGLE_STORAGE + '/' + shop.photo,
          // location: shop.location
      }
  });
//  Order.aggregate([
//     {
//       $match: { status: "Cancelled" }
//     }
//   ])
 
  console.log(shoporder)
  // res.status(200).json({
  //     data: shoporder
  // });

//   const paid = [
//     { amount: 155, month: 11, year: 2020, date: "11-11-2020" },
//     { amount: 160, month: 11, year: 2020, date: "11-11-2020" },
//     { amount: 120, month: 11, year: 2021, date: "05-11-2021" },
//     { amount: 130, month: 11, year: 2021, date: "05-11-2021" },
//     { amount: 135, month: 12, year: 2020, date: "11-12-2020" },
//     { amount: 145, month: 12, year: 2020, date: "11-12-2020" }
//   ];
  
//   const grouped = paid.reduce((acc,val)=>{
//     if(acc[val.month+'/'+val.year]){
//         acc[val.month+'/'+val.year].push(val.amount)
//     } else {
//         acc[val.month+'/'+val.year] = [val.amount]
//     }
//     return acc
// }, {})
// console.log(JSON.stringify(grouped,null,2))

  // const groupBy = (data, keys) => {
  //   return Object.values(
  //     paid.reduce((acc, val) => {
  //       const name = keys.reduce((finalName,key)=> finalName + val[key]+'/','').slice(0, -1)
  //       console.log(name)
  //       if (acc[name]) {
  //         acc[name].values.push(val.amount);
  //         acc[name].sum += val.amount;
  //       } else {
  //         acc[name] = {
  //           name,
  //           sum:val.amount,
  //           values:[val.amount]
  //         };;
  //       }
  //       return acc;
  //     }, {})
  //   );
  // };

  // console.log(JSON.stringify(groupBy(paid, ['month','year']), null, 2));

// const test =allorder.map(p=>(
//   console.log(p.autobill)
// ))
// res.status(200).json(allorder);
 res.status(200).json(shoporder);
};

// Update Order
const updateOrder = async (req, res) => {
  const id = req.params.id;
  const filter = { _id: id };
  const update = { status: "Cancelled" };
  const order = Order.find({ _id: id });
  if (order) {
    let updatedorder = await Order.findOneAndUpdate(filter, update, {
      new: true,
    });
    res.status(200).json(updatedorder);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
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
