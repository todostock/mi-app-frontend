import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { fetchWithAuth } from '../api';
import logoSrc from '../assets/logo.jpg';

function VerVentas() {
    const [ventas, setVentas] = useState([]);

    const fetchVentas = async () => {
        try {
            const data = await fetchWithAuth('/api/ventas');
            setVentas(data);
        } catch (error) {
            console.error("Error al cargar ventas:", error);
        }
    };

    useEffect(() => {
        fetchVentas();
    }, []);

    const handleEliminar = async (ventaId) => {
        if (window.confirm(`¿Estás seguro de que quieres anular la venta #${ventaId}? Esta acción no se puede deshacer.`)) {
            try {
                await fetchWithAuth(`/api/ventas/${ventaId}`, { method: 'DELETE' });
                alert('Venta anulada correctamente.');
                fetchVentas();
            } catch (error) {
                alert(`Error al anular la venta: ${error.message}`);
            }
        }
    };
    
    const handleImprimirPDF = async (venta) => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const totalBultos = venta.cantidad_bultos;
        const etiquetaAncho = 95;
        const etiquetaAlto = 138;

        for (let i = 1; i <= totalBultos; i++) {
            const esPar = i % 2 === 0;
            const yPos = esPar ? 148.5 : 10;
            if (!esPar && i > 1) {
                pdf.addPage();
            }
            const tempContainer = document.createElement('div');
            const cliente = venta.clientes || {};
            tempContainer.innerHTML = `
                <div class="etiqueta-pdf" style="width: ${etiquetaAncho}mm; height: ${etiquetaAlto}mm;">
                    <div class="header-pdf"><img src="${logoSrc}" alt="Logo"/>
                        <div class="titulo-pdf"><h1>TodoStock SPA</h1><h2>Etiqueta de Despacho</h2></div>
                    </div>
                    <div class="cliente-info-pdf">
                        <h3>DESTINATARIO:</h3><p><strong>${cliente.nombre || ''}</strong></p>
                        <p><strong>RUT:</strong> ${cliente.rut || ''}</p>
                        <p><strong>Dirección:</strong> ${cliente.direccion || ''}</p>
                        <p><strong>Teléfono:</strong> ${cliente.telefono || ''}</p>
                    </div>
                    <div class="footer-pdf">
                        <p class="bulto-info-pdf">BULTO ${i} DE ${totalBultos}</p>
                        <p>ID VENTA: ${venta.id}</p>
                    </div>
                </div>`;
            document.body.appendChild(tempContainer);

            const canvas = await html2canvas(tempContainer.querySelector('.etiqueta-pdf'), { scale: 3 });
            const imgData = canvas.toDataURL('image/png');
            const xPos = (pdf.internal.pageSize.getWidth() - etiquetaAncho) / 2;
            pdf.addImage(imgData, 'PNG', xPos, yPos, etiquetaAncho, etiquetaAlto);
            document.body.removeChild(tempContainer);
        }
        pdf.save(`etiquetas-venta-${venta.id}.pdf`);
    };

    const formatFecha = (fechaISO) => new Date(fechaISO).toLocaleString('es-CL');

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>Historial de Ventas</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ background: '#f2f2f2' }}>
                        <th>ID Venta</th><th>Fecha</th><th>Cliente</th><th>Total Venta</th><th>Bultos</th><th>Tipo</th><th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {ventas.map((venta) => (
                        <tr key={venta.id}>
                            <td>{venta.id}</td>
                            <td>{formatFecha(venta.fecha)}</td>
                            <td>{venta.clientes?.nombre || 'N/A'}</td>
                            <td>${new Intl.NumberFormat('es-CL').format(venta.total)}</td>
                            <td>{venta.cantidad_bultos}</td>
                            <td>{venta.es_afecta_iva ? 'Afecta a IVA' : 'Exenta'}</td>
                            <td style={{ display: 'flex', gap: '5px' }}>
                                <button onClick={() => handleImprimirPDF(venta)}>Descargar PDF</button>
                                <button onClick={() => handleEliminar(venta.id)} style={{backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 8px', cursor: 'pointer'}}>Anular</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <style>{`.etiqueta-pdf{border:2px solid black;box-sizing:border-box;padding:5mm;width:95mm;height:138mm;display:flex;flex-direction:column;background-color:#fff}.header-pdf{display:flex;align-items:center;border-bottom:1px solid #ccc;padding-bottom:10px}.header-pdf img{width:120px;height:auto;margin-right:20px}.titulo-pdf h1,.titulo-pdf h2{margin:0}.titulo-pdf h1{font-size:1.5em}.titulo-pdf h2{font-size:1.2em;font-weight:400}.cliente-info-pdf{flex-grow:1;padding:15px 0;line-height:1.6}.cliente-info-pdf h3{margin:0 0 8px;font-size:1.1em}.cliente-info-pdf p{margin:3px 0;font-size:1.1em}.footer-pdf{border-top:1px solid #ccc;padding-top:10px;display:flex;justify-content:space-between;align-items:center}.footer-pdf p{margin:0;font-size:1em}.bulto-info-pdf{font-weight:700;font-size:1.4em}th,td{border:1px solid #ddd;padding:8px;text-align:left}`}</style>
        </div>
    );
}

export default VerVentas;