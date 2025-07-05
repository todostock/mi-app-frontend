import React from 'react';

// Este componente es solo el diseño de la etiqueta para imprimir
const EtiquetaParaImprimir = React.forwardRef(({ venta }, ref) => {
    if (!venta) return null;

    const cliente = venta.clientes || {};
    let etiquetas = [];

    for (let i = 1; i <= venta.cantidad_bultos; i++) {
        etiquetas.push(
            <div key={i} className="etiqueta">
                <div className="header">
                    <img src="/logo.png" alt="Logo de la Empresa" />
                    <div className="titulo">
                        <h1>TodoStock SPA</h1>
                        <h2>Etiqueta de Despacho</h2>
                    </div>
                </div>

                <div className="cliente-info">
                    <h3>DESTINATARIO:</h3>
                    <p><strong>{cliente.nombre || 'Sin nombre'}</strong></p>
                    <p><strong>RUT:</strong> {cliente.rut || 'N/A'}</p>
                    <p><strong>Dirección:</strong> {cliente.direccion || 'Sin dirección'}</p>
                    <p><strong>Teléfono:</strong> {cliente.telefono || 'Sin teléfono'}</p>
                </div>

                <div className="footer">
                    <p className="bulto-info">BULTO {i} DE {venta.cantidad_bultos}</p>
                    <p>ID VENTA: {venta.id}</p>
                </div>
            </div>
        );
    }

    return (
        <div ref={ref} className="componente-imprimir">
            {etiquetas}
        </div>
    );
});

export default EtiquetaParaImprimir;