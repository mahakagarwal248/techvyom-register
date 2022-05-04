const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const app = express();

dotenv.config({ path: "./config.env" });
const port = process.env.PORT;
require("./mongodb")();
app.use(express.json()); //this middleware used to get req.body
app.use(cors());
app.use(express.static("client/build"));
// if (process.env.NODE_ENV === "production") {
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

// check
app.use("/user", require("./routers/LoginNsighup"));
// check
app.use("/otp", require("./routers/otpverification"));
//check
app.use("/add", require("./routers/Registration"));
// check
app.use("/group", require("./routers/groupregisteration"));
// ADMIN
app.use("/info", require("./routers/Infouser"));
app.use("/forgot", require("./routers/Forgot"));
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});
app.listen(port, () => {
  console.log(`server in runing :${port}`);
});

// // -----------------------------------------------------
