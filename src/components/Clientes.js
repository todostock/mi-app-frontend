import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../api';

function Clientes() {
    const [clientes, setClientes] = useState([]);
    const [nombre, setNombre] = useState('');
    const [rut, setRut] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [correo, setCorreo] = useState('');
    const [error, setError] = useState('');

    const fetchClientes = async () => {
        try {
            const data = await fetchWithAuth('/api/clientes');
            setClientes(data);
        } catch (error) {
            console.error("Error al cargar clientes:", error);
        }
    };

    useEffect(() => {
        fetchClientes();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nombre || !rut || !direccion || !telefono) {
            setError('Nombre, RUT, Dirección y Teléfono son obligatorios');
            return;
        }
        const nuevoCliente = { nombre, rut, direccion, telefono, correo };
        try {
            await fetchWithAuth('/api/clientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoCliente),
            });
            setNombre('');
            setRut('');
            setDireccion('');
            setTelefono('');
            setCorreo('');
            setError('');
            fetchClientes();
        } catch (error) {
            setError('Ocurrió un error al agregar el cliente');
            console.error(error);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>Gestión de Clientes</h2>
            <form onSubmit={handleSubmit} style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
                <h3>Añadir Nuevo Cliente</h3>
                <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} style={{ marginRight: '10px', marginBottom: '10px' }} />
                <input type="text" placeholder="RUT" value={rut} onChange={(e) => setRut(e.target.value)} style={{ marginRight: '10px', marginBottom: '10px' }} />
                <input type="text" placeholder="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} style={{ marginRight: '10px', marginBottom: '10px' }} />
                <input type="text" placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} style={{ marginRight: '10px', marginBottom: '10px' }} />
                <input type="email" placeholder="Correo (Opcional)" value={correo} onChange={(e) => setCorreo(e.target.value)} style={{ marginRight: '10px', marginBottom: '10px' }} />
                <button type="submit">Agregar Cliente</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
            <h3>Lista de Clientes</h3>
            <table className="tabla-responsiva" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#f2f2f2' }}>
                        <th style={{ padding: '8px' }}>Nombre</th>
                        <th style={{ padding: '8px' }}>RUT</th>
                        <th style={{ padding: '8px' }}>Dirección</th>
                        <th style={{ padding: '8px' }}>Teléfono</th>
                        <th style={{ padding: '8px' }}>Correo</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map((cliente) => (
                        <tr key={cliente.id}>
                            <td data-label="Nombre">{cliente.nombre}</td>
                            <td data-label="RUT">{cliente.rut}</td>
                            <td data-label="Dirección">{cliente.direccion}</td>
                            <td data-label="Teléfono">{cliente.telefono}</td>
                            <td data-label="Correo">{cliente.correo}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Clientes;