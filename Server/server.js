import dotenv from "dotenv";
import express from "express";
import { Router } from "express";
import cors from 'cors';
import connectDB from "./config/db.js";
import authRoutes from "./Routes/authRoutes.js";
import clientRoutes from "./Routes/clientRoutes.js";
import freelancerRoutes from "./Routes/freelancerRoutes.js";
import generalRoutes from "./Routes/generalRoutes.js"
// import chatRoutes from './Routes/chatRoutes.js'
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


//congifure env
dotenv.config();

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

// database config
connectDB();

// routes
app.use("/api/v1/auth", authRoutes);

// Mount client routes
app.use("/api/v1/client", clientRoutes);

// Mount freelancer routes
app.use("/api/v1/freelancer", freelancerRoutes);

app.use("/api/v1/general",generalRoutes)

// app.use("/api/v1/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("Hello world");
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Listening at server running on ${port}`);
});
