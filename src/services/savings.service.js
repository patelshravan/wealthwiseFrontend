import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

export const getSavings = async (token, search = "", page = 1, limit = 5) => {
  const res = await axios.get(
    `${API_BASE}/savings?search=${search}&page=${page}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const createSavings = async (data, token) => {
  const res = await axios.post(`${API_BASE}/savings/create`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateSavings = async (id, data, token) => {
  const res = await axios.put(`${API_BASE}/savings/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteSavings = async (id, token) => {
  const res = await axios.delete(`${API_BASE}/savings/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
