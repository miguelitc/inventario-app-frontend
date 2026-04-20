// src/services/empleadoService.js
const API_URL = "https://inventario-api-backend-fbkq.onrender.com/api/v1/empleados?size=1000";

const getAuthHeaders = () => {
    const token = localStorage.getItem("jwt_token");
    return {
        "Content-Type": "application/json",
        // 2. ¡Aquí está la magia! Le pegamos la palabra "Bearer " seguida del token
        "Authorization": token ? `Bearer ${token}` : "" 
    };
};

export const obtenerEmpleados = async () => {
    try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) throw new Error("Error en la red");
        const datosDesempaquetados = await respuesta.json();
        return datosDesempaquetados.content;
    } catch {
      
        return [];
    }
};
// src/services/empleadoService.js
// ... tus otras funciones

export const crearEmpleado = async (datosEmpleado) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datosEmpleado),
  });
  
  if (!response.ok) {
    throw new Error("Error al guardar empleado en la base de datos");
  }
  
  // LA MAGIA ESTÁ AQUÍ 👇
  // Leemos la respuesta como texto primero para que no explote
  const textResponse = await response.text();
  
  // Si el texto está vacío (Spring Boot no devolvió nada), devolvemos un objeto vacío
  if (!textResponse) {
    return {};
  }
  
  // Si sí hay texto, intentamos convertirlo a JSON. Si falla, devolvemos el texto plano.
  try {
    return JSON.parse(textResponse);
  } catch {
    return textResponse; 
  }
};