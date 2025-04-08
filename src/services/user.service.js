import axios from "axios";

// const API_BASE = "http://localhost:5000/v1/user";
const API_BASE = "https://wealthwise-backend-6nis.onrender.com/v1/user";

export const getUserProfile = async (id, token) => {
    const res = await axios.get(`${API_BASE}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

export const updateUserProfile = async (id, data, token) => {
    const formData = new FormData();
    for (const key in data) {
        formData.append(key, data[key]);
    }

    const res = await axios.put(`${API_BASE}/${id}`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });

    return res.data;
};
