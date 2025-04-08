import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

export const getExpenses = async (token, search = "", page = 1, limit = 5) => {
  const res = await axios.get(
    `${API_BASE}/expense?search=${search}&page=${page}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const createExpense = async (data, token) => {
  const res = await axios.post(`${API_BASE}/expense/create`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateExpense = async (id, data, token) => {
  const res = await axios.put(`${API_BASE}/expense/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteExpense = async (id, token) => {
  const res = await axios.delete(`${API_BASE}/expense/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
