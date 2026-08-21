-- Dto conoce la estructura de datos del árbol y la convierte a JSON
-- Dto: Data Transfer Object, es un patrón de diseño que se usa para transferir datos
{-# LANGUAGE DeriveGeneric #-}
{-# LANGUAGE OverloadedStrings #-}
module Dto (ValorRequest(..), treeToJSON) where

import Data.Aeson 
import GHC.Generics
import Tree (Tree(..))

newtype ValorRequest = ValorRequest { valor :: Int } deriving (Generic, Show)
-- Instancia de FromJSON para ValorRequest, permite parsear JSON a ValorRequest
instance FromJSON ValorRequest

treeToJSON :: Tree Int -> Value
treeToJSON Leaf = Null
treeToJSON (Node izq v der) = object
  [ "valor" .= v
  , "izquierda" .= treeToJSON izq
  , "derecha" .= treeToJSON der
  ]