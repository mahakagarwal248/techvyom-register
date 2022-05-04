const mongoose = require("mongoose");
const praticipationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rollnumber: {
    type: String,
    required: true,
  },
  Eventname: {
    type: String,
    required: true,
  },
  Pid: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const Praticipation = mongoose.model("Praticipation", praticipationSchema);
module.exports = Praticipation;
