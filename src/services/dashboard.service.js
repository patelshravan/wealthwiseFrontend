import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

export const getDashboardStats = async (token, query = "") => {
  const res = await axios.get(`${API_BASE}/dashboard/stats${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
