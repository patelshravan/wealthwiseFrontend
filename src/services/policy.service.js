import axios from "axios";

// const API_BASE = "http://localhost:5000/v1/lic-policy";
const API_BASE = "https://wealthwise-backend-6nis.onrender.com/v1/lic-policy";

export const getPolicy = async (token, search = "", page = 1, limit = 5) => {
  const res = await axios.get(
    `${API_BASE}?search=${search}&page=${page}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const createPolicy = async (data, token) => {
  const res = await axios.post(`${API_BASE}/create`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updatePolicy = async (id, data, token) => {
  const res = await axios.put(`${API_BASE}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deletePolicy = async (id, token) => {
  const res = await axios.delete(`${API_BASE}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
