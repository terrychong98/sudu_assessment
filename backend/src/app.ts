import dotdev from "dotenv";
import express, { json } from "express";
import useMongoUtils from "./utils/mongo";
import ordersRoutes from "./routes/order.routes";
import cors from "cors";

const app = express();
dotdev.config();

useMongoUtils().connectMongo();

// 👇 This line is required to parse JSON body
app.use(express.json());

// If you also expect URL-encoded data (e.g. forms)
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173", // your Vite dev server
    credentials: true, // if you use cookies/auth headers
  })
);

app.use("/api/orders", ordersRoutes);

export default app;
