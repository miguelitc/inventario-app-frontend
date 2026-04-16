// src/components/FormularioEquipo.jsx
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { crearEmpleado } from '../services/empleadoService'; // Ajusta la ruta si es diferente

function FormularioEquipo({ onAgregar, equipoParaEditar, onActualizar, cancelarEdicion,empleados,onRecargarEmpleados }) {
  const [nombreEquipo, setNombreEquipo] = useState(equipoParaEditar ? equipoParaEditar.nombreEquipo : '');
  const [tipo, setTipo] = useState(equipoParaEditar ? equipoParaEditar.tipo : '');
  const [numeroSerie, setnumeroSerie] = useState(equipoParaEditar ? equipoParaEditar.numeroSerie : '');

  const [empleadoId, setEmpleadoId] = useState(equipoParaEditar?.empleado?.id || '');

  // 2. Creas una funcioncita para agregar rápido
const manejarAgregarEmpleadoRapido = () => {
    Swal.fire({
      title: '👤 Registro Rápido',
      html: `
        <input id="swal-nombre" class="swal2-input" placeholder="Nombre completo" autocomplete="off">
        <input id="swal-correo" class="swal2-input" placeholder="Correo electrónico (Opcional)" autocomplete="off">
        <input id="swal-depto" class="swal2-input" placeholder="Departamento (Opcional)" autocomplete="off">
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar Empleado',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2563eb', // Azul Tailwind
      // preConfirm extrae los datos de los inputs antes de cerrar
      preConfirm: () => {
        const nombre = document.getElementById('swal-nombre').value;
        const correo = document.getElementById('swal-correo').value;
        const departamento = document.getElementById('swal-depto').value;

        if (!nombre) {
          Swal.showValidationMessage('El nombre es obligatorio para registrarlo');
          return false; // Evita que se cierre el modal
        }
        
       return { 
          nombre: nombre, // 👈 Cambia la llave para que Java la entienda
          correo: correo || `temporal_${Date.now()}@empresa.com`,
          departamento: departamento || 'General' 
        };
      }
    }).then(async (result) => {
      // Si el usuario le dio a "Guardar" y pasó la validación
      if (result.isConfirmed) {
        try {
          // 1. Aquí mandamos el objeto a tu Spring Boot (ajusta esta línea según tu servicio)
           await crearEmpleado(result.value);
          
          // 2. Aquí deberías llamar a una función para volver a descargar la lista de empleados
           if (onRecargarEmpleados) {
            onRecargarEmpleados(); 
          }
          
        Swal.fire({
            toast: true,
            position: 'top',
            icon: 'success',
            title: '¡Empleado registrado en la base de datos!',
            showConfirmButton: false,
            timer: 2000
          });
        } catch {
          // Hacemos que SweetAlert nos muestre el error real
          Swal.fire(
            'Error en el Servidor', 
            `Java no aceptó los datos. Revisa la consola (F12) para más detalles.`, 
            'error'
          );
        }
      }
    });
  };
  const manejarEnvio = (e) => {
    e.preventDefault();
    
    const empleadoSeleccionado = empleados.find(emp => emp.id === parseInt(empleadoId));
    const datos = { nombreEquipo, tipo, numeroSerie,
      empleado: empleadoSeleccionado || null // Mandamos el objeto empleado
    };
    
    
    if (equipoParaEditar) onActualizar(equipoParaEditar.id, datos);
    else {
      onAgregar(datos);
      setNombreEquipo('');
      setTipo('');
      setnumeroSerie('');
      
    
    }
  };

  return (
    <form onSubmit={manejarEnvio} className="bg-white p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        {equipoParaEditar ? "Editar Equipo ✏️" : "Registrar Nuevo Equipo ➕"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Asignar a:</label>
          <select 
            value={empleadoId}
            onChange={(e) => setEmpleadoId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            >
            <option value="">Sin asignar (En Stock)</option>
            {empleados.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.nombre}</option>
            ))}
          </select>
          {/* 👇 EL NUEVO BOTÓN MÁGICO 👇 */}
        <div className="text-right mt-1">
          <button 
            type="button" 
            onClick={manejarAgregarEmpleadoRapido}
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            + Registrar nuevo empleado
          </button>
        </div>
        </div>
      

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Equipo</label>
          <input 
            type="text" 
            value={nombreEquipo} 
            onChange={(e) => setNombreEquipo(e.target.value)} 
            required 
            placeholder="Ej. Laptop Dell XPS"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <input 
            type="text" 
            value={tipo} 
            onChange={(e) => setTipo(e.target.value)} 
            required 
            placeholder="Ej. Asignado, Mantenimiento..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Serie</label>
          <input 
            type="text" 
            value={numeroSerie} 
            onChange={(e) => setnumeroSerie(e.target.value)} 
            required 
            placeholder="Ej. Asignado, Mantenimiento..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" className={`px-6 py-2 rounded-lg font-semibold text-white transition-colors duration-200 ${equipoParaEditar ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}>
          {equipoParaEditar ? "Guardar Cambios" : "Guardar Equipo"}
        </button>

        {equipoParaEditar && (
          <button type="button" onClick={cancelarEdicion} className="px-6 py-2 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors duration-200">
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default FormularioEquipo;