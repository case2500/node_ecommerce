const express = require("express");
const router = express.Router();

//controller
const {
  listUsers,
  readUsers,
  updateUsers,
  removeUsers,
  changeStatus,
  changeRole,
  userCart,
  getUserCart,
  saveAddress,
  saveOrder,
  emptyCart,
  addToWishList,
  getWishList,
  removeWishList,
  getOrder,
  registerUser
} = require("../controllers/users");

// middleware
const { auth, adminCheck } = require("../middleware/auth");

//@Endpoint  http://localhost:5000/api/users
//@Method    GET
//@Access    Private
router.get("/",  listUsers);

//@Endpoint  http://localhost:5000/api/users/:id
//@Method    GET
//@Access    Private
router.get("/:id", readUsers);

//@Endpoint  http://localhost:5000/api/users/:id
//@Method    PUT
//@Access    Private
router.patch("/:id", updateUsers);

//@Endpoint  http://localhost:5000/api/users/:id
//@Method    DELETE
//@Access    Private
router.delete("/:id", removeUsers);

//@Endpoint  http://localhost:5000/api/change-status
//@Method    POST
//@Access    Private
router.post("/change-status",  changeStatus);


router.post("/", registerUser);
//@Endpoint  http://localhost:4000/api/change-role
//@Method    POST
//@Access    Private
router.post("/change-role",  changeRole);


//@Endpoint  http://localhost:5000/api/user/cart
//@Method    POST/GET
//@Access    Private
router.post("/user/cart", auth, userCart);
router.get("/user/cart", auth, getUserCart);
router.delete("/user/cart", auth, emptyCart);

router.post("/user/address", auth, saveAddress);
//order
router.post("/user/order", auth, saveOrder);
router.get("/user/orders", auth, getOrder);

// wishlist
router.post("/user/wishlist", auth, addToWishList);
router.get("/user/wishlist", auth, getWishList);
router.put("/user/wishlist/:productId", auth, removeWishList);







module.exports = router;
