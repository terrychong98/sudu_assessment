import { defineStore } from "pinia";
import api from "../services/api.js";

export const useOrdersStore = defineStore("orders", {
  state: () => ({ orders: [] }),
  actions: {
    async fetchOrders({ offset = 1, limit = 10, status = "" } = {}) {
      const params: any = { offset, limit };
      if (status) params.status = status;
      const res = await api.get("/orders", { params });
      this.orders = res.data.data;
      return res.data;
    },
    async createOrder(payload: any) {
      const res = await api.post("/orders", payload);
      return res.data;
    },
    async toggleStatus(id: string, currentStatus: string) {
      const next =
        currentStatus === "PENDING"
          ? "IN_PROGRESS"
          : currentStatus === "IN_PROGRESS"
          ? "COMPLETED"
          : "COMPLETED";
      await api.patch(`/orders/${id}`, { status: next });
      // simple update in store
      this.orders.data = this.orders.data.forEach((o: any) => {
        if (o._id === id) {
          o.status = next;
        }
      });
    },
  },
});
