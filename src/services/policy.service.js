import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

export const getPolicy = async (token, search = "", page = 1, limit = 5) => {
  const res = await axios.get(
    `${API_BASE}/lic-policy?search=${search}&page=${page}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const createPolicy = async (data, token) => {
  const res = await axios.post(`${API_BASE}/lic-policy/create`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updatePolicy = async (id, data, token) => {
  const res = await axios.put(`${API_BASE}/lic-policy/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deletePolicy = async (id, token) => {
  const res = await axios.delete(`${API_BASE}/lic-policy/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
