const mongoose = require("mongoose");
const AutoNumberSchema = new mongoose.Schema(
    {
      name:{
        type: String,
        default: "autonumber", 
      },
        autonumber: {
          type: Number,
          required: true,
          default: 1000,
        },
      },
      { timestamps: true }
    );
module.exports = AutoNumber = mongoose.model("AutoNumber", AutoNumberSchema);
