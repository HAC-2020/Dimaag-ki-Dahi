const express = require("express");
const bp = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const Meeting = require("./models/meeting");

app.use(bp.json());

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true })
  .then(() => console.log("connected to database"))
  .catch((err) => console.log(err));

app.post("/", async (req, res) => {
  const body = req.body.payload.object;
  if (req.body.event === "meeting.started") {
    const meeting = new Meeting({
      _id: mongoose.Types.ObjectId(),
      name: body.topic,
      uuid: body.uuid,
      start_time: body.start_time,
      events: [],
    });
    await meeting.save();
    console.log(meeting);
  } else if (req.body.event === "meeting.ended") {
    const data = {
      name: body.topic,
      uuid: body.uuid,
      start_time: body.start_time,
      end_time: body.end_time,
    };
    console.log(data);
    const meeting = await Meeting.findOne({ uuid: body.uuid });
    meeting.end_time = body.end_time;
    await meeting.save();
  } else {
    const event = {
      user_name: body.participant.user_name,
      event_type: req.body.event,
      time:
        req.body.event === "meeting.participant_joined"
          ? body.participant.join_time
          : body.participant.leave_time,
    };
    const meeting = await Meeting.findOne({ uuid: body.uuid });
    meeting.events.push(event);
    await meeting.save();
  }
  res.end();
});

app.get("/meetings/all", async (req, res) => {
  try {
    const meetings = await Meeting.find();
    res.json({ success: true, meetings });
  } catch (err) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
});

app.get("/meetings/:id", async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    res.json({ success: true, meeting });
  } catch (err) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
});

app.get("/dashboard", async (req, res) => {
  const meetings = await Meeting.find({ end_time: { $ne: null } });
  res.render("dashboard", { meetings });
});

app.get("/meeting/:id", async (req, res) => {
  const meeting = await Meeting.findById(req.params.id);
  let students = {};
  let events = meeting.events;
  events.forEach((event) => {
    const name = event.user_name;
    if (students[name]) {
      students[name].push(new Date(event.time));
    } else {
      students[name] = new Array();
      students[name].push(new Date(event.time));
    }
  });
  console.log(students);
  let studentLog = new Array();
  Object.keys(students).forEach((student) => {
    let durations = new Array();
    let totalTimeSpent = 0;
    for (var i = 0; i < students[student].length; i += 2) {
      let start = students[student][i];
      let end = students[student][i + 1];
      let span = end.getTime() - start.getTime();
      durations.push({ start, end, span });
      totalTimeSpent += span;
    }
    let currentStudentLog = {
      name: student,
      durations,
      totalTimeSpent,
    };
    studentLog.push(currentStudentLog);
  });
  
  console.log(JSON.stringify(studentLog));
  res.render("lecture", { data: { title: meeting.name, studentLog } });
});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("server listening on port", port));

/*


{
    "events": [
        {
            "name": "",
            "type": "",
            "time": ""
        }
    ]
}

{
    "prafful": [
        "",
        "",
    ]
}

[
    {
        "name": "prafful",
        "durations": [
            {
                "start": "",
                "end": "",
                "span": ""
            }
        ],
        "totalTimeSpent": ""
    }
]

*/
