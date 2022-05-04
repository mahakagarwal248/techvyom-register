const mongoose = require("mongoose");
const OtpverifySchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdate: Date,
  expiredate: Date,
});

const Otpverify = mongoose.model("Otpverify", OtpverifySchema);
module.exports = Otpverify;
