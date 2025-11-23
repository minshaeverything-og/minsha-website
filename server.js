const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Frontend serve karega (index.html isi folder me hai)
app.use(express.static(__dirname));

// Test route
app.get("/ping", (req, res) => {
  res.json({ message: "Backend is live! 🔥" });
});

// Contact / bulk enquiry API
app.post("/api/enquiry", (req, res) => {
  const { name, phone, message } = req.body;

  console.log("📩 New enquiry received:");
  console.log("Name   :", name);
  console.log("Phone  :", phone);
  console.log("Message:", message);
  console.log("-----------------------------");

  // --- NEW PART: save to enquiries.json file ---
  const newEntry = {
    name,
    phone,
    message,
    time: new Date().toISOString(),
  };

  const filePath = path.join(__dirname, "enquiries.json");

  fs.readFile(filePath, "utf8", (readErr, data) => {
    let list = [];
    if (!readErr && data) {
      try {
        list = JSON.parse(data);
      } catch (parseErr) {
        console.error("Error parsing enquiries.json:", parseErr);
      }
    }

    list.push(newEntry);

    fs.writeFile(filePath, JSON.stringify(list, null, 2), (writeErr) => {
      if (writeErr) {
        console.error("Error saving enquiry:", writeErr);
      } else {
        console.log("✅ Enquiry saved to enquiries.json");
      }
    });
  });
  // --- NEW PART END ---

  return res.json({
    success: true,
    message: "Your enquiry has been received. We'll contact you soon on WhatsApp!",
  });
});

// Server start
app.listen(PORT, () => {
  console.log(`🚀 Server started at http://localhost:${PORT}`);
});