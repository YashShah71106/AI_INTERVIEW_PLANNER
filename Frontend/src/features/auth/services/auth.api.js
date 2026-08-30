import axios from "axios";

const API_URL = "https://ai-interview-planner-xzw3.onrender.com/api/auth";

export async function register({ username, email, password }) {
    try {
        const response = await axios.post(
            `${API_URL}/register`,
            {
                username,
                email,
                password
            },
            {
                withCredentials: true
            }
        );

        return response.data;

    } catch (err) {
        console.log(err.response?.data || err.message);
        throw err;
    }
}

export async function login({ email, password }) {
    try {
        const response = await axios.post(
            `${API_URL}/login`,
            {
                email,
                password
            },
            {
                withCredentials: true
            }
        );

        return response.data;

    } catch (err) {
        console.log(err.response?.data || err.message);
        throw err;
    }
}

export async function logout() {
    try {
        const response = await axios.get(
            `${API_URL}/logout`,
            {
                withCredentials: true
            }
        );

        return response.data;

    } catch (err) {
        console.log(err.response?.data || err.message);
        throw err;
    }
}

export async function getMe() {
    try {
        const response = await axios.get(
            `${API_URL}/get-me`,
            {
                withCredentials: true
            }
        );

        return response.data;

    } catch (err) {
        console.log(err.response?.data || err.message);
        throw err;
    }
}