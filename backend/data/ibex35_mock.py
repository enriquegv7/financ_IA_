import random

IBEX35_COMPANIES = [
    {"ticker": "SAN", "nombre": "Santander", "sector": "Financiero", "subcategoria": "Banca"},
    {"ticker": "BBVA", "nombre": "BBVA", "sector": "Financiero", "subcategoria": "Banca"},
    {"ticker": "ITX", "nombre": "Inditex", "sector": "Consumo", "subcategoria": "Textil"},
    {"ticker": "IBE", "nombre": "Iberdrola", "sector": "Utilities", "subcategoria": "Electricidad"},
    {"ticker": "TEF", "nombre": "Telefónica", "sector": "Telecomunicaciones", "subcategoria": "Operador"},
    {"ticker": "REP", "nombre": "Repsol", "sector": "Energía", "subcategoria": "Petróleo"},
    {"ticker": "CABK", "nombre": "CaixaBank", "sector": "Financiero", "subcategoria": "Banca"},
    {"ticker": "AMS", "nombre": "Amadeus", "sector": "Tecnología", "subcategoria": "Software"},
    {"ticker": "ACS", "nombre": "ACS", "sector": "Industria", "subcategoria": "Construcción"},
    {"ticker": "FER", "nombre": "Ferrovial", "sector": "Industria", "subcategoria": "Construcción"},
    {"ticker": "MAP", "nombre": "Mapfre", "sector": "Financiero", "subcategoria": "Seguros"},
    {"ticker": "ELE", "nombre": "Endesa", "sector": "Utilities", "subcategoria": "Electricidad"},
    {"ticker": "RED", "nombre": "Red Eléctrica", "sector": "Utilities", "subcategoria": "Electricidad"},
    {"ticker": "CLNX", "nombre": "Cellnex", "sector": "Telecomunicaciones", "subcategoria": "Infraestructura"},
    {"ticker": "COL", "nombre": "Inmocolonial", "sector": "Inmobiliario", "subcategoria": "SOCIMI"},
    {"ticker": "MTS", "nombre": "ArcelorMittal", "sector": "Materiales", "subcategoria": "Acero"},
    {"ticker": "GRF", "nombre": "Grifols", "sector": "Salud", "subcategoria": "Farmacia"},
    {"ticker": "ACX", "nombre": "Acerinox", "sector": "Materiales", "subcategoria": "Acero"},
    {"ticker": "ENG", "nombre": "Enagás", "sector": "Utilities", "subcategoria": "Gas"},
    {"ticker": "NTGY", "nombre": "Naturgy", "sector": "Utilities", "subcategoria": "Energía"},
    {"ticker": "AENA", "nombre": "AENA", "sector": "Industria", "subcategoria": "Transporte"},
    {"ticker": "IAG", "nombre": "IAG", "sector": "Industria", "subcategoria": "Aerolíneas"},
    {"ticker": "MEL", "nombre": "Meliá", "sector": "Consumo", "subcategoria": "Turismo"},
    {"ticker": "SOL", "nombre": "Solaria", "sector": "Energía", "subcategoria": "Renovables"},
    {"ticker": "BNXT", "nombre": "Bankinter", "sector": "Financiero", "subcategoria": "Banca"},
    {"ticker": "UNI", "nombre": "Unicaja", "sector": "Financiero", "subcategoria": "Banca"},
    {"ticker": "SAB", "nombre": "Sabadell", "sector": "Financiero", "subcategoria": "Banca"},
    {"ticker": "LOG", "nombre": "Logista", "sector": "Industria", "subcategoria": "Logística"},
    {"ticker": "PHM", "nombre": "Pharma Mar", "sector": "Salud", "subcategoria": "Biotecnología"},
    {"ticker": "VIS", "nombre": "Viscofan", "sector": "Consumo", "subcategoria": "Alimentación"},
    {"ticker": "SGRE", "nombre": "Siemens Gamesa", "sector": "Energía", "subcategoria": "Renovables"},
    {"ticker": "PUIG", "nombre": "Puig", "sector": "Consumo", "subcategoria": "Cuidado Personal"},
    {"ticker": "FLUIDRA", "nombre": "Fluidra", "sector": "Industria", "subcategoria": "Equipamiento"},
    {"ticker": "ROVI", "nombre": "Rovi", "sector": "Salud", "subcategoria": "Farmacia"},
    {"ticker": "NXST", "nombre": "Nexts", "sector": "Tecnología", "subcategoria": "Software"},
]

def get_mock_data():
    data = []
    for co in IBEX35_COMPANIES:
        price = round(random.uniform(1.0, 150.0), 2)
        change_pct = round(random.uniform(-5.0, 5.0), 2)
        cap = round(random.uniform(500, 100000), 0) * 1000000 # Millions
        vol = round(random.uniform(100000, 10000000), 0)
        data.append({
            **co,
            "precio": price,
            "cambio_pct": change_pct,
            "capitalizacion": cap,
            "volumen": vol
        })
    return data
