const express = require("express");
const path = require("path");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({ storage: multer.memoryStorage() });

let notes = [];

// Home
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Upload
app.post("/upload", upload.single("note"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload_stream(
      { resource_type: "auto", folder: "jee-notes" },
      (error, result) => {
        if (error) throw error;

        notes.push({
          subject: req.body.subject,
          url: result.secure_url
        });
        res.redirect("/");
      }
    );

    result.end(req.file.buffer);
  } catch (err) {
    res.send("Upload failed");
  }
});

// Show notes
app.get("/notes", (req, res) => {
  res.json(notes);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
