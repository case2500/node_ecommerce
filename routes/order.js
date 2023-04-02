const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrders,
  getOrder,
  deleteOrder,
  updateOrder,
  updateOrderAdmin
} = require("../controllers/orderController.js");


router.post("/",createOrder);
router.post("/updateorder",updateOrderAdmin);
// router.patch("/:id", protect, updateOrder);
router.get("/",getOrders);
router.get("/:id", getOrder);
router.delete("/:id", deleteOrder);
router.put('/:id',updateOrder)

module.exports = router;
