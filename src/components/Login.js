import React, { useState } from 'react';
import { fetchWithAuth } from '../api'; // Importamos nuestra función centralizada

function Login({ setSession }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Estado para mostrar que está cargando

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Inicia la carga
        setError('');

        try {
            // Ahora usamos fetchWithAuth para la petición de login
            // Notar que la ruta solo es '/api/login'
            const data = await fetchWithAuth('/api/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            // Guardamos la sesión en el navegador
            localStorage.setItem('supabase_session', JSON.stringify(data));
            setSession(data);

        } catch (error) {
            setError('Email o contraseña incorrectos.');
            console.error("Error de login:", error);
        } finally {
            setIsLoading(false); // Termina la carga
        }
    };

    return (
        <div style={{ padding: '50px', maxWidth: '400px', margin: '100px auto', textAlign: 'center', border: '1px solid #ddd', borderRadius: '8px' }}>
            <img src="/logo.png" alt="Logo" style={{maxWidth: '150px', marginBottom: '20px'}} />
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }} />
                <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px', marginBottom: '20px', boxSizing: 'border-box' }} />
                <button type="submit" style={{ width: '100%', padding: '10px' }} disabled={isLoading}>
                    {isLoading ? 'Entrando...' : 'Entrar'}
                </button>
                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            </form>
        </div>
    );
}

export default Login;