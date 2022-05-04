const router = require("express").Router();
const Jio = require("joi");
const Student = require("../models/Student");

const sendcustomMail = require("../controllers/sendmail");

// post(name,email,rollnumber,Phonenumber)
router.post("/", async (req, res) => {
  // body Error validation
  const productdata = Jio.object({
    rollnumber: Jio.string().required(),
  });
  const { error } = productdata.validate(req.body);
  if (error) {
    return res.send({
      status: false,
      msg: "invalid credentials 1",
    });
  }
  try {
    const { rollnumber } = req.body;
    // checking if user allready registered
    const student_exits = await Student.findOne({ rollnumber });

    if (!student_exits) {
      return res.status(401).send({
        status: false,
        msg: "invalid rollnumber",
      });
    }

    const send_mail = sendcustomMail(
      student_exits.email,
      "your information",
      `<p> your name:${student_exits.name}<br/> your email:${student_exits.email}<br/>your Pid:${student_exits.Pid}<br/>your rollnumber:${student_exits.rollnumber}<br/></p>`,
      `your name:${student_exits.name}\nyour email:${student_exits.email}\nyour Pid:${student_exits.Pid}\nyour rollnumber:${student_exits.rollnumber}\n`
    );
    if (send_mail) {
      return res.send({
        status: true,
        msg: "information send to your mail",
      });
    }
    return res.send({
      status: false,
      msg: "internal server error1",
    });
    // send data to client
  } catch (error) {
    console.log(error);
    return res.send({
      status: false,
      msg: "internal server error1",
    });
  }
});

module.exports = router;
