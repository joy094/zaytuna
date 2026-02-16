//index.js

import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoute.js";
import productRoutes from "./routes/productRoute.js";
import { requireSignIn } from "./middleware/authMiddleware.js";
import cors from "cors";
dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

//middelwares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

//DB config
connectDB();

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
//get route

app.get("/", (req, res) => {
  res.send({
    message: "hello joson",
  });
});

app.listen(port, () => {
  console.log(`server is running at  ${port}`.bgCyan.white);
});
