-- Definición de errores para el manejo de operaciones en el árbol
module TreeError (TreeError(..)) where

data TreeError = ValorDuplicado | ValorNoEncontrado
  deriving (Show, Eq)