from fastapi import APIRouter, Query
from typing import List, Optional

from data.ibex35_mock import get_mock_data

router = APIRouter(prefix="/api/global", tags=["global"])


@router.get("/buscar")
async def buscar(q: Optional[str] = Query(None, description="Texto a buscar por nombre o ticker")):
    data = get_mock_data()

    def matches(item: dict) -> bool:
        if not q:
            return True
        q_lower = q.lower()
        return q_lower in item["nombre"].lower() or q_lower in item["ticker"].lower()

    return [
        {
            "nombre":     item["nombre"],
            "ticker":     item["ticker"],
            "tipo":       "Acción",
            "mercado":    "BME",
            "precio":     item["precio"],
            "cambio_pct": item["cambio_pct"],
            "divisa":     "EUR",
        }
        for item in data
        if matches(item)
    ]
