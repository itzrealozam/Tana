// server.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------------
// ✅ Ensure required folders exist
// ------------------------
const dirs = [
  "gallery/approved",
  "gallery/Requests/meme",
  "gallery/Requests/museum",
  "pages",
  "assets",
  "navbar"
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ------------------------
// ✅ Serve static files
// ------------------------
app.use("/pages", express.static(path.join(__dirname, "pages")));
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/gallery", express.static(path.join(__dirname, "gallery")));
app.use("/navbar", express.static(path.join(__dirname, "navbar")));

// This lets the browser see index.html, navbar.js, and navbar.css at the root
app.use(express.static(__dirname)); 

// Route for the home page (root)
// ✅ CHANGE THIS: Remove "pages" from the path
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html")); 
});
// ------------------------
// ✅ API: Fetch approved Museum images
// ------------------------
app.get("/api/museum", (req, res) => {
  const directoryPath = path.join(__dirname, "gallery", "approved");

  // Read the folder where you store approved art
  fs.readdir(directoryPath, (err, files) => {
    if (err) return res.json([]); // If folder doesn't exist yet, send empty list

    const sizes = ["card-small", "card-medium", "card-large"];
    
    const images = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map((file, index) => ({
        id: index,
        url: `/gallery/approved/${file}`, // Path to the image
        likes: Math.floor(Math.random() * 500) + 20, // Fake random likes
        sizeClass: sizes[index % 3] // Cycles through small, medium, large
      }));

    res.json(images); // This IS your API!
  });
});

// ------------------------
// ✅ Multer Upload Setup
// ------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.body.mode === "meme"
      ? "gallery/Requests/meme"
      : "gallery/Requests/museum";
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const msg = (req.body.message || "no-message").replace(/\s+/g, "_").toLowerCase();
    const ext = path.extname(file.originalname);
    cb(null, `${msg}_${Date.now()}${ext}`);
  }
});

const upload = multer({ storage });

app.post("/upload", upload.array("media", 3), (req, res) => {
  res.json({ success: true });
});

// ------------------------
// ✅ Catch-all 404 for pages
// ------------------------
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "pages", "404.html"));
});

// ------------------------
// Start server
// ------------------------
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
let galleryData = [];

async function loadGallery() {
    const container = document.getElementById('galleryContainer');
    
    try {
        // This fetches from your OWN server route we just made above
        const response = await fetch('/api/museum'); 
        galleryData = await response.json();

        if (galleryData.length === 0) {
            container.innerHTML = "<p style='text-align:center; width:100%;'>No art found in gallery/approved folder.</p>";
            return;
        }

        container.innerHTML = galleryData.map((img, index) => `
            <div class="art-card ${img.sizeClass}" onclick="openTikTok(${index})">
                <img src="${img.url}" alt="Artwork">
                <div class="card-likes">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    ${img.likes}
                </div>
            </div>
        `).join('');
    } catch (e) {
        console.error("Connection to server failed:", e);
    }
}
// --- ADMIN API ROUTES ---

// 1. Get All Approved Images with Delete Option
app.get("/api/admin/gallery", (req, res) => {
    const dir = path.join(__dirname, "gallery", "approved");
    fs.readdir(dir, (err, files) => {
        if (err) return res.status(500).json([]);
        const images = files.filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f));
        res.json(images);
    });
});

// 2. Simple Ban/Unban System (Stores in memory for now)
let bannedIPs = new Set();
app.post("/api/admin/ban", express.json(), (req, res) => {
    bannedIPs.add(req.body.ip);
    res.json({ success: true, list: Array.from(bannedIPs) });
});

app.post("/api/admin/unban", express.json(), (req, res) => {
    bannedIPs.delete(req.body.ip);
    res.json({ success: true, list: Array.from(bannedIPs) });
});