const express = require("express");
const router = express.Router();

// controllers
const { 
    create,
    list,
    remove,
    read,
    update,
    listBy,
    searchFilters,
    getProductCategory,
    getProductSearch
} = require("../controllers/product");
// middleware
const { auth, adminCheck } = require("../middleware/auth");

//@Endpoint     http://localhost:5000/api/product
router.post("/",  create);
router.get("/", list);
router.delete("/:id",  remove);

// http://localhost:4000/api/product/productsearch/notebook
router.get("/productsearch/:keyword", getProductSearch);

//update
//http://localhost:5000/api/products
router.get("/:id", read);
router.put("/:id", update);

router.post("/productby", listBy);

// Search
//@Endpoint     http://localhost:4000/api/search/filters
router.post('/search/filters',searchFilters)

router.get("/cat/:query", getProductCategory);


module.exports = router;
