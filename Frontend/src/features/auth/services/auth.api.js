import axios from "axios";

const API_URL = "https://ai-interview-planner-xzw3.onrender.com/api/auth";

// ================= REGISTER =================

export async function register({ username, email, password }) {
    try {
        const response = await axios.post(
            `${API_URL}/register`,
            {
                username,
                email,
                password,
            },
            {
                withCredentials: true,
            }
        );

        return response.data;
    } catch (err) {
        console.error(
            "Register Error:",
            err.response?.data || err.message
        );

        throw err;
    }
}


// ================= LOGIN =================

export async function login({ email, password }) {
    try {
        const response = await axios.post(
            `${API_URL}/login`,
            {
                email,
                password,
            },
            {
                withCredentials: true,
            }
        );

        return response.data;
    } catch (err) {
        console.error(
            "Login Error:",
            err.response?.data || err.message
        );

        throw err;
    }
}


// ================= LOGOUT =================

export async function logout() {
    try {
        const response = await axios.get(
            `${API_URL}/logout`,
            {
                withCredentials: true,
            }
        );

        return response.data;
    } catch (err) {
        console.error(
            "Logout Error:",
            err.response?.data || err.message
        );

        throw err;
    }
}


// ================= GET CURRENT USER =================

export async function getMe() {
    try {
        const response = await axios.get(
            `${API_URL}/get-me`,
            {
                withCredentials: true,
            }
        );

        return response.data;
    } catch (err) {
        console.error(
            "Get Me Error:",
            err.response?.data || err.message
        );

        throw err;
    }
}