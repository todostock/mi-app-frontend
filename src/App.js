import React, { useState } from 'react';
import Inventario from './components/Inventario';
import Clientes from './components/Clientes';
import RegistrarVenta from './components/RegistrarVenta';
import VerVentas from './components/VerVentas';
import AnalisisVentas from './components/AnalisisVentas';
import Login from './components/Login'; // Asegúrate de tener este import si no estaba
import './App.css';

function App() {
    const [session, setSession] = useState(localStorage.getItem('supabase_session'));
    const [vistaActual, setVistaActual] = useState('venta');

    useEffect(() => {
        const savedSession = localStorage.getItem('supabase_session');
        if (savedSession && savedSession !== 'undefined' && savedSession !== 'null') {
            try {
                const sessionData = JSON.parse(savedSession);
                if (sessionData && sessionData.access_token) {
                    setSession(sessionData);
                } else {
                    localStorage.removeItem('supabase_session');
                    setSession(null);
                }
            } catch (error) {
                localStorage.removeItem('supabase_session');
                setSession(null);
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
            {/* 1. Añadimos un className al header */}
            <header className="App-header">
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
            {/* 2. Y otro className al main */}
            <main className="main-content">
                {renderizarVista()}
            </main>
        </div>
    );
}



export default App;