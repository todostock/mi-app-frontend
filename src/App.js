import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    // Esta función se conecta a tu API de Python
    fetch('https://mi-app-empresa-backend.onrender.com/')
      .then(response => response.json())
      .then(data => setClientes(data))
      .catch(error => console.error("Error al buscar clientes:", error));
  }, []); // El array vacío asegura que se ejecute solo una vez

  return (
    <div className="App">
      <header className="App-header">
        <h1>Lista de Clientes</h1>
        <ul>
          {clientes.map(cliente => (
            <li key={cliente.id}>
              {cliente.nombre} - {cliente.rut}
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;