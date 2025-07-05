import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { fetchWithAuth } from '../api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const formatCurrency = (value) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);

function AnalisisVentas() {
    const [ventasAgrupadas, setVentasAgrupadas] = useState({});
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [mesSeleccionado, setMesSeleccionado] = useState('');
    const [anioSeleccionado, setAnioSeleccionado] = useState('');
    const [aniosDisponibles, setAniosDisponibles] = useState([]);

    useEffect(() => {
        const fetchDatosLibroVentas = async () => {
            try {
                const data = await fetchWithAuth('/api/analisis/libro_ventas');
                const agrupado = data.reduce((acc, item) => {
                    const fecha = new Date(item.ventas.fecha);
                    const mesAnio = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}`;
                    if (!acc[mesAnio]) {
                        acc[mesAnio] = { items: [], totalNeto: 0, totalIva: 0, totalBruto: 0 };
                    }
                    const neto = item.precio_unitario * item.cantidad;
                    const iva = item.ventas.es_afecta_iva ? neto * 0.19 : 0;
                    const bruto = neto + iva;
                    acc[mesAnio].items.push({
                        fecha: fecha.toLocaleDateString('es-CL'),
                        producto: item.productos.nombre_producto,
                        neto,
                        iva,
                        bruto
                    });
                    acc[mesAnio].totalNeto += neto;
                    acc[mesAnio].totalIva += iva;
                    acc[mesAnio].totalBruto += bruto;
                    return acc;
                }, {});
                setVentasAgrupadas(agrupado);
                const labels = Object.keys(agrupado).sort();
                const anios = [...new Set(labels.map(l => l.split('-')[0]))];
                setAniosDisponibles(anios);
                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Total Ventas Neto',
                            data: labels.map(mes => agrupado[mes].totalNeto),
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        },
                        {
                            label: 'Total Ventas Bruto',
                            data: labels.map(mes => agrupado[mes].totalBruto),
                            backgroundColor: 'rgba(255, 99, 132, 0.6)',
                        },
                    ]
                });
            } catch (error) {
                console.error("Error al cargar el análisis de ventas:", error);
            }
        };
        fetchDatosLibroVentas();
    }, []);

    const mesesFiltrados = Object.keys(ventasAgrupadas)
        .filter(mes => {
            if (!anioSeleccionado) return true;
            const anio = mes.split('-')[0];
            const mesNum = mes.split('-')[1];
            if (anio !== anioSeleccionado) return false;
            if (mesSeleccionado && mesNum !== mesSeleccionado) return false;
            return true;
        })
        .sort().reverse();

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>Análisis de Ventas</h2>
            <div style={{ maxWidth: '800px', margin: 'auto', marginBottom: '40px' }}>
                <Bar options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Resumen Mensual de Ventas (Neto vs. Bruto)' } } }} data={chartData} />
            </div>
            <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                <strong>Filtrar vista detallada:</strong>
                <select value={anioSeleccionado} onChange={e => setAnioSeleccionado(e.target.value)} style={{ marginLeft: '10px' }}>
                    <option value="">Todos los Años</option>
                    {aniosDisponibles.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
                <select value={mesSeleccionado} onChange={e => setMesSeleccionado(e.target.value)} style={{ marginLeft: '10px' }} disabled={!anioSeleccionado}>
                    <option value="">Todos los Meses</option>
                    {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                            {new Date(0, i).toLocaleString('es-CL', { month: 'long' })}
                        </option>
                    ))}
                </select>
            </div>
            {mesesFiltrados.map(mes => (
                <div key={mes} style={{ marginBottom: '40px' }}>
                    <h3>Ventas de {mes}</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f2f2f2' }}>
                                <th>Fecha</th><th>Producto Vendido</th><th>Monto Neto</th><th>IVA (19%)</th><th>Monto Bruto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ventasAgrupadas[mes].items.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.fecha}</td><td>{item.producto}</td><td>{formatCurrency(item.neto)}</td><td>{formatCurrency(item.iva)}</td><td>{formatCurrency(item.bruto)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr style={{ background: '#e0e0e0', fontWeight: 'bold' }}>
                                <td colSpan="2">TOTALES DEL MES:</td>
                                <td>{formatCurrency(ventasAgrupadas[mes].totalNeto)}</td><td>{formatCurrency(ventasAgrupadas[mes].totalIva)}</td><td>{formatCurrency(ventasAgrupadas[mes].totalBruto)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            ))}
            <style>{`th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }`}</style>
        </div>
    );
}

export default AnalisisVentas;