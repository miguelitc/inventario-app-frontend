// src/App.jsx
import React from 'react';
import InventarioPage from './pages/InventarioPage';
import Login from './components/Login'; 
import { isAuthenticated } from './services/authService'; // Ya no importamos 'logout' aquí

function App() {

  // 1. EL CADENERO: Si no hay gafete, bloqueamos la entrada y mostramos el Login
  if (!isAuthenticated()) {
    return <Login />;
  }

  // 2. EL SISTEMA: Si hay gafete, lo dejamos pasar directamente a tu página
  // ¡Fíjate cómo ya no necesitamos el <div> extra!
  return <InventarioPage />;
}

export default App;