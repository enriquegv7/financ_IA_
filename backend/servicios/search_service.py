from typing import List
from data.ibex35_mock import IBEX35_COMPANIES
from esquemas.mercado import ResultadoBusqueda

def buscar_empresas(termino: str) -> List[ResultadoBusqueda]:
    """Busca empresas por ticker o nombre."""
    termino_clean = termino.lower()
    resultados = []
    
    for empresa in IBEX35_COMPANIES:
        if termino_clean in empresa['ticker'].lower() or termino_clean in empresa['nombre'].lower():
            resultados.append({
                'ticker': empresa['ticker'],
                'nombre': empresa['nombre'],
                'tipo': 'empresa'
            })
            
    return resultados
