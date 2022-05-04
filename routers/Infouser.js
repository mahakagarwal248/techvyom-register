const router = require("express").Router();
const Jio = require("joi");
const Praticipation = require("../models/Participatin");
const Eventgroup = require("../models/Eventgroup");

// post(name,email,rollnumber,Phonenumber)
router.post("/single", async (req, res) => {
  const validatadta = Jio.object({
    Pid: Jio.string().required(),
  });

  const { error } = validatadta.validate(req.body);
  if (error) {
    console.error(error);
    return res.send({
      status: false,
      msg: "invalid credentials 1",
    });
  }
  try {
    const single_user = await Praticipation.find({ Pid: req.body.Pid });
    if (single_user !== []) {
      return res.send({
        status: "true",
        data: single_user,
      });
    }

    return res.send({
      status: "false",
      msg: "no data found",
    });
  } catch {
    return res.send({
      status: "false",
      msg: "internal server error",
    });
  }
});

// ------------------------------------------
router.post("/group", async (req, res) => {
  const validatadta = Jio.object({
    Pid: Jio.string().required(),
  });

  const { error } = validatadta.validate(req.body);
  if (error) {
    console.error(error);
    return res.send({
      status: false,
      msg: "invalid credentials 1",
    });
  }
  try {
    const single_user = await Eventgroup.find({ Pid: req.body.Pid });
    if (single_user !== []) {
      return res.send({
        status: "true",
        data: single_user,
      });
    }

    return res.send({
      status: "false",
      msg: "no data found",
    });
  } catch {
    return res.send({
      status: "false",
      msg: "internal server error",
    });
  }
});

module.exports = router;
