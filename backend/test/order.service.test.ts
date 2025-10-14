import useOrderService from "../src/api/service/order.service";
import useMongoUtils from "../src/utils/mongo";
import { HttpStatusCode } from "../src/api/constant/HttpStatus";
import { OrderStatus } from "../src/api/model/order.model";

// ✅ Mock Mongo Utils
jest.mock("../src/utils/mongo");

describe("Order Service", () => {
  const mockFindMany = jest.fn();
  const mockFind = jest.fn();
  const mockInsert = jest.fn();
  const mockUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useMongoUtils as jest.Mock).mockReturnValue({
      findMany: mockFindMany,
      find: mockFind,
      insert: mockInsert,
      update: mockUpdate,
    });
  });

  // ----------------------------------------------------------------
  test("getOrders() should return all orders", async () => {
    const mockOrders = [{ _id: "1", name: "Test Order" }];
    mockFindMany.mockResolvedValue(mockOrders);

    const result = await useOrderService().getOrders();

    expect(mockFindMany).toHaveBeenCalledWith({}, "orders");
    expect(result.status).toBe(HttpStatusCode.OK);
    expect(result.data).toEqual(mockOrders);
  });

  // ----------------------------------------------------------------
  test("createOrder() should validate and reject invalid order", async () => {
    const badOrder = {
      dueDate: "invalid-date",
    };

    const result = await useOrderService().createOrder(badOrder as any);

    expect(result.status).toBe(HttpStatusCode.VALIDATION_ERROR);
    expect(result.message.length).toBeGreaterThan(0);
    expect(mockInsert).not.toHaveBeenCalled();
  });

  // ----------------------------------------------------------------
  test("createOrder() should insert valid order and compute priority", async () => {
    const goodOrder = {
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ahead
      quantity: 10,
      product: "Test Product",
    };

    mockInsert.mockResolvedValue({ _id: "abc123" });

    const result = await useOrderService().createOrder(goodOrder as any);

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        status: OrderStatus.OPEN,
        priorityScore: expect.any(Number),
      }),
      "orders"
    );
    expect(result.status).toBe(HttpStatusCode.OK);
    expect(result.data._id).toBe("abc123");
  });

  // ----------------------------------------------------------------
  test("updateOrderStatus() should return error if order not found", async () => {
    mockFind.mockResolvedValue(null); // order not found

    const result = await useOrderService().updateOrderStatus({
      _id: "123",
      status: OrderStatus.IN_PROGRESS,
    });

    expect(result.status).toBe(HttpStatusCode.VALIDATION_ERROR);
    expect(result.message).toEqual(["Order not found"]);
  });

  // ----------------------------------------------------------------
  test("updateOrderStatus() should update order successfully", async () => {
    mockFind.mockResolvedValue({ _id: "123" });
    mockUpdate.mockResolvedValue({});

    const result = await useOrderService().updateOrderStatus({
      _id: "68ed019343b21bc26cdb4641",
      status: OrderStatus.COMPLETED,
    });

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ _id: expect.any(Object) }),
      { status: OrderStatus.COMPLETED },
      "orders"
    );
    expect(result.status).toBe(HttpStatusCode.OK);
  });

  // ----------------------------------------------------------------
  test("computePriority() should calculate based on quantity and due date", () => {
    // access private helper through closure
    const service: any = useOrderService();

    const score = service.computePriority(
      100,
      new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    );

    expect(typeof score).toBe("number");
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});
