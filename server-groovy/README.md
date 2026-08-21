# Server para Groovy

# Estructura para endpoints y JSON

Puerto: 8082 (Para Groovy porque el 8081 ya lo usamos para Haskell)

GET /arbol
  → 200: el árbol actual, o null si está vacío
    {"valor": 10, "izquierda": null, "derecha": null}

POST /insertar
  Body: {"valor": 10}
  → 200 + árbol actualizado (mismo formato que /arbol), si insertó bien
  → 409 + {"error": "mensaje"}, si el valor ya existe

POST /buscar
  Body: {"valor": 10}
  → 200 + {"encontrado": true}  (siempre 200, nunca error)

POST /eliminar
  Body: {"valor": 10}
  → 200 + árbol actualizado, si eliminó bien
  → 404 + {"error": "mensaje"}, si el valor no existe

NOTA. Los nombres de los campos son literales. Lo puse en español para entender mejor como funciona el árbol.
IMPORTANTE. Eliminar este texto y .md después de leerlo. ^_^