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
        
        // --- LA CORRECCIÓN ESTÁ AQUÍ ---
        // Nos aseguramos de que haya algo guardado y de que no sea la palabra "undefined"
        if (savedSession && savedSession !== 'undefined' && savedSession !== 'null') {
            try {
                const sessionData = JSON.parse(savedSession);
                // Verificamos que los datos de la sesión son válidos antes de usarlos
                if (sessionData && sessionData.access_token) {
                    setSession(sessionData);
                } else {
                    localStorage.removeItem('supabase_session');
                }
            } catch (error) {
                console.error("Error al parsear la sesión guardada:", error);
                // Si hay un error, limpiamos el dato corrupto
                localStorage.removeItem('supabase_session');
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('supabase_session');
        setSession(null);
    };

    if (!session) {
        return <Login setSession={setSession} />;
    }

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