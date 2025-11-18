// src/services/api.js
const API_URL = 'http://localhost:8080/api';

// Función helper para hacer peticiones
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error en la petición');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en API:', error);
    throw error;
  }
};

// ============ VOTOS ============

// Registrar un voto
export const registrarVoto = async (votoData) => {
  return fetchAPI('/votos/registrar', {
    method: 'POST',
    body: JSON.stringify(votoData),
  });
};

// Verificar si un DNI ya votó en una categoría
export const yaVoto = async (dni, categoriaId) => {
  return fetchAPI(`/votos/ya-voto/${dni}/${categoriaId}`);
};

// Obtener votos por DNI
export const obtenerVotosPorDni = async (dni) => {
  return fetchAPI(`/votos/dni/${dni}`);
};

// Obtener estadísticas generales
export const obtenerEstadisticas = async () => {
  return fetchAPI('/votos/estadisticas');
};

// Obtener estadísticas por categoría
export const obtenerEstadisticasPorCategoria = async (categoriaId) => {
  return fetchAPI(`/votos/estadisticas/categoria/${categoriaId}`);
};

// ============ CATEGORÍAS ============

export const obtenerCategorias = async () => {
  return fetchAPI('/categorias');
};

export const obtenerCategoriaPorId = async (id) => {
  return fetchAPI(`/categorias/${id}`);
};

export const crearCategoria = async (categoriaData) => {
  return fetchAPI('/categorias', {
    method: 'POST',
    body: JSON.stringify(categoriaData),
  });
};

export const actualizarCategoria = async (id, categoriaData) => {
  return fetchAPI(`/categorias/${id}`, {
    method: 'PUT',
    body: JSON.stringify(categoriaData),
  });
};

export const eliminarCategoria = async (id) => {
  return fetchAPI(`/categorias/${id}`, {
    method: 'DELETE',
  });
};

// ============ CANDIDATOS ============

export const obtenerCandidatos = async () => {
  return fetchAPI('/candidatos');
};

export const obtenerCandidatoPorId = async (id) => {
  return fetchAPI(`/candidatos/${id}`);
};

export const obtenerCandidatosPorCategoria = async (categoriaId) => {
  return fetchAPI(`/candidatos/categoria/${categoriaId}`);
};

export const crearCandidato = async (candidatoData) => {
  return fetchAPI('/candidatos', {
    method: 'POST',
    body: JSON.stringify(candidatoData),
  });
};

export const actualizarCandidato = async (id, candidatoData) => {
  return fetchAPI(`/candidatos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(candidatoData),
  });
};

export const eliminarCandidato = async (id) => {
  return fetchAPI(`/candidatos/${id}`, {
    method: 'DELETE',
  });
};

// ============ ELECCIONES ============

export const obtenerElecciones = async () => {
  return fetchAPI('/elecciones');
};

export const obtenerEleccionPorId = async (id) => {
  return fetchAPI(`/elecciones/${id}`);
};

export const crearEleccion = async (eleccionData) => {
  return fetchAPI('/elecciones', {
    method: 'POST',
    body: JSON.stringify(eleccionData),
  });
};

export const actualizarEleccion = async (id, eleccionData) => {
  return fetchAPI(`/elecciones/${id}`, {
    method: 'PUT',
    body: JSON.stringify(eleccionData),
  });
};

export const eliminarEleccion = async (id) => {
  return fetchAPI(`/elecciones/${id}`, {
    method: 'DELETE',
  });
};