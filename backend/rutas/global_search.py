from fastapi import APIRouter, Query
from typing import List
from servicios import search_service
from esquemas.mercado import ResultadoBusqueda

router = APIRouter(prefix="/api/busqueda", tags=["busqueda"])

@router.get("/global", response_model=List[ResultadoBusqueda])
def busqueda_global(q: str = Query(..., min_length=1)):
    """Búsqueda global simplificada en la lista de empresas."""
    return search_service.buscar_empresas(q)
