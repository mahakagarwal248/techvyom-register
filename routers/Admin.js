const router = require("express").Router();
const Event = require("../models/Events");
const sendcustomMail = require("../controllers/sendmail");
const Praticipation = require("../models/Participatin");
const Eventgroup = require("../models/Eventgroup");
router.get("/eventcode/:Ecode", async (req, res) => {
  let Data = "";
  const { Ecode } = req.params;
  const Find_Event = await Event.findOne({
    EventCode: Ecode,
  });
  if (!Find_Event) {
    return res.send({
      msg: "wrong Event code",
    });
  }
  if (Find_Event.Grouped) {
    Data = `Sno. name rollnumber Pid tid <br>`;
    const DBDATA_gup = await Eventgroup.find({
      Eventname: Find_Event.Eventname,
    });
    DBDATA_gup.map((value, index) => {
      Data =
        Data +
        `${index} ${value.name} ${value.rollnumber} ${value.Pid} ${value.tid} <br>`;
    });
  } else {
    Data = `<pre>Sno. name rollnumber Pid <br>`;
    const DBDATA_par = await Praticipation.find({
      Eventname: Find_Event.Eventname,
    });
    DBDATA_par.map((value, index) => {
      Data =
        Data + `${index} ${value.name} ${value.rollnumber} ${value.Pid} <br>`;
    });
  }
  const checkmail = sendcustomMail(
    "bhomickyadav786@gmail.com",
    "checking",
    Data,
    Data
  );

  if (checkmail) {
    return res.send({
      msg: "ok",
    });
  } else {
    return res.send({ msg: "internal server error" });
  }
});
module.exports = router;
