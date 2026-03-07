from fastapi import APIRouter
from typing import List
from models.schemas import Accion, Sector, HeatmapItem
from data.ibex35_mock import get_mock_data, IBEX35_COMPANIES

router = APIRouter(prefix="/api/mercado", tags=["mercado"])

@router.get("/acciones", response_model=List[Accion])
async def get_acciones():
    return get_mock_data()

@router.get("/acciones/{ticker}", response_model=Accion)
async def get_accion(ticker: str):
    data = get_mock_data()
    for item in data:
        if item["ticker"].upper() == ticker.upper():
            return item
    return None

@router.get("/sectores", response_model=List[Sector])
async def get_sectores():
    sectors_map = {}
    for co in IBEX35_COMPANIES:
        s = co["sector"]
        sub = co["subcategoria"]
        if s not in sectors_map:
            sectors_map[s] = set()
        sectors_map[s].add(sub)
    
    return [Sector(nombre=s, subcategorias=list(subs)) for s, subs in sectors_map.items()]

@router.get("/heatmap", response_model=List[HeatmapItem])
async def get_heatmap():
    data = get_mock_data()
    return [
        HeatmapItem(
            ticker=item["ticker"],
            nombre=item["nombre"],
            sector=item["sector"],
            capitalizacion=item["capitalizacion"],
            precio=item["precio"],
            cambio_pct=item["cambio_pct"]
        ) for item in data
    ]

@router.get("/estadisticas")
async def get_estadisticas():
    data = get_mock_data()
    suben = len([x for x in data if x["cambio_pct"] > 0])
    bajan = len([x for x in data if x["cambio_pct"] < 0])
    total = len(data)
    avg_change = sum([x["cambio_pct"] for x in data]) / total if total > 0 else 0
    
    return {
        "suben": suben,
        "bajan": bajan,
        "sin_cambio": total - suben - bajan,
        "variacion_media": round(avg_change, 2),
        "volumen_total": sum([x["volumen"] for x in data])
    }
