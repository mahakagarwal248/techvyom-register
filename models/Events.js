const mongoose = require("mongoose");
const EventSchema = new mongoose.Schema({
  Eventname: {
    type: String,
    required: true,
  },
  Eventmentor: {
    type: String,
  },
  Eventmentoremail: {
    type: String,
  },
  EventClub: {
    type: String,
    required: true,
  },
  EventCode: {
    type: String,
    required: true,
  },
  Grouped: {
    type: Boolean,
    required: true,
    default: false,
  },
  Minparticipation: {
    type: Number,
    default: 1,
  },
  Maxparticipation: {
    type: Number,
    default: 1,
  },
  Numberparticipation: {
    type: Number,
    default: 0,
  },
});

const Event = mongoose.model("Event", EventSchema);
module.exports = Event;
