import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

export const getUserProfile = async (id, token) => {
  const res = await axios.get(`${API_BASE}/user/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateUserProfile = async (id, data, token) => {
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key]);
  }

  const res = await axios.put(`${API_BASE}/user/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
