const mongoose = require("mongoose");
const EventgroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rollnumber: {
    type: String,
    required: true,
  },
  eventname: {
    type: String,
    required: true,
  },
  tid: {
    type: String,
    required: true,
  },
  Pid: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const Eventgroup = mongoose.model("Eventgroup", EventgroupSchema);
module.exports = Eventgroup;
