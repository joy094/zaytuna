//index.js

import "dotenv/config"; // এটি একদম ১ নাম্বার লাইনে থাকতে হবে, যাতে সবার আগে .env লোড হয়
import express from "express";
import colors from "colors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoute.js";
import productRoutes from "./routes/productRoute.js";
import { requireSignIn } from "./middleware/authMiddleware.js";
import cors from "cors";
import bannerRoutes from "./routes/bannerRoute.js";
import admissionRoutes from "./routes/admissionRoutes.js";

// 🔴 Socket.io এর জন্য ইমপোর্ট
import http from "http";
import { Server } from "socket.io";

const app = express();
const port = process.env.PORT || 8080;

// 🔴 Socket.io এর জন্য HTTP সার্ভার তৈরি করা হলো
const server = http.createServer(app);

// 🔴 Socket.io কনফিগারেশন এবং এক্সপোর্ট (যাতে রাউট থেকে ব্যবহার করা যায়)
export const io = new Server(server, {
  cors: {
    origin: "*", // প্রোডাকশনে এখানে আপনার ফ্রন্টএন্ডের URL দিতে পারেন
    methods: ["GET", "POST", "PUT"],
  },
});

// 🔴 রিয়েল-টাইম কানেকশন লজিক
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // ইউজার বা অ্যাডমিন যখন লগইন করবে, তখন নির্দিষ্ট রুমে জয়েন করানো
  socket.on("join", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

//DB config
connectDB();

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/banner", bannerRoutes);
app.use("/api/v1/admission", admissionRoutes);

//get route
app.get("/", (req, res) => {
  res.send({
    message: "hello joson",
  });
});

// 🔴 app.listen এর বদলে server.listen ব্যবহার করতে হবে
server.listen(port, () => {
  console.log(`server is running at  ${port}`.bgCyan.white);
});
