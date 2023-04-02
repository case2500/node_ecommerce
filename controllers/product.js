const Product = require("../models/Product");

exports.create = async (req, res) => {
  console.log(req.body);
  try {
    console.log(req.body);
    // const { name } = req.body;
    const product = await new Product(req.body).save();
    res.send(product);
  } catch (err) {
    res.status(500).send("Create Product Error!!");
  }
};

// Get category product
exports.getProductCategory = async (req, res) => {
  const query = req.params.query;
  console.log("query=> " + query);
  const products = await Product.find({ category: query }).sort("-createdAt");
  console.log("products=> " + products);
  res.status(200).json(products);
};

exports.list = async (req, res) => {
  try {
    const product = await Product.find()
      .populate("category")
      .sort([["createdAt", "desc"]]);
      // console.log(product)
    res.json(product);
  } catch (err) {
    res.status(500).send("list Product Error!!");
  }
};

exports.remove = async (req, res) => {
  try {
  const deleted = await Product.findOneAndRemove({
    _id: req.params.id,
  }).exec();

  res.send(deleted);
  } catch (err) {
    res.status(500).send("Remove Product Error!!");
  }
};

exports.read = async (req, res) => {
  try {
    //code
    const product = await Product.findOne({ _id: req.params.id })
      .populate("category")
      .exec();
    res.status(200).json(product);
  } catch (err) {
    //err
    res.status(500).send("Read Product Error!!");
  }
};

exports.update = async (req, res) => {
  try {
    //code
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    ).exec();
    res.send(product);
  } catch (err) {
    //err
    res.status(500).send("Update Product Error!!");
  }
};

exports.listBy = async (req, res) => {
  try {
    const { sort, order, limit } = req.body;

    const product = await Product.find()
      .limit(limit)
      .populate("category")
      .sort([[sort, order]]);

    res.send(product);
  } catch (err) {
    res.status(500).send("ListBy Product Error!!");
  }
};



const handlePrice = async (req, res, price) => {
  let products = await Product.find({
    price: {
      $gte: price[0],
      $lte: price[1],
    },
  }).populate("category", "_id name");

  res.send(products);
};

const handleCategory = async (req, res, category) => {
  let products = await Product.find({ category }).populate(
    "category",
    "_id name"
  );
  console.log(products);
  res.send(products);
};

exports.searchFilters = async (req, res) => {
  const { query, price, brand } = req.body;

  if (brand) {
    console.log("brand---->", brand);

    let productbrand = await Product.find({ brand: brand }).populate(
      "category",
      "_id name"
    );
    console.log(productbrand);
    res.send(productbrand);
  }
};

// Get คันหาproduct ชื่อกับcategoryคล้ายกับ (req.params)
exports.getProductSearch = async (req, res) => {
  console.log(req.params.keyword);
  const con = req.params.keyword;
  const query = {
    $or: [
      // { category: { $regex: "(?i)" + `${con}` + "(?-i)" } },
      { name: { $regex: "(?i)" + `${con}` + "(?-i)" } },
    ],
  };

  const products = await Product.find(query).sort("-createdAt");
  console.log(products);

  res.status(200).json(products);
};

// exports.searchFilters = async (req, res) => {
//   const { query,price,category } = req.body;
// console.log(req.body)
//   if (query) {
//     console.log("query", query);
//     await handleQuery(req, res, query);
//   }
//   // price  [0,200]
//   if (price !== undefined) {
//     console.log("price---->", price);
//     await handlePrice(req, res, price);
//   }
//   //   [_id,_id]
//   if (category) {
//     console.log("category---->", category);
//     await handleCategory(req, res, category);
//   }

// };
