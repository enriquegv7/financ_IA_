from fastapi import APIRouter, HTTPException
from typing import List

from models.schemas import Accion, Sector, HeatmapItem
from data.ibex35_mock import get_mock_data, find_accion_by_ticker, IBEX35_COMPANIES

router = APIRouter(prefix="/api/mercado", tags=["mercado"])

_HEATMAP_FIELDS = ("ticker", "nombre", "sector", "capitalizacion", "precio", "cambio_pct")


@router.get("/acciones", response_model=List[Accion])
async def get_acciones():
    return get_mock_data()


@router.get("/acciones/{ticker}", response_model=Accion)
async def get_accion(ticker: str):
    accion = find_accion_by_ticker(ticker)
    if accion is None:
        raise HTTPException(status_code=404, detail=f"Acción '{ticker.upper()}' no encontrada")
    return accion


@router.get("/sectores", response_model=List[Sector])
async def get_sectores():
    sectors_map: dict[str, set] = {}
    for co in IBEX35_COMPANIES:
        sectors_map.setdefault(co["sector"], set()).add(co["subcategoria"])
    return [Sector(nombre=sector, subcategorias=list(subs)) for sector, subs in sectors_map.items()]


@router.get("/heatmap", response_model=List[HeatmapItem])
async def get_heatmap():
    return [{k: item[k] for k in _HEATMAP_FIELDS} for item in get_mock_data()]


@router.get("/estadisticas")
async def get_estadisticas():
    data = get_mock_data()
    total = len(data)
    suben = bajan = 0
    total_cambio = total_volumen = 0.0

    for item in data:
        cambio = item["cambio_pct"]
        if cambio > 0:
            suben += 1
        elif cambio < 0:
            bajan += 1
        total_cambio += cambio
        total_volumen += item["volumen"]

    return {
        "suben": suben,
        "bajan": bajan,
        "sin_cambio": total - suben - bajan,
        "variacion_media": round(total_cambio / total, 2) if total > 0 else 0,
        "volumen_total": total_volumen,
    }
