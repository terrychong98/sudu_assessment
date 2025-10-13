import dotdev from "dotenv";
import express, { json } from "express";
import useMongoUtils from "./utils/mongo";
import ordersRoutes from "./routes/order.routes";

const app = express();
dotdev.config();

useMongoUtils().connectMongo();

// 👇 This line is required to parse JSON body
app.use(express.json());

// If you also expect URL-encoded data (e.g. forms)
app.use(express.urlencoded({ extended: true }));

app.use("/api/orders", ordersRoutes);

export default app;
