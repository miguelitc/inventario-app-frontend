// src/pages/InventarioPage.jsx
import React, { useState, useEffect } from 'react';
import { obtenerEquipos , crearEquipo , eliminarEquipo, actualizarEquipo } from '../services/equipoService'; 
import { obtenerEmpleados } from '../services/empleadoService';
// 1. IMPORTAMOS AL HIJO
import TarjetaEquipo from '../components/TarjetaEquipo'; 
import FormularioEquipo from '../components/FormularioEquipo';
import Swal from 'sweetalert2';

function InventarioPage() {
  //estados para los empleados
  const [empleados, setEmpleados] = useState([]);



  //estados para los esuqipos
  const [equipos, setEquipos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [equipoEnEdicion, setEquipoEnEdicion] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);

  //para los modales
  const abrirModalNuevo = () => {
    setEquipoEnEdicion(null); // Limpiamos si había algo editándose
    setModalAbierto(true);    // Encendemos el modal
  };

  const cerrarModal = () => {
    setEquipoEnEdicion(null);
    setModalAbierto(false);   // Apagamos el modal
  };
  const recargarListaEmpleados = async () => {
      const datosFrescos = await obtenerEmpleados();
      // Si Java lo manda envuelto en "content", lo sacamos. Si no, lo guardamos normal.
      setEmpleados(datosFrescos.content ? datosFrescos.content : datosFrescos); 
    };
  useEffect(() => {
    const cargarTodo = async () => {
      const [datosEquipos, datosEmpleados] = await Promise.all([
        obtenerEquipos(),
        obtenerEmpleados()
      ]);
      
      // Aplicamos la misma magia para los dos, por si las dudas
      setEquipos(datosEquipos.content ? datosEquipos.content : datosEquipos);
      setEmpleados(datosEmpleados.content ? datosEmpleados.content : datosEmpleados);
      
      setCargando(false);
    };
    cargarTodo();
  }, []);

  
  // 2. CREAMOS LA FUNCIÓN PARA GUARDAR (Esta es la que le pasaremos al Hijo)
  const manejarAgregarNuevoEquipo = async (nuevoEquipoInfo) => {
    // Llamamos al servicio para que haga el POST a Spring Boot
    const equipoGuardadoEnBD = await crearEquipo(nuevoEquipoInfo);
    
    if (equipoGuardadoEnBD) {
      // ¡MAGIA DE REACT! Actualizamos la lista agregando el nuevo al final.
      // Los tres puntos (...) significan: "Copia los equipos que ya tengo, y añade este nuevo".
      setEquipos([...equipos, equipoGuardadoEnBD]);
      Swal.fire({
        icon: 'success',
        title: 'Equipo Guardado correctamente',
        showConfirmButton: false,
        timer: 1500
      });
      cerrarModal();
    }
  };
  // 2. CREAMOS LA FUNCIÓN PARA ELIMINAR
  const manejarEliminarEquipo = (id) => {
    // 1. Lanzamos la alerta de confirmación
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto! El equipo se borrará del sistema.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', // Rojo Tailwind para confirmar
      cancelButtonColor: '#9ca3af', // Gris Tailwind para cancelar
      confirmButtonText: 'Sí, eliminar 🗑️',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      
      // 2. Si el usuario hace clic en "Sí, eliminar"
      if (result.isConfirmed) {
        try {
          // Vamos a Spring Boot a eliminarlo
          await eliminarEquipo(id); 
          
          // Actualizamos la pantalla de React
          setEquipos(equipos.filter((equipo) => equipo.id !== id));
          
          // 3. Mostramos una alerta de éxito
          Swal.fire(
            '¡Eliminado!',
            'El equipo ha sido borrado exitosamente.',
            'success'
          );
        } catch {
          // Por si algo falla en el backend
          Swal.fire(
            'Error',
            'Hubo un problema al intentar eliminar el equipo.',
            'error'
          );
        }
      }
    });
  };
  const activarEdicion = (equipo) => {
    setEquipoEnEdicion(equipo);
    setModalAbierto(true); 
  };

  // 4. LA FUNCIÓN PARA GUARDAR LOS CAMBIOS EN EL BACKEND
  const manejarActualizarEquipo = async (id, datosActualizados) => {
    const equipoRenovado = await actualizarEquipo(id, datosActualizados);
    if (equipoRenovado) {
      // .map() busca el equipo viejo en la lista y lo reemplaza por el renovado
      setEquipos(equipos.map(eq => eq.id === id ? equipoRenovado : eq));
      setEquipoEnEdicion(null); // Apagamos el modo edición
      Swal.fire({
        icon: 'success',
        title: 'Equipo Actualizado correctamente',
        showConfirmButton: false,
        timer: 1500
      });
      cerrarModal();
    }
  };

  // NUEVA LÓGICA DE FILTRADO (Pon esto justo arriba del 'if (cargando)')
    const equiposFiltrados = equipos.filter((equipo) => {
      // Convertimos todo a minúsculas para que no importe si buscas "HP" o "hp"
      return equipo.nombreEquipo.toLowerCase().includes(busqueda.toLowerCase()) || 
            equipo.tipo.toLowerCase().includes(busqueda.toLowerCase()) || equipo.numeroSerie.toLowerCase().includes(busqueda.toLowerCase());
    });
  if (cargando) return (
    <div className="flex justify-center items-center h-screen">
      <h2 className="text-2xl font-semibold text-gray-600 animate-pulse">Conectando con el servidor... ⏳</h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Inventario General <span className="text-blue-600">📦</span>
          </h1>
          <p className="mt-2 text-gray-500">Gestión de equipos y asignaciones</p>
        </header>

        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Buscar por nombre o tipo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-gray-700 text-lg shadow-sm"
          />
          <button 
            onClick={abrirModalNuevo}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-colors"
          >
            ➕ Nuevo Equipo
          </button>
        </div>
        {modalAbierto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm transition-opacity">
            {/* Contenedor blanco del formulario */}
          <div 
            className="absolute inset-0 backdrop-blur-sm animate-fade-in"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }} 
            onClick={cerrarModal}
          ></div>
              {/* 2. CONTENEDOR: Se desliza hacia arriba (Slide Up) */}
             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl relative z-10 animate-modal-up overflow-hidden">

              {/* Botón de cerrar (X) en la esquina superior */}
             <button 
                onClick={cerrarModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
              >
               <span className="text-2xl">×</span>
              </button>
          {/* Inyectamos tu Formulario aquí adentro */}
              <FormularioEquipo 
                key={equipoEnEdicion ? equipoEnEdicion.id : 'nuevo'}
                empleados={empleados} 
                onAgregar={manejarAgregarNuevoEquipo} 
                equipoParaEditar={equipoEnEdicion} 
                onActualizar={manejarActualizarEquipo}
                onRecargarEmpleados={recargarListaEmpleados}
                cancelarEdicion={cerrarModal} // Le pasamos la orden de cerrar
              />
        </div>
        </div>
        )}
        <div className="mt-8">
          {/* CAMBIO CRUCIAL: Ahora evaluamos y dibujamos equiposFiltrados */}
          {equiposFiltrados.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-500 text-lg">
                {equipos.length === 0 ? "No hay equipos registrados." : "No se encontraron equipos con esa búsqueda."}
              </p>
            </div>
          ) : (
           <div className="grid grid-cols-1 gap-4 mt-8">
              {equiposFiltrados.map((equipo) => (
                <TarjetaEquipo 
                  key={equipo.id} 
                  equipo={equipo} 
                  onEliminar={manejarEliminarEquipo}
                  onEditar={activarEdicion} 
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default InventarioPage;