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
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, "secret_key", { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.get("/home",(req,res)=>{
  res.send("welcome ")
})


//form
app.post("/submit-form", (req, res) => {
  const responses = req.body;
  const totalQuestions = Object.keys(responses).length;
  let positiveResponses = 0;

  // Calculate the number of 'yes' answers
  for (const key in responses) {
    if (responses[key] === "yes") {
      positiveResponses++;
    }
  }

  // Calculate percentage of 'yes' answers
  const percentageYes = (positiveResponses / totalQuestions) * 100;

  // Determine if the percentage is 70% or more
  if (percentageYes >= 70) {
    res.status(200).send({ message: "He is injured", injuryStatus: true });
  } else {
    res.status(200).send({ message: "He isn't injured", injuryStatus: false });
  }
});



app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
})


