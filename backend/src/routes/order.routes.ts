import { Router } from "express";
import {
  getOrders,
  createOrder,
  updateOrder,
} from "../api/controller/order.controller";

const router = Router();

router.get("/", getOrders);
router.post("/", createOrder);
router.patch("/:id", updateOrder);

export default router;
