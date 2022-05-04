var nodemailer = require("nodemailer");
const EMAIL = process.env.EMAILID;
const PASS = process.env.EMAILPASS;
const sendcustomMail = (mail_to, mail_subject, mail_html, mail_text) => {
  try {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL,
        pass: PASS,
      },
    });
    var mailOptions = {
      from: "srms.techvyom@gmail.com",
      to: mail_to,
      subject: mail_subject,
      text: mail_text,
      html: mail_html,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("1" + error);
        return false;
      }
    });
    return true;
  } catch (error) {
    console.log("2" + error);
    return false;
  }
};
module.exports = sendcustomMail;
