const mongoose = require("mongoose");
const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  rollnumber: {
    type: String,
    unique: true,
    required: true,
  },
  verified: {
    type: Boolean,
    default: true,
  },
  Phonenumber: {
    type: String,
    required: true,
    unique: true,
  },
  Pid: {
    type: String,
    unique: true,
    required: true,
  },

  date: {
    type: Date,
    default: Date.now(),
  },
});

const Student = mongoose.model("Student", StudentSchema);
module.exports = Student;
