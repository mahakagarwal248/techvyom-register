var nodemailer = require("nodemailer");
const router = require("express").Router();
const Student = require("../models/Student");
const EMAIL = process.env.EMAILID;
const PASS = process.env.EMAILPASS;
const Otpverify = require("../models/Otpverify");
const Jio = require("joi");

router.post("/genrate", async (req, res) => {
  const productdata = Jio.object({
    email: Jio.string().required(),
  });
  const { error } = productdata.validate(req.body);
  if (error) {
    console.log(error);
    console.log(req.body);
    return res.send({
      status: false,
      msg: "please send email",
    });
  }
  const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

  const { email } = req.body;
  const user_email = await Student.exists({ email });
  console.log(user_email);
  if (!user_email) {
    return res.json({
      status: false,
      msg: "invalid email",
    });
  }
  await Otpverify.deleteMany({ email });

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: PASS,
    },
  });
  var mailOptions = {
    from: "srms.techvyom@gmail.com",
    to: email,
    subject: "YOUR OTP FOR TECHVYOM",
    html: `<h6>Hi <h4>Sir/Ma'am</h4>
This is response to your Techvyom Registration.
This <h2>${otp}</h2> is your OTP . 
Hurry up !! Fill it fast !! OTP will expire within 1 hour </h6>. 

<h2>Thanks and Regards<br/> 
Techvyom organization<br/>  
SRMS CET ,Bareilly</h2>`,
  };
  const save_otp = Otpverify.create({
    email,
    otp,
    createdate: Date.now(),
    expiredate: Date.now() + 3600000,
  });
  if (!save_otp) {
    return res.json({ msg: "internal error", status: false });
  }
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return res.json({ msg: error.message, status: false });
    }
  });
  return res.json({ msg: "otp send", status: true });
});

// -----------verify-----------------
router.post("/verifyotp", async (req, res) => {
  const productdata = Jio.object({
    otp: Jio.number().required(),
    email: Jio.string().required(),
  });
  const { error } = productdata.validate(req.body);
  if (error) {
    return res.send({
      status: false,
      msg: "enter otp ",
    });
  }
  const { email, otp } = req.body;
  const getotp = await Otpverify.findOne({ email });

  if (Date.now() >= getotp.expiredate) {
    return res.json({
      status: false,
      msg: "time is expreied",
    });
  }
  console.log(getotp);
  if (otp == getotp.otp) {
    await Otpverify.deleteMany({ email });
    await Student.updateOne({ email }, { verified: true });
    return res.json({
      status: true,
      msg: "otp is verified",
    });
  } else {
    return res.json({
      status: false,
      msg: "invalied otp",
    });
  }
});
module.exports = router;
