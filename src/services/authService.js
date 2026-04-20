// src/services/authService.js
//const API_URL = "https://inventario-api-backend-fbkq.onrender.com/api/v1/auth";
const API_URL = "https:localhost:8080/api/v1/auth";

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
    
    // 💾 El secreto: Guardamos el gafete (Token) en la memoria del navegador
    if (data.token) {
        localStorage.setItem("jwt_token", data.token);
    }
    
    return data;
};

// Función extra para saber si alguien ya inició sesión o para cerrar sesión
export const logout = () => {
    localStorage.removeItem("jwt_token");
};

export const isAuthenticated = () => {
    return localStorage.getItem("jwt_token") !== null;
};