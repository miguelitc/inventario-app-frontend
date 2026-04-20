// src/App.jsx
import React from 'react';
import InventarioPage from './pages/InventarioPage';
import Login from './components/Login'; // Verifica que esta ruta sea donde guardaste tu Login.jsx
import { isAuthenticated, logout } from './services/authService';

function App() {
  
  // 🕵️‍♂️ EL ESPÍA: Abre tu consola (F12) para ver qué responde esto
  console.log("¿Tenemos gafete?", isAuthenticated());

  // 1. EL CADENERO: Si no hay gafete, bloqueamos la entrada y mostramos el Login
  if (!isAuthenticated()) {
    return <Login />;
  }

  // 2. EL SISTEMA: Si hay gafete, lo dejamos pasar a tu página original
  return (
    <div>
      {/* Barra superior súper sencilla para poder cerrar sesión */}
      <div style={{ textAlign: 'right', padding: '10px', backgroundColor: '#242424' }}>
        <button 
            onClick={() => { 
                logout(); 
                window.location.reload(); 
            }}
            style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
            Cerrar Sesión
        </button>
      </div>

      {/* Tu página de inventario intacta */}
      <InventarioPage />
    </div>
  );
}

export default App;