const Student = require("../models/Student");

const CheckVerification = async (req, res, next) => {
  //
  const { email } = req.body;
  const checkverification = await Student.findOne({ email });
  if (!checkverification) {
    res.send({ status: false, msg: "email doesnot exits" });
  } else if (!checkverification.verified) {
    res.send({ status: false, msg: "email doesnot verified" });
  }
  req.body.verified = true;
  next();
};
module.exports = CheckVerification;
