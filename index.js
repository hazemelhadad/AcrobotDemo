const express = require("express");
const mongoose = require("mongoose");
const User = require("./User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");



const app = express();
app.use(express.json()); // Middleware to parse JSON

mongoose.connect(
  "mongodb+srv://admin:admin@cluster0.gcc5dui.mongodb.net/authDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const newUser = new User({ email, password });
    await newUser.save();
    res.status(201).send("User registered");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }
    const token = jwt.sign({ id: user._id }, "secret_key", { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).send(error.message);
  }
});








app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});









