import { Document } from "mongodb";
import { SearchCriteria } from "./shared";

export interface OrderSearchCriteria extends SearchCriteria {
  status?: string;
}

export interface Order extends Document {
  //   orderNumber: string;
  dueDate: Date;
  priorityScore: number;
  status: OrderStatus;
  product: string;
  quantity: number;
}

export enum OrderStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export type CreateOrder = Omit<Order, "priorityScore" | "status">;
export type UpdateOrderStatus = Omit<
  Order,
  "items" | "dueDate" | "priorityScore" | "status"
>;
