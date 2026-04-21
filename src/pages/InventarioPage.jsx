// src/pages/InventarioPage.jsx
import React, { useState, useEffect } from 'react';
import { obtenerEquipos , crearEquipo , eliminarEquipo, actualizarEquipo } from '../services/equipoService'; 
import { obtenerEmpleados } from '../services/empleadoService';
import TarjetaEquipo from '../components/TarjetaEquipo'; 
import FormularioEquipo from '../components/FormularioEquipo';
import Swal from 'sweetalert2';
import { logout } from '../services/authService';

function InventarioPage() {
  // estados para los empleados
  const [empleados, setEmpleados] = useState([]);

  // estados para los equipos
  const [equipos, setEquipos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [equipoEnEdicion, setEquipoEnEdicion] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  //estados para un logout
  const [menuPerfilAbierto, setMenuPerfilAbierto] = useState(false);
  
  // para los modales
  const abrirModalNuevo = () => {
    setEquipoEnEdicion(null); 
    setModalAbierto(true);    
  };

  const cerrarModal = () => {
    setEquipoEnEdicion(null);
    setModalAbierto(false);   
  };

  const recargarListaEmpleados = async () => {
      const datosFrescos = await obtenerEmpleados();
      setEmpleados(datosFrescos.content ? datosFrescos.content : datosFrescos); 
  };

  useEffect(() => {
    const cargarTodo = async () => {
      const [datosEquipos, datosEmpleados] = await Promise.all([
        obtenerEquipos(),
        obtenerEmpleados()
      ]);
      
      setEquipos(datosEquipos.content ? datosEquipos.content : datosEquipos);
      setEmpleados(datosEmpleados.content ? datosEmpleados.content : datosEmpleados);
      
      setCargando(false);
    };
    cargarTodo();
  }, []);

  const manejarAgregarNuevoEquipo = async (nuevoEquipoInfo) => {
    const equipoGuardadoEnBD = await crearEquipo(nuevoEquipoInfo);
    
    if (equipoGuardadoEnBD) {
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

  const manejarEliminarEquipo = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto! El equipo se borrará del sistema.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', 
      cancelButtonColor: '#9ca3af', 
      confirmButtonText: 'Sí, eliminar 🗑️',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await eliminarEquipo(id); 
          setEquipos(equipos.filter((equipo) => equipo.id !== id));
          Swal.fire('¡Eliminado!', 'El equipo ha sido borrado exitosamente.', 'success');
        } catch {
          Swal.fire('Error', 'Hubo un problema al intentar eliminar el equipo.', 'error');
        }
      }
    });
  };

  const activarEdicion = (equipo) => {
    setEquipoEnEdicion(equipo);
    setModalAbierto(true); 
  };

  const manejarActualizarEquipo = async (id, datosActualizados) => {
    const equipoRenovado = await actualizarEquipo(id, datosActualizados);
    if (equipoRenovado) {
      setEquipos(equipos.map(eq => eq.id === id ? equipoRenovado : eq));
      setEquipoEnEdicion(null); 
      Swal.fire({
        icon: 'success',
        title: 'Equipo Actualizado correctamente',
        showConfirmButton: false,
        timer: 1500
      });
      cerrarModal();
    }
  };

  const equiposFiltrados = equipos.filter((equipo) => {
    return equipo.nombreEquipo.toLowerCase().includes(busqueda.toLowerCase()) || 
           equipo.tipo.toLowerCase().includes(busqueda.toLowerCase()) || 
           equipo.numeroSerie.toLowerCase().includes(busqueda.toLowerCase());
  });

  if (cargando) return (
    <div className="flex justify-center items-center h-screen">
      <h2 className="text-2xl font-semibold text-gray-600 animate-pulse">Conectando con el servidor... ⏳</h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
       {/* Nueva Barra de Navegación Superior */}
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          
          {/* Lado Izquierdo: Título */}
          <div className="text-center sm:text-left mb-4 sm:mb-0">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Inventario <span className="text-blue-600">📦</span>
            </h1>
            <p className="text-sm text-gray-500 font-medium">Gestión y asignaciones</p>
          </div>

          {/* Lado Derecho: Menú de Perfil */}
          <div className="relative">
            {/* El botón del Avatar */}
            <button 
              onClick={() => setMenuPerfilAbierto(!menuPerfilAbierto)}
              className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-xl transition-all border border-transparent hover:border-gray-200 focus:outline-none"
            >
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-gray-700">Mike Admin</p>
                <p className="text-xs text-green-500 font-medium">En línea</p>
              </div>
              
              {/* Circulito del Avatar con tus iniciales */}
              <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white font-bold shadow-md transform transition-transform hover:scale-105">
                MA
              </div>
              
              {/* Flechita hacia abajo */}
              <svg className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${menuPerfilAbierto ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* El Menú Desplegable (Caja Blanca) */}
            {menuPerfilAbierto && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-fade-in">
                
                {/* Opciones "falsas" para dar look profesional */}
                <div className="px-4 py-3 border-b border-gray-50">
                  <p className="text-sm text-gray-500">Sesión iniciada como</p>
                  <p className="text-sm font-bold text-gray-900 truncate">mike_admin</p>
                </div>

                <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 font-medium transition-colors flex items-center gap-2">
                  <span>⚙️</span> Configuración
                </button>
                <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 font-medium transition-colors flex items-center gap-2">
                  <span>📊</span> Reportes
                </button>
                
                <div className="border-t border-gray-100 my-1"></div>
                
                {/* Botón REAL de Cerrar Sesión */}
                <button 
                  onClick={() => { 
                    logout(); 
                    window.location.reload(); 
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-bold transition-colors flex items-center gap-2"
                >
                  <span>🚪</span> Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </header>

        {/* 👇 AQUÍ ESTÁ EL NUEVO DISEÑO ESTRATÉGICO 👇 */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            {/* Barra de Búsqueda */}
            <div className="relative w-full md:max-w-md group">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </span>
                <input
                    type="text"
                    placeholder="Buscar por nombre, serie o tipo..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-gray-700 shadow-sm"
                />
            </div>

            {/* Validamos si dibujamos el botón o un aviso */}
            {esAdmin ? (
                <button 
                    onClick={abrirModalNuevo}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Nuevo Equipo</span>
                </button>
            ) : (
                <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-medium text-sm flex items-center gap-2 border border-blue-100">
                    <span>🔒</span> Modo Solo Lectura
                </div>
            )}
        </div>
        {/* 👆 FIN DEL NUEVO DISEÑO 👆 */}

        {modalAbierto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm transition-opacity">
            <div 
              className="absolute inset-0 backdrop-blur-sm animate-fade-in"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }} 
              onClick={cerrarModal}
            ></div>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl relative z-10 animate-modal-up overflow-hidden">
              <button 
                onClick={cerrarModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
              >
                <span className="text-2xl">×</span>
              </button>
              <FormularioEquipo 
                key={equipoEnEdicion ? equipoEnEdicion.id : 'nuevo'}
                empleados={empleados} 
                onAgregar={manejarAgregarNuevoEquipo} 
                equipoParaEditar={equipoEnEdicion} 
                onActualizar={manejarActualizarEquipo}
                onRecargarEmpleados={recargarListaEmpleados}
                cancelarEdicion={cerrarModal} 
              />
            </div>
          </div>
        )}

        <div className="mt-8">
          {equiposFiltrados.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-500 text-lg">
                {equipos.length === 0 ? "No hay equipos registrados." : "No se encontraron equipos con esa búsqueda."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
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