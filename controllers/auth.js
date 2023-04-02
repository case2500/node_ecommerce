const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
exports.register = async (req, res) => {
  console.log("resi");
  try {
  // Check user
  console.log(req.body);
  const { username, password } = req.body;
  var user = await User.findOne({ username });
  if (user) {
    return res.status(400).send("User Already exists");
  }
  const salt = await bcrypt.genSalt(10);
  user = new User({
    username,
    password,
  });
  // Encrypt
  user.password = await bcrypt.hash(password, salt);
  await user.save();

  res.send("Register Success");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
};

exports.login = async (req, res) => {
  console.log(req.body);
  try {
  const { username, password } = req.body;
  var user = await User.findOne({ username });
  if (user && user.enabled) {
    // Check Password
    console.log("user:" + user);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch) {
      return res.status(400).send("Password Invalid!!");
    }

    // Payload
    const payload = {
      user: {
        username: user.username,
        role: user.role,
      },
    };
    console.log("login success" + payload);
    // Generate Token
    jwt.sign(payload, "jwtSecret", { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      // res.json({ token, payload });
      res.json({
        _id: user.id,
        username: user.username,
        address: user.address,
        name: user.name,
        phone: user.phone,
        role: user.role,
        token: token,
      });
    });
  } else {
    return res.status(400).send("User Not found!!!");
  }
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
};

exports.currentUser = async (req, res) => {
  try {
    // model User
    // console.log("controller", req.user);
    const user = await User.findOne({ username: req.user.username })
      .select("-password")
      .exec();
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
};

exports.listUser = async (req, res) => {
  try {
    res.send("list Get User");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
};

exports.editUser = async (req, res) => {
  try {
    res.send("edit User");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
};
exports.deleteUser = async (req, res) => {
  try {
    res.send("remove User");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
};
