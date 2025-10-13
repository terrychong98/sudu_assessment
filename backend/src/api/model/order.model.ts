import { Document } from "mongodb";

export interface Order extends Document {
  //   orderNumber: string;
  dueDate: Date;
  priorityScore: number;
  items: OrderItem[];
  status: OrderStatus;
}

export interface OrderItem {
  product: string;
  productName: string;
  quantity: number;
}

export enum OrderStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export type CreateOrder = Omit<Order, "priorityScore" | "status">;
export type UpdateOrderStatus = Omit<
  Order,
  "items" | "dueDate" | "priorityScore" | "status"
>;
