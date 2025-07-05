import React, { useState } from 'react';

function Login({ setSession }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        const response = await fetch('http://127.0.0.1:5000/api/login', { // OJO: Cambiar a la URL de Render en producción
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            // Guardamos la sesión en el navegador
            localStorage.setItem('supabase_session', JSON.stringify(data));
            setSession(data);
        } else {
            setError('Email o contraseña incorrectos.');
        }
    };

    return (
        <div style={{ padding: '50px', maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
                <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
                <button type="submit" style={{ width: '100%', padding: '10px' }}>Entrar</button>
                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            </form>
        </div>
    );
}

export default Login;