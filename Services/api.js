import axios from "axios";

const api = axios.create({
    //baseURL: "http://localhost:5000",
    baseURL: "http://172.17.3.54:5000",
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
});

export default api;
