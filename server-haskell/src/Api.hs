{-# LANGUAGE OverloadedStrings #-}
module Api (app) where

import Web.Scotty
import Data.IORef
import Network.HTTP.Types.Status (status409, status404)
import Data.Aeson (object, (.=))
import Tree (Tree, insertar, buscar, eliminar)
import TreeError (TreeError(..))
import Dto (ValorRequest(..), treeToJSON)

-- Configuración de CORS para permitir solicitudes desde cualquier origen
-- Delega toda la logica a Tree, solo llamamos a las funciones de Tree
app :: IORef (Tree Int) -> ScottyM ()
app treeRef = do
  get "/arbol" $ do
    arbol <- liftIO $ readIORef treeRef
    json (treeToJSON arbol)

-- JSON parsea el request body a ValorRequest, luego leemos el árbol de memoria 
-- y llamamos a la función insertar de Tree
  post "/insertar" $ do
    ValorRequest v <- jsonData
    arbol <- liftIO $ readIORef treeRef
    case insertar v arbol of
      Right nuevo -> do
        liftIO $ writeIORef treeRef nuevo
        json (treeToJSON nuevo)
      Left ValorDuplicado -> do
        status status409
        json (object ["error" .= ("Ese valor ya existe" :: String)])
      Left _ -> status status409

-- Buscar devuelve un JSON con un booleano indicando si el valor está en el árbol
  post "/buscar" $ do
    ValorRequest v <- jsonData
    arbol <- liftIO $ readIORef treeRef
    json (object ["encontrado" .= buscar v arbol])

-- Eliminar devuelve un JSON con el árbol actualizado si se pudo eliminar el valor
  post "/eliminar" $ do
    ValorRequest v <- jsonData
    arbol <- liftIO $ readIORef treeRef
    case eliminar v arbol of
      Right nuevo -> do
        liftIO $ writeIORef treeRef nuevo
        json (treeToJSON nuevo)
      Left ValorNoEncontrado -> do
        status status404
        json (object ["error" .= ("Ese valor no existe" :: String)])
      Left _ -> status status404