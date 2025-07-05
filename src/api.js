// src/api.js

// OJO: Si despliegas, cambia esta URL por la de tu backend en Render.
const API_URL = 'https://todostock.onrender.com'; 

export const fetchWithAuth = async (endpoint, options = {}) => {
    const sessionString = localStorage.getItem('supabase_session');
    if (!sessionString) {
        // Si no hay sesión, no continuar y forzar logout
        window.location.href = '/'; 
        return;
    }

    const session = JSON.parse(sessionString);
    const token = session?.access_token;

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    // Si el token es inválido o expiró, el backend devolverá un error 401
    if (response.status === 401) {
        localStorage.removeItem('supabase_session');
        window.location.reload(); // Forzar a la pantalla de login
        throw new Error('Sesión inválida o expirada.');
    }

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ocurrió un error en la petición.');
    }

    // Si la respuesta no tiene contenido (ej: en un DELETE), no intentes parsear JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
    } else {
        return; 
    }
};