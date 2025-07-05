import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../api';

function Inventario() {
    const [productos, setProductos] = useState([]);
    const [codigo, setCodigo] = useState('');
    const [nombre, setNombre] = useState('');
    const [stock, setStock] = useState('');
    const [error, setError] = useState('');

    const fetchProductos = async () => {
        try {
            const data = await fetchWithAuth('/api/productos');
            setProductos(data);
        } catch (error) {
            console.error("Error al cargar productos:", error);
            setError("No se pudieron cargar los productos.");
        }
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!codigo || !nombre || !stock) {
            setError('Todos los campos son obligatorios');
            return;
        }
        const nuevoProducto = {
            codigo_producto: codigo,
            nombre_producto: nombre,
            stock: parseInt(stock, 10),
        };
        try {
            await fetchWithAuth('/api/productos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoProducto),
            });
            setCodigo('');
            setNombre('');
            setStock('');
            setError('');
            fetchProductos();
        } catch (error) {
            setError('Ocurrió un error al agregar el producto');
            console.error(error);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>Gestión de Inventario</h2>
            <form onSubmit={handleSubmit} style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
                <h3>Añadir Nuevo Producto</h3>
                <div style={{ marginBottom: '10px' }}>
                    <label>Código: </label>
                    <input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Nombre: </label>
                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Stock Inicial: </label>
                    <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
                </div>
                <button type="submit">Agregar Producto</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
            <h3>Lista de Productos</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#f2f2f2' }}>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Código</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Nombre</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Stock Actual</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map((producto) => (
                        <tr key={producto.id}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{producto.codigo_producto}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{producto.nombre_producto}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{producto.stock}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Inventario;