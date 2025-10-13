import { ObjectId } from "mongodb";
import useMongoUtils from "../../utils/mongo";
import {
  CreateOrder,
  Order,
  OrderItem,
  OrderStatus,
  UpdateOrderStatus,
} from "../model/order.model";
import { HttpStatusCode } from "../constant/HttpStatus";
import { ApiResponse } from "../model/api-response.model";

const useOrderService = () => {
  const getOrders = async () => {
    const mongoUtils = useMongoUtils();
    const orders = await mongoUtils.findMany<Order[]>({}, "orders");
    return ApiResponse.builder().status(HttpStatusCode.OK).data(orders).build();
  };

  const createOrder = async (order: CreateOrder) => {
    const mongoUtils = useMongoUtils();
    const errors = validateCreateOrder(order);
    if (errors.length > 0) {
      return ApiResponse.builder()
        .status(HttpStatusCode.VALIDATION_ERROR)
        .data(order)
        .message(errors)
        .build();
    }
    const newOrder = await mongoUtils.insert(
      {
        ...order,
        priorityScore: computePriority(order.items, order.dueDate),
        status: OrderStatus.OPEN,
      },
      "orders"
    );
    return ApiResponse.builder()
      .status(HttpStatusCode.OK)
      .data(newOrder)
      .build();
  };

  const updateOrderStatus = async (order: UpdateOrderStatus) => {
    if (!(await useOrderService().findOrder(order._id)))
      return ApiResponse.builder()
        .status(HttpStatusCode.VALIDATION_ERROR)
        .data(order)
        .message(["Order not found"])
        .build();

    const mongoUtils = useMongoUtils();

    if (!isValidOrderStatus(order.status)) {
      return ApiResponse.builder()
        .status(HttpStatusCode.VALIDATION_ERROR)
        .data(order)
        .message(["Invalid order status."])
        .build();
    }

    await mongoUtils.update(
      { _id: new ObjectId(order._id) },
      { status: order.status },
      "orders"
    );
    return ApiResponse.builder().status(HttpStatusCode.OK).data(order).build();
  };

  const findOrder = async (orderId: string) => {
    try {
      const mongoUtils = useMongoUtils();
      const order = await mongoUtils.find<Order>(
        { _id: new ObjectId(orderId) },
        "orders"
      );
      return order;
    } catch (err) {}
  };

  //below can split into different file

  const validateCreateOrder = (order: CreateOrder): string[] => {
    let message = [];

    if (order.dueDate) {
      const dueDate = new Date(order.dueDate);
      if (isNaN(dueDate.getTime())) {
        message.push("Due date must be a valid date");
      } else {
        if (order.dueDate < new Date()) {
          message.push("Due date must be in the future");
        }
      }
    } else {
      message.push("Due date is required");
    }

    if (order.items.length === 0) {
      message.push("Order must have at least one item");
    } else {
      if (order.items.some((item: OrderItem) => item.quantity <= 0)) {
        message.push("Item quantity must be greater than 0");
      }
    }
    return message;
  };

  const computePriority = (
    items: OrderItem[],
    dueDate: Date | string
  ): number => {
    const quantity = items.reduce((total, item) => total + item.quantity, 0);
    const dateObj = new Date(dueDate);
    // 1️⃣ Calculate days until due date
    const daysUntilDue = Math.max(
      1,
      Math.ceil((dateObj.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    );

    // 2️⃣ Normalize quantity (logarithmic scaling → 0–1 range)
    // Assume practical range: 1–10,000 units
    const normalizedQuantity = Math.min(1, Math.log10(quantity + 1) / 4);
    // log10(10,000) ≈ 4 → maps large quantity to near 1

    // 3️⃣ Normalize urgency (1 day = 1, 30 days = 0)
    const normalizedUrgency = Math.min(1, 1 - Math.min(daysUntilDue, 30) / 30);
    // Orders due in 1 day → 0.97, due in 30 days → 0.0

    // 4️⃣ Weighted combination
    const weightQuantity = 0.6;
    const weightUrgency = 0.4;
    const weightedScore =
      normalizedQuantity * weightQuantity + normalizedUrgency * weightUrgency;

    // 5️⃣ Scale to 0–100
    return Math.round(weightedScore * 100);
  };

  const isValidOrderStatus = (value: any): value is OrderStatus => {
    return Object.values(OrderStatus).includes(value);
  };

  return {
    getOrders,
    createOrder,
    updateOrderStatus,
    findOrder,
    computePriority,
  };
};

export default useOrderService;
