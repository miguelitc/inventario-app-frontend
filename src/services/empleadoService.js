// src/services/empleadoService.js
const API_URL = "https://inventario-api-backend-fbkq.onrender.com/api/v1/empleados";

// 1. Creamos una pequeña función de ayuda para sacar el token de la memoria
const getAuthHeaders = () => {
    const token = localStorage.getItem("jwt_token");
    return {
        "Content-Type": "application/json",
        // 2. ¡Aquí está la magia! Le pegamos la palabra "Bearer " seguida del token
        "Authorization": token ? `Bearer ${token}` : "" 
    };
};

// 3. Modificamos tus funciones para que usen esos headers
export const obtenerEmpleados = async () => {
    const response = await fetch(`${API_URL}?size=1000`, {
        method: 'GET',
        headers: getAuthHeaders() // Le entregamos el gafete al cadenero
    });

    if (!response.ok) {
        throw new Error("Error al obtener los empleados");
    }
    
    return await response.json();
};

// Haz lo mismo para tus peticiones POST, PUT o DELETE:
export const crearEmpleado = async (empleado) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeaders(), // ¡No olvides ponerlo en TODAS las peticiones!
        body: JSON.stringify(empleado)
    });
    return await response.json();
};