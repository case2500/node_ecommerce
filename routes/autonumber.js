const express = require("express");
const router = express.Router();

// controllers
const {
  list,
  create,
  read,
  update,
  remove,
} = require("../controllers/autonumber.js");

// middleware
const { auth, adminCheck } = require("../middleware/auth");
//@Endpoint     http://localhost:5000/api/category
router.get("/", list);
router.post("/", create);
router.get("/:id", read);
router.put("/:id", update);
router.delete("/:id", remove);

module.exports = router;
// router.get("/category", list);
// router.post("/category",auth, adminCheck, create);
// router.get("/category/:id",auth, adminCheck, read);
// router.put("/category/:id",auth, adminCheck, update);
// router.delete("/category/:id",auth, adminCheck, remove);