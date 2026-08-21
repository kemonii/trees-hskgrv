// Estado global de la aplicación, main y render.js lo usan para compartir el árbol y la URL del backend
// porque ninguno de los guarda su propia copia del árbol
export const state = {
  // Indica el último árbol recibido del backend (arranca en null porque no hay nada)
  arbol: null,
  // Indica cuál de los backends está activo (arranca en localhost:8081)
  // pero puede cambiarse con el selector de backend en la interfaz
  backendUrl: 'http://localhost:8081'
};