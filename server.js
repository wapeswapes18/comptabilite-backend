// ===== IMPORTS =====
import express from "express";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// ===== CONFIG =====
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ===== CLOUDINARY CONFIGURATION =====
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // ⚙️ à définir dans Render
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// ===== MULTER + CLOUDINARY STORAGE =====
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "uploads_comptabilite",   // 📁 dossier créé automatiquement sur Cloudinary
        resource_type: "auto",            // accepte images, PDF, etc.
    },
});

const upload = multer({ storage });

// ===== ROUTES =====

// ✅ Route d’accueil
app.get("/", (req, res) => {
    res.send("🚀 API Comptabilité A&P en ligne et connectée à Cloudinary !");
});

// ✅ Route de téléversement
app.post("/upload", upload.single("document"), (req, res) => {
    if (!req.file) return res.status(400).send("Aucun fichier reçu.");
    res.send(`✅ Fichier téléversé avec succès ! URL : ${req.file.path}`);
});

// ===== LANCEMENT DU SERVEUR =====
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur le port ${PORT}`);
});
