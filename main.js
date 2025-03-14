const express = require("express");
const mongoose = require("mongoose");
const Employee = require("./models/Employee");
const app = express();
const port = 3000;

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/company", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

// Middleware to parse JSON
app.use(express.json());

// Set view engine to EJS
app.set("view engine", "ejs");

// Helper function to get a random element from an array
const getRandom = (arr) => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};

// Home route
app.get("/", (req, res) => {
  res.render("index", { foo: "FOO" });
});

// Generate random data
app.post("/generate", async (req, res) => {
  try {
    // Clear the collection
    await Employee.deleteMany({});

    // Arrays for random data
    const randomNames = ["Eric", "Butter", "Cartman", "Kenny"];
    const randomLanguages = ["Ruby", "Java", "GO", "Python"];
    const randomCities = ["England", "Mexico", "Germany", "France"];

    // Generate 10 random employees
    for (let i = 0; i < 10; i++) {
      const employee = await Employee.create({
        name: getRandom(randomNames),
        language: getRandom(randomLanguages),
        city: getRandom(randomCities),
        salary: Math.floor(Math.random() * 80000),
        isManager: Math.random() > 0.5,
      });
      console.log("Created employee:", employee);
    }

    // Send success response
    res
      .status(201)
      .json({ message: "10 random employees created successfully!" });
  } catch (error) {
    console.error("Error generating data:", error);
    res.status(500).json({ error: "Failed to generate data" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
