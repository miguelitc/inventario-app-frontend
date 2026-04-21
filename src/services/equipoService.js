// src/services/equipoService.js

// Ajusta esta URL al puerto donde corre tu Spring Boot
const API_URL = 'https://inventario-api-backend-fbkq.onrender.com/api/equipos'; 


const getAuthHeaders = () => {
    const token = localStorage.getItem("jwt_token");
    return {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : "" 
    };
}; 

// 2. Inyectar el token en el GET
export const obtenerEquipos = async () => {
    const response = await fetch(API_URL, {
        method: 'GET',
        headers: getAuthHeaders() // ¡Entregamos el gafete al cadenero!
    });

    if (!response.ok) {
        throw new Error("Error al obtener los equipos");
    }
    
    return await response.json();
};

// 3. (Asegúrate de hacer lo mismo en tu método para crear, editar o eliminar)
export const crearEquipo = async (equipo) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeaders(), 
        body: JSON.stringify(equipo)
    });
    return await response.json();
};

export const eliminarEquipo = async (id) => {
    try {
        // Fíjate cómo agregamos el ID al final de la URL (ej. /api/v1/equipos/5)
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        
        // Si Spring Boot responde con un estado 200 OK o 204 No Content, devuelve true
        return respuesta.ok; 
    } catch (error) {
        console.error("Hubo un problema con la petición DELETE:", error);
        return false;
    }
};

export const actualizarEquipo = async (id, equipoActualizado) => {
    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: 'PUT', // Usamos PUT para actualizar
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(equipoActualizado),
        });
        
        if (!respuesta.ok) throw new Error('Error al actualizar');
        return await respuesta.json(); // Devolvemos el equipo ya actualizado
    } catch (error) {
        console.error("Hubo un problema con la petición PUT:", error);
        return null;
    }
};