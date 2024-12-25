const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const patientRouter = require("./routes/patient"); // Check the export here
const doctorRouter = require("./routes/doctor"); // Check the export here
const appointmentRouter = require("./routes/appointment"); // Check the export here

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect("mongodb://localhost:27017/asterhospital", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

app.use(cors());
app.use(bodyParser.json());

// Ensure routes are used after middleware setup
app.use("/patients", patientRouter);
app.use("/doctors", doctorRouter);
app.use("/appointments", appointmentRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
