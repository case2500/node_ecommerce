const AutoNumber = require("../models/AutoNumber.js");

exports.list = async (req, res) => {
  try {
    const autoNumber = await AutoNumber.find({}).exec();
    res.send(autoNumber);
  } catch (err) {
    res.status(500).send("Server Error!!");
  }
};
exports.create = async (req, res) => {
  try {
    console.log(req.body)
    const { autonumber } = req.body;
    const autoNumber = await new AutoNumber({  autonumber }).save();
    res.send(autoNumber);
  } catch (err) {
    res.status(500).send("Server Error!!");
  }
};
exports.read = async (req, res) => {
  try {
    const id = req.params.id;
    const autoNumber = await AutoNumber.findOne({ _id: id });
    res.send(autoNumber);
  } catch (err) {
    res.status(500).send("Server Error!!");
  }
};
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const { name } = req.body;

    const autoNumber = await AutoNumber.findOneAndUpdate(
      { _id: id },
      { name: name }
    );
    res.send(autoNumber);
  } catch (err) {
    res.status(500).send("Server Error!!");
  }
};
exports.remove = async (req, res) => {
  try {
    const id = req.params.id;
    const autoNumber = await AutoNumber.findOneAndDelete({ _id: id });
    res.send(autoNumber);
  } catch (err) {
    res.status(500).send("Server Error!!");
  }
};
