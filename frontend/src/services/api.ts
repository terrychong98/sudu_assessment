import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.API_BASE || "http://localhost:4000/api",
  headers: { "Content-Type": "application/json" },
});

export default api;
