const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Debugging: Check if the file exists before serving
app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "public", "index.html");
  
  console.log("Trying to serve:", filePath);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send("Error: index.html not found!");
  }
});

app.listen(PORT, () => {
  console.log(`Frontend running at http://localhost:${PORT}`);
});
