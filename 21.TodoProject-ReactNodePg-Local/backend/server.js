import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/db.js";

import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";

// --------------------------
// APP INITIALIZATION
// --------------------------
const app = express();
app.use(cors());
app.use(express.json());

// --------------------------
// ROUTES
// --------------------------
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

// --------------------------
// DATABASE + SERVER START
// --------------------------
AppDataSource.initialize()
  .then(() => {
    console.log("✅ Database connected");

    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });

export default app;
