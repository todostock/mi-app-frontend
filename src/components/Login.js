import React, { useState } from 'react';
import { fetchWithAuth } from '../api';
import logoSrc from '../assets/logo.jpg'; // <-- 1. Importamos el logo

function Login({ setSession }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const data = await fetchWithAuth('/api/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            if (data) {
                localStorage.setItem('supabase_session', JSON.stringify(data));
                setSession(data);
            } else {
                setError('Error de autenticación. Intente de nuevo.');
            }

        } catch (error) {
            setError('Email o contraseña incorrectos.');
            console.error("Error de login:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: '50px', maxWidth: '400px', margin: '100px auto', textAlign: 'center', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            {/* 2. Usamos el logo importado */}
            <img src={logoSrc} alt="Logo TodoStock SPA" style={{maxWidth: '150px', marginBottom: '20px'}} />
            
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }} />
                <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px', marginBottom: '20px', boxSizing: 'border-box' }} />
                <button type="submit" style={{ width: '100%', padding: '10px', cursor: 'pointer', fontSize: '1em' }} disabled={isLoading}>
                    {isLoading ? 'Entrando...' : 'Entrar'}
                </button>
                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            </form>
        </div>
    );
}

export default Login;