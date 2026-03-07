from pydantic import BaseModel
from typing import List, Optional

class Accion(BaseModel):
    ticker: str
    nombre: str
    sector: str
    subcategoria: str
    precio: float
    cambio_pct: float
    capitalizacion: float
    volumen: float

class Sector(BaseModel):
    nombre: str
    subcategorias: List[str]

class HeatmapItem(BaseModel):
    ticker: str
    nombre: str
    sector: str
    capitalizacion: float
    precio: float
    cambio_pct: float

class LoginRequest(BaseModel):
    email: str
    password: str

class User(BaseModel):
    email: str
    nombre: str
    token: Optional[str] = None
