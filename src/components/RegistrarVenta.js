import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../api'; // Importamos la nueva función

const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

function RegistrarVenta() {
    const [clientes, setClientes] = useState([]);
    const [productos, setProductos] = useState([]);
    const [clienteSeleccionado, setClienteSeleccionado] = useState('');
    const [productosEnVenta, setProductosEnVenta] = useState([]);
    const [esAfectaIva, setEsAfectaIva] = useState(true);
    const [cantidadBultos, setCantidadBultos] = useState(1);
    const [fechaVenta, setFechaVenta] = useState(getTodayDateString());
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [clientesData, productosData] = await Promise.all([
                    fetchWithAuth('/api/clientes'),
                    fetchWithAuth('/api/productos')
                ]);
                setClientes(clientesData);
                setProductos(productosData);
            } catch (error) {
                console.error("Error al cargar datos iniciales:", error);
            }
        };
        fetchData();
    }, []);

    const agregarProductoAVenta = (producto) => {
        if (productosEnVenta.find(p => p.id === producto.id)) return;
        setProductosEnVenta([...productosEnVenta, { ...producto, cantidadVenta: 1, precio_unitario: '' }]);
    };
    
    const actualizarProductoEnVenta = (productoId, campo, valor) => {
        setProductosEnVenta(productosEnVenta.map(p => 
            p.id === productoId ? { ...p, [campo]: valor } : p
        ));
    };

    const eliminarProductoDeVenta = (productoId) => {
        setProductosEnVenta(productosEnVenta.filter(p => p.id !== productoId));
    };

    const handleRegistrarVenta = async () => {
        if (!clienteSeleccionado || productosEnVenta.length === 0) {
            alert("Debes seleccionar un cliente y al menos un producto.");
            return;
        }

        const ventaData = {
            cliente_id: parseInt(clienteSeleccionado),
            es_afecta_iva: esAfectaIva,
            cantidad_bultos: parseInt(cantidadBultos),
            fecha: fechaVenta,
            detalles: productosEnVenta.map(p => ({
                producto_id: p.id,
                cantidad: parseInt(p.cantidadVenta),
                precio_unitario: parseFloat(p.precio_unitario)
            }))
        };

        try {
            await fetchWithAuth('/api/ventas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ventaData),
            });
            alert('¡Venta registrada con éxito!');
            setClienteSeleccionado('');
            setProductosEnVenta([]);
            setCantidadBultos(1);
            setFechaVenta(getTodayDateString());
            const productosData = await fetchWithAuth('/api/productos');
            setProductos(productosData);
        } catch (error) {
            alert(`Error al registrar la venta: ${error.message}`);
        }
    };

    const productosFiltrados = productos.filter(p => 
        p.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.codigo_producto.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: '20px', display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1 }}>
                <h2>Registrar Nueva Venta</h2>
                <div style={{ marginBottom: '20px' }}>
                    <label>Fecha de la Venta: </label>
                    <input type="date" value={fechaVenta} onChange={e => setFechaVenta(e.target.value)} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label>Cliente: </label>
                    <select value={clienteSeleccionado} onChange={(e) => setClienteSeleccionado(e.target.value)}>
                        <option value="">Seleccione un cliente</option>
                        {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </select>
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label>Productos en esta Venta:</label>
                    {productosEnVenta.length === 0 ? <p>Añada productos desde la lista de la derecha.</p> : (
                        <table style={{ width: '100%', marginTop: '10px' }}>
                            <thead><tr><th>Producto</th><th>Cantidad</th><th>Precio Unit.</th><th>Acción</th></tr></thead>
                            <tbody>
                                {productosEnVenta.map(p => (
                                    <tr key={p.id}>
                                        <td>{p.nombre_producto}</td>
                                        <td><input type="number" value={p.cantidadVenta} onChange={(e) => actualizarProductoEnVenta(p.id, 'cantidadVenta', e.target.value)} style={{ width: '60px' }} /></td>
                                        <td><input type="number" placeholder="0.00" value={p.precio_unitario} onChange={(e) => actualizarProductoEnVenta(p.id, 'precio_unitario', e.target.value)} style={{ width: '80px' }} /></td>
                                        <td><button onClick={() => eliminarProductoDeVenta(p.id)}>Quitar</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label>Cantidad de Bultos: </label>
                    <input type="number" value={cantidadBultos} onChange={e => setCantidadBultos(e.target.value)} style={{ width: '60px' }} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label>
                        <input type="checkbox" checked={esAfectaIva} onChange={(e) => setEsAfectaIva(e.target.checked)} />
                        Venta Afecta a IVA
                    </label>
                </div>
                <button onClick={handleRegistrarVenta} style={{ padding: '10px 20px', fontSize: '1.2em' }}>Registrar Venta</button>
            </div>
            <div style={{ flex: 1, borderLeft: '1px solid #ccc', paddingLeft: '20px' }}>
                <h3>Añadir Productos del Inventario</h3>
                <input type="text" placeholder="Buscar por nombre o código..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '10px' }}/>
                <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    {productosFiltrados.map(p => (
                        <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee' }}>
                            <span>{p.nombre_producto} (Stock: {p.stock})</span>
                            <button onClick={() => agregarProductoAVenta(p)}>Añadir</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default RegistrarVenta;