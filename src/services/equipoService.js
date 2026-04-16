// src/services/equipoService.js

// Ajusta esta URL al puerto donde corre tu Spring Boot
const API_URL = 'https://inventario-api-backend-fbkq.onrender.com/api/equipos'; 

export const obtenerEquipos = async () => {
    try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) {
            throw new Error('Error al conectar con el servidor');
        }
        return await respuesta.json(); // Esto nos devuelve el arreglo de equipos
    } catch (error) {
        console.error("Hubo un problema con la petición GET:", error);
        return []; // Devolvemos un arreglo vacío para que no truene la app
    }
};

export const crearEquipo = async (nuevoEquipo) => {
    try {
        const respuesta = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevoEquipo),
        });
        return await respuesta.json();
    } catch (error) {
        console.error("Hubo un problema con la petición POST:", error);
    }
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