const mongoose = require("mongoose");

const meetingSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  name: String,
  uuid: String,
  start_time: Date,
  end_time: Date,
  events: Array,
});

module.exports = mongoose.model("meetings", meetingSchema);
