const express = require("express");
const router = express.Router();

// controllers
const { createImage, removeImage } = require("../controllers/cloudinary");

// middleware
const { auth, adminCheck } = require("../middleware/auth");

//@Endpoint     http://localhost:4000/api/images
router.post("/images",  createImage);
router.post("/removeimages", removeImage);

module.exports = router;
