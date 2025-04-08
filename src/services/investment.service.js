import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

export const getInvestment = async (
  token,
  search = "",
  page = 1,
  limit = 5
) => {
  const res = await axios.get(
    `${API_BASE}/investment?search=${search}&page=${page}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const createInvestment = async (data, token) => {
  const res = await axios.post(`${API_BASE}/investment/create`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateInvestment = async (id, data, token) => {
  const res = await axios.put(`${API_BASE}/investment/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteInvestment = async (id, token) => {
  const res = await axios.delete(`${API_BASE}/investment/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
