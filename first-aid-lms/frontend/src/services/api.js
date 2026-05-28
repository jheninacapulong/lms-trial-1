import axios from "axios";

const API = axios.create({
  baseURL: "https://lms-trial-1.onrender.com/api",
});

export default API;