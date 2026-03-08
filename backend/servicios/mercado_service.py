from typing import List, Optional, Dict
from data.ibex35_mock import obtener_datos_simulados
from esquemas.mercado import Accion, Sector, EstadisticasMercado

def obtener_todas_las_acciones() -> List[Accion]:
    """Devuelve la lista completa de acciones del IBEX35 con datos simulados."""
    return obtener_datos_simulados()

def obtener_accion_por_ticker(ticker: str) -> Optional[Accion]:
    """Busca una acción específica por su ticker."""
    ticker_up = ticker.upper()
    acciones = obtener_datos_simulados()
    return next((a for a in acciones if a['ticker'] == ticker_up), None)

def obtener_sectores_desde_empresas() -> List[Sector]:
    """Agrupa las empresas por sector y calcula métricas básicas."""
    acciones = obtener_datos_simulados()
    sectores_dict: Dict[str, Sector] = {}
    
    for a in acciones:
        nombre_sector = a['sector']
        if nombre_sector not in sectores_dict:
            sectores_dict[nombre_sector] = {
                'nombre': nombre_sector,
                'numero_empresas': 0,
                'capitalizacion_total': 0.0
            }
        sectores_dict[nombre_sector]['numero_empresas'] += 1
        sectores_dict[nombre_sector]['capitalizacion_total'] += a['capitalizacion']
        
    return list(sectores_dict.values())

def calcular_estadisticas_mercado() -> EstadisticasMercado:
    """Calcula estadísticas globales del mercado."""
    acciones = obtener_datos_simulados()
    if not acciones:
        return {
            'total_empresas': 0,
            'capitalizacion_total': 0.0,
            'volumen_total': 0.0,
            'mayor_subida': None,
            'mayor_bajada': None
        }
        
    cap_total = sum(a['capitalizacion'] for a in acciones)
    vol_total = sum(a['volumen'] for a in acciones)
    
    mayor_subida = max(acciones, key=lambda x: x['cambio_pct'])
    mayor_bajada = min(acciones, key=lambda x: x['cambio_pct'])
    
    return {
        'total_empresas': len(acciones),
        'capitalizacion_total': cap_total,
        'volumen_total': vol_total,
        'mayor_subida': mayor_subida,
        'mayor_bajada': mayor_bajada
    }
