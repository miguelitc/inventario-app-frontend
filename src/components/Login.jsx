import React, { useState } from 'react';
import { login } from '../services/authService';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false); // Nuevo estado para el botón

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setCargando(true); // Encendemos el modo carga

        try {
            await login(username, password);
            window.location.reload(); 
        } catch (err) {
            setError('Credenciales incorrectas. Verifica tu usuario y contraseña.');
        } finally {
            setCargando(false); // Apagamos el modo carga pase lo que pase
        }
    };

    return (
        // Fondo con un degradado sutil
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 p-4">
            
            {/* Tarjeta principal con sombra difuminada */}
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 space-y-8 border border-gray-100">
                
                {/* Cabecera */}
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                        Bienvenido de vuelta <span className="text-blue-600">👋</span>
                    </h2>
                    <p className="text-sm text-gray-500">
                        Ingresa tus credenciales para administrar el inventario.
                    </p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleLogin} className="space-y-6">
                    
                    {/* Alerta de Error Elegante */}
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-fade-in">
                            <p className="text-sm text-red-700 font-medium">{error}</p>
                        </div>
                    )}

                    {/* Input: Usuario */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Usuario
                        </label>
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none bg-gray-50 focus:bg-white text-gray-800"
                            placeholder="ej. mike_admin"
                        />
                    </div>

                    {/* Input: Contraseña */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Contraseña
                        </label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none bg-gray-50 focus:bg-white text-gray-800"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Botón de Submit Animado */}
                    <button 
                        type="submit" 
                        disabled={cargando}
                        className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-md transition-all ${
                            cargando 
                            ? 'bg-blue-400 cursor-wait' 
                            : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1'
                        }`}
                    >
                        {cargando ? 'Autenticando...' : 'Iniciar Sesión 🚀'}
                    </button>
                </form>

            </div>
        </div>
    );
};

export default Login;