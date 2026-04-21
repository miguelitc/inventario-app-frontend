// src/components/TarjetaEquipo.jsx
import React from 'react';

const TarjetaEquipo = ({ equipo, onEliminar, onEditar }) => {
    
    // Función para darle color al badge según el tipo
    const getTipoEstilo = (tipo) => {
        const estilos = {
            'Laptop': 'bg-blue-100 text-blue-700 border-blue-200',
            'Monitor': 'bg-purple-100 text-purple-700 border-purple-200',
            'Teclado': 'bg-green-100 text-green-700 border-green-200',
            'default': 'bg-gray-100 text-gray-700 border-gray-200'
        };
        return estilos[tipo] || estilos['default'];
    };

    return (
        <div className="group bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Lado Izquierdo: Info Principal */}
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        {/* Icono genérico de equipo */}
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {equipo.nombreEquipo}
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getTipoEstilo(equipo.tipo)}`}>
                                {equipo.tipo}
                            </span>
                            <span className="text-xs text-gray-400 font-medium">
                                SN: {equipo.numeroSerie}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Centro: Responsable (si existe) */}
                <div className="flex flex-col">
                    <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Asignado a</span>
                    <span className="text-sm font-medium text-gray-700">
                        {equipo.empleado ? equipo.empleado.nombre : 'Sin asignar'}
                    </span>
                </div>

                {/* Lado Derecho: Acciones */}
                <div className="flex items-center gap-2 border-t md:border-t-0 pt-4 md:pt-0">
                    <button 
                        onClick={() => onEditar(equipo)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 hover:bg-amber-50 text-gray-600 hover:text-amber-600 rounded-xl font-bold transition-colors"
                    >
                        <span>✏️</span> <span className="md:hidden lg:inline">Editar</span>
                    </button>
                    <button 
                        onClick={() => onEliminar(equipo.id)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-xl font-bold transition-colors"
                    >
                        <span>🗑️</span> <span className="md:hidden lg:inline">Borrar</span>
                    </button>
                </div>

            </div>
        </div>
    );
};

export default TarjetaEquipo;