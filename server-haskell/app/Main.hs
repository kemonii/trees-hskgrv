-- Instrucción para el GHC
{-# LANGUAGE OverloadedStrings #-}
-- Punto principal del servidor Haskell
-- Declaramos el módulo Main y exportamos la función main
module Main (main) where

-- Framework web Scotty para crear el servidor web
import Web.Scotty
-- Para guardar el árbol en memoria 
import Data.IORef
import Network.Wai.Middleware.Cors
import Tree (vacio)
import Api (app)

corsPolicy :: CorsResourcePolicy
corsPolicy = simpleCorsResourcePolicy
  { corsRequestHeaders = ["Content-Type"]
  }

main :: IO ()
main = do
  -- IORef es una como una caja donde podemos guardar el árbol en memoria y modificarlo
  -- Recordemos que Haskell es un lenguaje funcional puro, así que no podemos modificar variables 
  treeRef <- newIORef vacio
  -- Iniciamos el servidor web en el puerto 8081 y le pasamos la referencia al árbol
  scotty 8081 $ do
    middleware (cors (const $ Just corsPolicy))
    app treeRef