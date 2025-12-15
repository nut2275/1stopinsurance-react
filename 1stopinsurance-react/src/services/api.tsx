import axios from "axios";

const api = axios.create({
  baseURL: "https://onestopinsurance-react.onrender.com", // URL backend Node.js
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;