from fastapi import APIRouter, Query
from typing import List, Optional
from data.ibex35_mock import get_mock_data

router = APIRouter(prefix="/api/global", tags=["global"])

@router.get("/buscar")
async def buscar(
    q: Optional[str] = Query(None),
    tipo: Optional[str] = Query(None),
    divisa: Optional[str] = Query(None),
    mercado: Optional[str] = Query(None)
):
    data = get_mock_data()
    results = []
    
    # Simple search logic
    for item in data:
        match = True
        if q:
            if q.lower() not in item["nombre"].lower() and q.lower() not in item["ticker"].lower():
                match = False
        
        if match:
            results.append({
                "nombre": item["nombre"],
                "ticker": item["ticker"],
                "tipo": "Acción",
                "mercado": "BME",
                "precio": item["precio"],
                "cambio_pct": item["cambio_pct"],
                "divisa": "EUR"
            })
            
    return results
