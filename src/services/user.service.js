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

export const updatePreferences = (prefs, token) =>
  axios.put(`${API_BASE}/user/preferences`, prefs, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const fetchLoginActivity = async (id, token) => {
  const res = await axios.get(`${API_BASE}/user/login-activity`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getTaxReportData = async (token) => {
  const res = await axios.get(`${API_BASE}/user/report/tax`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const verifyPasswordBeforeDelete = async (password, token) => {
  const res = await axios.post(
    `${API_BASE}/user/verify-password`,
    { password },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const deleteAccount = async (token) => {
  const res = await axios.delete(`${API_BASE}/user/account/delete`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};