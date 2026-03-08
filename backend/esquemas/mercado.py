from typing import List, Optional
from typing_extensions import TypedDict

Accion = TypedDict('Accion', {
    'ticker': str,
    'nombre': str,
    'sector': str,
    'subcategoria': str,
    'precio': float,
    'cambio_pct': float,
    'capitalizacion': float,
    'volumen': float
})

Sector = TypedDict('Sector', {
    'nombre': str,
    'numero_empresas': int,
    'capitalizacion_total': float
})

EstadisticasMercado = TypedDict('EstadisticasMercado', {
    'total_empresas': int,
    'capitalizacion_total': float,
    'volumen_total': float,
    'mayor_subida': Optional[Accion],
    'mayor_bajada': Optional[Accion]
})

ResultadoBusqueda = TypedDict('ResultadoBusqueda', {
    'ticker': str,
    'nombre': str,
    'tipo': str  # 'empresa', 'sector', etc.
})
