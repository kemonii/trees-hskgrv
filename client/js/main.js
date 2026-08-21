// Importamos el estado compartido y la función de renderizado
import { state } from './state.js';
import { render } from './render.js';

// Obtenemos referencias a los elementos del DOM
const backendSelect = document.getElementById('backend-select');
const valorInput = document.getElementById('valor-input');
const mensajeDiv = document.getElementById('mensaje');

// Función para mostrar mensajes al usuario de forma centralizada
function mostrarMensaje(texto) {
  mensajeDiv.textContent = texto;
}

// Escuchamos cambios en el selector de backend 
// para actualizar la URL y recargar el árbol
backendSelect.addEventListener('change', () => {
  state.backendUrl = backendSelect.value;
  cargarArbol();
});

// Función para cargar el árbol desde el backend y renderizarlo
async function cargarArbol() {
  try {
    // Hacemos una solicitud GET al backend para obtener el árbol
    const res = await fetch(`${state.backendUrl}/arbol`);
    state.arbol = await res.json();
    render(state.arbol);
  } catch (e) {
    mostrarMensaje('No se pudo conectar al backend...');
  }
}

// Función para insertar un valor en el árbol
async function insertar() {
  const valor = Number(valorInput.value);
  if (Number.isNaN(valor)) { mostrarMensaje('Ingrese un número válido'); return; }
  try {
    // Enviamos una solicitud POST al backend para insertar el valor
    const res = await fetch(`${state.backendUrl}/insertar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ valor })
    });
    const data = await res.json();
    if (!res.ok) { mostrarMensaje(data.error || 'Error al insertar'); return; }
    mostrarMensaje('');
    state.arbol = data;
    render(state.arbol);
  } catch (e) {
    mostrarMensaje('No se pudo conectar al backend...');
  }
}

// Función para buscar un valor en el árbol
async function buscar() {
  const valor = Number(valorInput.value);
  if (Number.isNaN(valor)) { mostrarMensaje('Ingrese un número válido'); return; }
  try {
    // Enviamos una solicitud POST al backend para buscar el valor
    const res = await fetch(`${state.backendUrl}/buscar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ valor })
    });
    const data = await res.json();
    mostrarMensaje(data.encontrado ? `${valor} está en el árbol` : `${valor} no está en el árbol`);
  } catch (e) {
    mostrarMensaje('No se pudo conectar al backend...');
  }
}

async function eliminar() {
  const valor = Number(valorInput.value);
  if (Number.isNaN(valor)) { mostrarMensaje('Ingrese un número válido'); return; }
  try {
    // Enviamos una solicitud POST al backend para eliminar el valor
    const res = await fetch(`${state.backendUrl}/eliminar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ valor })
    });
    const data = await res.json();
    if (!res.ok) { mostrarMensaje(data.error || 'Error al eliminar'); return; }
    mostrarMensaje('');
    state.arbol = data;
    render(state.arbol);
  } catch (e) {
    mostrarMensaje('No se pudo conectar al backend...');
  }
}

// Conectamos los botones del HTML con sus respectivas funciones
document.getElementById('btn-insertar').addEventListener('click', insertar);
document.getElementById('btn-buscar').addEventListener('click', buscar);
document.getElementById('btn-eliminar').addEventListener('click', eliminar);

// Cargamos el árbol al iniciar la aplicación
cargarArbol();