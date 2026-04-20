import React, { useState } from 'react';
import { login } from '../services/authService';
// Si usas react-router-dom, importa useNavigate para redireccionar después del login
// import { useNavigate } from 'react-router-dom'; 

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    // const navigate = useNavigate(); 

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Intentamos conseguir el Token
            await login(username, password);
            
            alert("¡Bienvenido al sistema!");
            // navigate('/equipos'); // Redireccionar al inventario real
            // window.location.reload(); // Recargar para aplicar estados
            
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Iniciar Sesión</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Usuario:</label>
                    <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label>Contraseña:</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
                    Entrar
                </button>
            </form>
        </div>
    );
};

export default Login;