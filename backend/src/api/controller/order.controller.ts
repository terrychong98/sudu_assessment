import { NextFunction, Request, Response } from "express";
import useOrderService from "../service/order.service";

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await useOrderService().getOrders({
      status: req.query.status as string,
      offset: Number(req.query.offset),
      limit: Number(req.query.limit),
    });
    return res.status(response.status).json(response);
  } catch (err) {
    next(err);
  }
};

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { product, quantity, dueDate } = req.body;
    const response = await useOrderService().createOrder({
      product,
      quantity,
      dueDate,
    });
    return res.status(response.status).json(response);
  } catch (err) {
    next(err);
  }
};

export const updateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status } = req.body;

    const response = await useOrderService().updateOrderStatus({
      _id: req.params.id,
      status,
    });
    return res.status(response.status).json(response);
  } catch (err) {
    next(err);
  }
};
