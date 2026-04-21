// src/services/authService.js
const API_URL = "https://inventario-api-backend-fbkq.onrender.com/api/v1/auth";

export const login = async (username, password) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
        throw new Error("Usuario o contraseña incorrectos");
    }

    const data = await response.json();
    
    // Guardamos el token y el rol
    if (data.token) {
        localStorage.setItem("jwt_token", data.token);
        localStorage.setItem("user_role", username === "mike_admin" ? "ADMIN" : "GUEST");
    }
    
    return data;
};

export const logout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_role");
};

export const isAuthenticated = () => {
    return localStorage.getItem("jwt_token") !== null;
};

export const getRole = () => {
    return localStorage.getItem("user_role") || "GUEST";
};