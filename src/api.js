// src/api.js
const API_URL = 'https://todostock.onrender.com/'; // OJO: Asegúrate que esta sea tu URL de Render

export const fetchWithAuth = async (endpoint, options = {}) => {
    const sessionString = localStorage.getItem('supabase_session');
    const session = sessionString && sessionString !== 'undefined' ? JSON.parse(sessionString) : null;
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

    if (!response.ok) {
        let errorMessage = `Error del servidor: ${response.status}`;
        try {
            // Intenta leer el mensaje de error del backend si está en formato JSON
            const errorData = await response.json();
            errorMessage = errorData.message || JSON.stringify(errorData);
        } catch (e) {
            // Si la respuesta de error no es JSON, no hacemos nada y usamos el mensaje genérico
        }
        
        // Si el token es inválido, forzamos el logout en el frontend
        if (response.status === 401 && endpoint !== '/api/login') {
            localStorage.removeItem('supabase_session');
            window.location.reload();
        }

        throw new Error(errorMessage);
    }
    
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        // Solo intenta parsear si la respuesta es efectivamente JSON
        return response.json();
    } else {
        // Devuelve null o un objeto vacío si no hay contenido, para no romper el código
        return null;
    }
};