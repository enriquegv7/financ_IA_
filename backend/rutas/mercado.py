from fastapi import APIRouter, HTTPException
from typing import List
from servicios import mercado_service
from esquemas.mercado import Accion, Sector, EstadisticasMercado

router = APIRouter(prefix="/api/mercado", tags=["mercado"])

@router.get("/acciones", response_model=List[Accion])
def listar_acciones():
    return mercado_service.obtener_todas_las_acciones()

@router.get("/acciones/{ticker}", response_model=Accion)
def ver_accion(ticker: str):
    accion = mercado_service.obtener_accion_por_ticker(ticker)
    if not accion:
        raise HTTPException(status_code=404, detail="Acción no encontrada")
    return accion

@router.get("/sectores", response_model=List[Sector])
def listar_sectores():
    return mercado_service.obtener_sectores_desde_empresas()

@router.get("/estadisticas", response_model=EstadisticasMercado)
def ver_estadisticas():
    return mercado_service.calcular_estadisticas_mercado()
