const express = require("express");
const router = express.Router();
const path = require("path");
const db = require("../db.js");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../html/register.html"));
});

router.get("/warning", (req, res) => {
  res.sendFile(path.join(__dirname, "../html/warning.html"));
});

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  const user = await db.User.findOne({
    username: username,
  }).exec();
  if (user === null) {
    db.User.create({ username: username, password: password });
    res.redirect("/login");
  } else {
    res.redirect("/register/warning");
  }
});

module.exports = router;