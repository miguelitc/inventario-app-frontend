// src/components/TarjetaEquipo.jsx
import React from 'react';

function TarjetaEquipo({ equipo, onEliminar, onEditar }) {
  return (
    // Transformamos el div principal en una tarjeta blanca con sombra
    <div className="bg-white rounded-xl shadow-md p-6 mb-4 flex justify-between items-center border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      
      {/* Información del lado izquierdo */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-1">
          {equipo.nombreEquipo}
        </h3>
        <p className="text-sm text-gray-500 font-medium">
          Tipo: <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{equipo.tipo}</span>
        </p>
        <p className="text-sm text-gray-500 font-medium">
          Serie: <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{equipo.numeroSerie}</span>
        </p>{equipo.empleado && (
            <p className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded-md mt-2 inline-block">
            👤 Asignado a: <strong>{equipo.empleado.nombre}</strong>
            </p>
            )}
      </div>

      {/* Botones del lado derecho */}
      <div className="flex gap-2">
        <button 
          onClick={() => onEditar(equipo)}
          className="bg-amber-400 hover:bg-amber-500 text-amber-900 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Editar ✏️
        </button>

        <button 
          onClick={() => onEliminar(equipo.id)} 
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Eliminar 🗑️
        </button>
      </div>
    </div>
  );
}

export default TarjetaEquipo;