// SVG = Scalable Vector Graphics (Gráficos Vectoriales Escalables)
// Es como una especie de namespace para crear el árbol 
const SVG_NS = 'http://www.w3.org/2000/svg';


export function render(arbol) {
  // Borramos el contenido previo del SVG (arbol anterior) para dibujar el nuevo árbol
  const svg = document.getElementById('arbol-svg');
  svg.innerHTML = '';

  // Si el árbol está vacío, mostramos un mensaje 
  if (!arbol) {
    svg.setAttribute('viewBox', '0 0 400 100');
    const texto = document.createElementNS(SVG_NS, 'text');
    texto.setAttribute('x', 200);
    texto.setAttribute('y', 50);
    texto.setAttribute('text-anchor', 'middle');
    texto.textContent = 'Árbol vacío';
    svg.appendChild(texto);
    return;
  }

  // Para ordenar el árbol usamos el tipo de recorrido "in-order" (izquierda, raíz, derecha) en la posición x
  // Para la posición y usamos la profundidad del nodo en el árbol (nivel del nodo)
  // La lógica del árbol binario de búsqueda asegura que los nodos a la izquierda son menores 
  // y los nodos a la derecha son mayores, lo que nos permite dibujar el árbol de manera ordenada.
  const posiciones = [];
  let contador = 0; // Contador para la posición x de los nodos

  function calcularPosiciones(nodo, profundidad) {
    if (!nodo) return;
    calcularPosiciones(nodo.izquierda, profundidad + 1);
    const x = contador * 60 + 40;
    contador++;
    posiciones.push({ nodo, x, y: profundidad * 70 + 40 });
    calcularPosiciones(nodo.derecha, profundidad + 1);
  }
  calcularPosiciones(arbol, 0); 
  // Iniciamos la recursión desde la raíz del árbol con profundidad 0

  const anchoTotal = contador * 60 + 40;
  const altoTotal = Math.max(...posiciones.map(p => p.y)) + 60;
  svg.setAttribute('viewBox', `0 0 ${anchoTotal} ${altoTotal}`);

  // Función para buscar la posición de un nodo dado
  function buscarPosicion(nodo) {
    return posiciones.find(p => p.nodo === nodo);
  }

  // Función para dibujar una línea entre dos puntos (x1, y1) y (x2, y2)
  function dibujarLinea(x1, y1, x2, y2) {
    const linea = document.createElementNS(SVG_NS, 'line');
    linea.setAttribute('x1', x1);
    linea.setAttribute('y1', y1);
    linea.setAttribute('x2', x2);
    linea.setAttribute('y2', y2);
    linea.setAttribute('stroke', '#999');
    svg.appendChild(linea);
  }

  // Recursivamente dibujamos las líneas entre los nodos padre e hijo
  function dibujarLineas(nodo) {
    if (!nodo) return;
    const posActual = buscarPosicion(nodo);
    if (nodo.izquierda) {
      const posIzq = buscarPosicion(nodo.izquierda);
      dibujarLinea(posActual.x, posActual.y, posIzq.x, posIzq.y);
      dibujarLineas(nodo.izquierda);
    }
    if (nodo.derecha) {
      const posDer = buscarPosicion(nodo.derecha);
      dibujarLinea(posActual.x, posActual.y, posDer.x, posDer.y);
      dibujarLineas(nodo.derecha);
    }
  }
  dibujarLineas(arbol);

  // Dibujamos los nodos como círculos con el valor del nodo en el centro
  posiciones.forEach(({ nodo, x, y }) => {
    const circulo = document.createElementNS(SVG_NS, 'circle');
    circulo.setAttribute('cx', x);
    circulo.setAttribute('cy', y);
    circulo.setAttribute('r', 18);
    circulo.setAttribute('fill', '#4a90d9');
    // Nota: Aquí coloqué un color azul a los nodos,
    // pero se puede cambiar a una clase CSS y definir el color en un archivo CSS externo.
    svg.appendChild(circulo);

    const texto = document.createElementNS(SVG_NS, 'text');
    texto.setAttribute('x', x);
    texto.setAttribute('y', y);
    texto.setAttribute('text-anchor', 'middle');
    texto.setAttribute('dominant-baseline', 'central'); 
    // Centramos el texto verticalmente en el nodo
    texto.setAttribute('fill', 'white');
    texto.textContent = nodo.valor;
    svg.appendChild(texto);
  });
}