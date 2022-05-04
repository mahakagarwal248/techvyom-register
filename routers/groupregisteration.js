const router = require("express").Router();
const Jio = require("joi");
const Eventgroup = require("../models/Eventgroup");
const CheckVerification = require("../controllers/checkVerification");
const Events = require("../models/Events");
const Student = require("../models/Student");
const sendcustomMail = require("../controllers/sendmail");
const Praticipation = require("../models/Participatin");
router.post("/create", CheckVerification, async (req, res) => {
  const verificationBody = Jio.object({
    name: Jio.string().required(),
    email: Jio.string().required(),
    eventname: Jio.string().required(),
    rollnumber: Jio.string().required(),
    Pid: Jio.number().required(),
    verified: Jio.boolean().required(),
  });
  const { error } = verificationBody.validate(req.body);
  if (error) {
    console.log(error);
    return res.send({
      status: false,
      msg: "please send email ",
    });
  }
  try {
    const { name, rollnumber, eventname, Pid, email } = req.body;
    const Check_student = await Student.findOne({ rollnumber });
    if (!Check_student) {
      return res.send({
        status: false,
        msg: "register first",
      });
    }
    const event_entered = await Events.findOne({ Eventname: eventname });
    if (!event_entered) {
      return res.send({
        status: false,
        msg: "invalid event",
      });
    }
    const numberofregingroup = await Eventgroup.find({ Pid });
    const numberofreginsingle = await Praticipation.find({ Pid });
    if (numberofregingroup.length + numberofreginsingle.length > 5) {
      return res.send({
        status: false,
        msg: "cannt register more then 5 event",
      });
    }
    const allreadyexits = await Eventgroup.exists({
      $and: [{ Pid }, { eventname }],
    });
    if (allreadyexits) {
      return res.send({
        status: false,
        msg: "u allready registered",
      });
    }
    const tid = `22${event_entered.EventCode}${
      event_entered.Numberparticipation + 1
    }`;
    const newEvent = await Eventgroup.create({
      rollnumber,
      name,
      Pid,
      eventname,
      tid,
    });
    if (!newEvent) {
      return res.send({
        status: false,
        msg: "internal error",
      });
    }
    const update_NOparticipate = await Events.updateOne(
      { Eventname: eventname },
      {
        Numberparticipation: event_entered.Numberparticipation + 1,
      }
    );
    console.log(update_NOparticipate);
    if (!update_NOparticipate) {
      return res.send({
        status: false,
        msg: "internal error",
      });
    }
    const Send_EmailTO_Student = sendcustomMail(
      [email, event_entered.Eventmentoremail, "techvyomsrms@gmail.com"],
      "register in new event",
      `<p>Hi <h5>Sir /Madam</h5> <br/>  
Thank you for registering in <h5>${eventname}</h5> of Techvyom of <h5>${event_entered.EventClub}</h5> Following  :<br/>
Event name : <h5> ${eventname}</h5> <br/>  
Pid :<h5> ${Check_student.Pid} </h5><br/>  
Tid :<h5> ${Check_student.tid} </h5><br/>  

<h5> Event code : ${event_entered.EventCode} </><br/>  
<h5> Event Mentor : ${event_entered.Eventmentor}</h5> <br/>  
<h5> Mentor email:${event_entered.Eventmentoremail}</h5> <br/>  

See you in the event. Good luck !!  <br/>  
Thanks and regards <br/>  
Techvyom team <br/>  
 SRMS CET BAREILLY </p>`,
      `Hi Sir /Madam 
Thank you for registering in ${event_entered.eventname} of Techvyom of ${event_entered.EventClub} \nFollowing  :
Event name : ${eventname}\n
Pid :${Check_student.Pid}\n
Tid :${Check_student.tid}\n

Event code :${event_entered.EventCode}\n
Event Mentor :${event_entered.Eventmentor}\n
Mentor email:${event_entered.Eventmentoremail}\n

See you in the event. Good luck !! \n
Thanks and regards\n
Techvyom team\n
 SRMS CET BAREILLY\n `
    );
    if (Send_EmailTO_Student) {
      return res.send({
        status: true,
        msg: "registered",
        tid,
      });
    }
    return res.send({
      status: false,
      msg: "internal server error",
    });
  } catch (error) {
    console.log(error);
    return res.send({
      status: false,
      msg: "internal server error",
    });
  }
});

// --------------
router.post("/addme", CheckVerification, async (req, res) => {
  const verificationBody = Jio.object({
    name: Jio.string().required(),
    email: Jio.string().required(),
    eventname: Jio.string().required(),
    rollnumber: Jio.string().required(),
    tid: Jio.number().required(),
    Pid: Jio.number().required(),
    verified: Jio.boolean().required(),
  });
  const { error } = verificationBody.validate(req.body);
  if (error) {
    console.log(error);

    return res.send({
      status: false,
      msg: "invalid entry",
    });
  }
  try {
    const { email, name, eventname, rollnumber, tid, Pid } = req.body;
    const Check_student = await Student.findOne({ rollnumber });
    if (!Check_student) {
      return res.send({
        status: false,
        msg: "register first",
      });
    }
    const event_entered = await Events.findOne({ Eventname: eventname });
    if (!event_entered) {
      return res.send({
        status: false,
        msg: "invalid event",
      });
    }

    const numberofregingroup = await Eventgroup.find({ Pid });
    const numberofreginsingle = await Praticipation.find({ Pid });
    if (numberofregingroup.length + numberofreginsingle.length > 5) {
      return res.send({
        status: false,
        msg: "cannt register more then 5 event",
      });
    }
    const allreadyexits = await Eventgroup.exists({
      $and: [{ rollnumber }, { eventname }],
    });
    if (allreadyexits) {
      return res.send({
        status: false,
        msg: "u allready registered",
      });
    }
    const find_group = await Eventgroup.find({ tid });
    if (find_group === []) {
      return res.send({
        status: false,
        msg: "invalid tid or create new group",
      });
    }

    if (find_group.length > event_entered.Maxparticipation) {
      return res.send({
        status: false,
        msg: "group limit is full",
      });
    }

    const newEvent = await Eventgroup.create({
      name,
      rollnumber,
      eventname,
      Pid,
      tid,
    });
    if (!newEvent) {
      return res.send({
        status: false,
        msg: "internal error",
      });
    }
    const Send_EmailTO_Student = sendcustomMail(
      [email, event_entered.Eventmentoremail, "techvyomsrms@gmail.com"],
      "register in new event",
      `<p>Hi <h5>Sir /Madam</h5> <br/>  
Thank you for registering in <h5>${eventname}</h5> of Techvyom of <h5>${event_entered.EventClub}</h5> Following  :<br/>
Event name : <h5> ${eventname}</h5> <br/>  
Pid :<h5> ${Check_student.Pid} </h5><br/>  
Tid :<h5> ${Check_student.tid} </h5><br/>  

<h5> Event code : ${event_entered.EventCode} </><br/>  
<h5> Event Mentor : ${event_entered.Eventmentor}</h5> <br/>  
<h5> Mentor email:${event_entered.Eventmentoremail}</h5> <br/>  

See you in the event. Good luck !!  <br/>  
Thanks and regards <br/>  
Techvyom team <br/>  
 SRMS CET BAREILLY </p>`,
      `Hi Sir /Madam 
Thank you for registering in ${eventname} of Techvyom of ${event_entered.EventClub} \nFollowing  :
Event name : ${eventname}\n
Pid :${Check_student.Pid}\n
Tid :${Check_student.tid}\n

Event code :${event_entered.EventCode}\n
Event Mentor :${event_entered.Eventmentor}\n
Mentor email:${event_entered.Eventmentoremail}\n

See you in the event. Good luck !! \n
Thanks and regards\n
Techvyom team\n
 SRMS CET BAREILLY\n `
    );
    if (Send_EmailTO_Student) {
      return res.send({
        status: true,
        msg: "registered",
        tid,
      });
    }
    return res.send({
      status: false,
      msg: "internal server error",
    });
  } catch (error) {
    console.log("1" + error);
    return res.send({
      status: false,
      msg: "internal error",
    });
  }
});

module.exports = router;
// Hi Sir /Madam
// Thank you for registering in (event name ) of Techvyom of (club) Following are yeh details :
// Event name
// Pid
// Tid
// Event code
// Event Mentor
// Mentor email

// See you in the even . Good luck !!
// Thanks and regards
// Techvyom team
//  SRMS CET BAREILLY
