import axios from "axios";

// const API_BASE = "http://localhost:5000/v1/dashboard/stats";
const API_BASE = "https://wealthwise-backend-6nis.onrender.com/v1/dashboard/stats";

export const getDashboardStats = async (token) => {
  const res = await axios.get(API_BASE, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
