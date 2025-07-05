import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Inventario from './components/Inventario';
import Clientes from './components/Clientes';
import RegistrarVenta from './components/RegistrarVenta';
import VerVentas from './components/VerVentas';
import AnalisisVentas from './components/AnalisisVentas';
import './App.css';

function App() {
    const [session, setSession] = useState(null);
    const [vistaActual, setVistaActual] = useState('venta');

    // Al cargar la app, revisa si hay una sesión guardada
    useEffect(() => {
        const savedSession = localStorage.getItem('supabase_session');
        if (savedSession) {
            setSession(JSON.parse(savedSession));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('supabase_session');
        setSession(null);
    };

    // Si no hay sesión, muestra solo la pantalla de Login
    if (!session) {
        return <Login setSession={setSession} />;
    }

    // Si hay sesión, muestra la aplicación completa
    const renderizarVista = () => {
        switch (vistaActual) {
            case 'venta': return <RegistrarVenta />;
            case 'verVentas': return <VerVentas />;
            case 'analisis': return <AnalisisVentas />;
            case 'inventario': return <Inventario />;
            case 'clientes': return <Clientes />;
            default: return <RegistrarVenta />;
        }
    };

    return (
        <div className="App">
            <header style={{ backgroundColor: '#282c34', padding: '20px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>TodoStock SPA - Sistema de Gestión</h1>
                    <nav>
                        <button onClick={() => setVistaActual('venta')} style={{ marginRight: '15px' }}>Registrar Venta</button>
                        <button onClick={() => setVistaActual('verVentas')} style={{ marginRight: '15px' }}>Ver Ventas</button>
                        <button onClick={() => setVistaActual('analisis')} style={{ marginRight: '15px' }}>Análisis</button>
                        <button onClick={() => setVistaActual('inventario')} style={{ marginRight: '15px' }}>Inventario</button>
                        <button onClick={() => setVistaActual('clientes')}>Clientes</button>
                    </nav>
                </div>
                <button onClick={handleLogout}>Cerrar Sesión</button>
            </header>
            <main>
                {renderizarVista()}
            </main>
        </div>
    );
}

export default App;