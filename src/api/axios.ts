import axios from "axios";

// const BASE_URL = "http://192.168.1.3:8000/api/v2";
const BASE_URL = process.env.REACT_APP_API_URL;


export default axios.create({
    baseURL: BASE_URL
})

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
})