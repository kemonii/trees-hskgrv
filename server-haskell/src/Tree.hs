-- Exportamos la estructura de datos del árbol y las funciones para manipularlo
module Tree
  ( Tree(..)
  , vacio
  , insertar
  , buscar
  , eliminar
  , aLista
  ) where

import TreeError (TreeError(..))

-- Estructura de datos del árbol binario de búsqueda
data Tree a = Leaf | Node (Tree a) a (Tree a)
  deriving (Show, Eq)

-- Arbol vacío
vacio :: Tree a
vacio = Leaf

-- Insertar un valor en el árbol, devuelve un nuevo árbol o un error si el valor ya existe
insertar :: Ord a => a -> Tree a -> Either TreeError (Tree a)
insertar x Leaf = Right (Node Leaf x Leaf)
insertar x (Node izq v der)
  | x == v    = Left ValorDuplicado
  | x < v     = do
      izq' <- insertar x izq
      Right (Node izq' v der)
  | otherwise = do
      der' <- insertar x der
      Right (Node izq v der')

-- Buscar un valor en el árbol, devuelve True si está, False si no
buscar :: Ord a => a -> Tree a -> Bool
buscar _ Leaf = False
buscar x (Node izq v der)
  | x == v    = True
  | x < v     = buscar x izq
  | otherwise = buscar x der

-- Eliminar un valor del árbol, devuelve un nuevo árbol o un error si el valor no existe
eliminar :: Ord a => a -> Tree a -> Either TreeError (Tree a)
eliminar _ Leaf = Left ValorNoEncontrado
eliminar x (Node izq v der)
  | x < v     = do
      izq' <- eliminar x izq
      Right (Node izq' v der)
  | x > v     = do
      der' <- eliminar x der
      Right (Node izq v der')
  | otherwise = Right (fusionar izq der)

-- Fusiona los dos subárboles al eliminar un nodo con dos hijos
-- Según la teoría, reemplazamos con el mínimo del subárbol derecho
fusionar :: Tree a -> Tree a -> Tree a
fusionar Leaf der = der
fusionar izq Leaf = izq
fusionar izq der = Node izq minDer restoDer
  where
    (minDer, restoDer) = extraerMinimo der

-- Extrae el mínimo de un árbol, devuelve el valor mínimo y el árbol sin ese valor
extraerMinimo :: Tree a -> (a, Tree a)
extraerMinimo (Node Leaf v der) = (v, der)
extraerMinimo (Node izq v der) =
  let (m, izq') = extraerMinimo izq
  in (m, Node izq' v der)
extraerMinimo Leaf = error "extraerMinimo: árbol vacío"

-- Recorre el árbol en inorden y devuelve una lista con los valores
aLista :: Tree a -> [a]
aLista Leaf = []
aLista (Node izq v der) = aLista izq ++ [v] ++ aLista der