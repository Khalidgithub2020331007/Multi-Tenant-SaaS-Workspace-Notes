import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3333",
  withCredentials: true, // 🔥 MUST
});

export default api;
