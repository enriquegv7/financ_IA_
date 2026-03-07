import random
from typing import Optional

IBEX35_COMPANIES = [
    {"ticker": "SAN",    "nombre": "Santander",      "sector": "Financiero",        "subcategoria": "Banca"},
    {"ticker": "BBVA",   "nombre": "BBVA",            "sector": "Financiero",        "subcategoria": "Banca"},
    {"ticker": "ITX",    "nombre": "Inditex",         "sector": "Consumo",           "subcategoria": "Textil"},
    {"ticker": "IBE",    "nombre": "Iberdrola",       "sector": "Utilities",         "subcategoria": "Electricidad"},
    {"ticker": "TEF",    "nombre": "Telefónica",      "sector": "Telecomunicaciones","subcategoria": "Operador"},
    {"ticker": "REP",    "nombre": "Repsol",          "sector": "Energía",           "subcategoria": "Petróleo"},
    {"ticker": "CABK",   "nombre": "CaixaBank",       "sector": "Financiero",        "subcategoria": "Banca"},
    {"ticker": "AMS",    "nombre": "Amadeus",         "sector": "Tecnología",        "subcategoria": "Software"},
    {"ticker": "ACS",    "nombre": "ACS",             "sector": "Industria",         "subcategoria": "Construcción"},
    {"ticker": "FER",    "nombre": "Ferrovial",       "sector": "Industria",         "subcategoria": "Construcción"},
    {"ticker": "MAP",    "nombre": "Mapfre",          "sector": "Financiero",        "subcategoria": "Seguros"},
    {"ticker": "ELE",    "nombre": "Endesa",          "sector": "Utilities",         "subcategoria": "Electricidad"},
    {"ticker": "RED",    "nombre": "Red Eléctrica",   "sector": "Utilities",         "subcategoria": "Electricidad"},
    {"ticker": "CLNX",   "nombre": "Cellnex",         "sector": "Telecomunicaciones","subcategoria": "Infraestructura"},
    {"ticker": "COL",    "nombre": "Inmocolonial",    "sector": "Inmobiliario",      "subcategoria": "SOCIMI"},
    {"ticker": "MTS",    "nombre": "ArcelorMittal",   "sector": "Materiales",        "subcategoria": "Acero"},
    {"ticker": "GRF",    "nombre": "Grifols",         "sector": "Salud",             "subcategoria": "Farmacia"},
    {"ticker": "ACX",    "nombre": "Acerinox",        "sector": "Materiales",        "subcategoria": "Acero"},
    {"ticker": "ENG",    "nombre": "Enagás",          "sector": "Utilities",         "subcategoria": "Gas"},
    {"ticker": "NTGY",   "nombre": "Naturgy",         "sector": "Utilities",         "subcategoria": "Energía"},
    {"ticker": "AENA",   "nombre": "AENA",            "sector": "Industria",         "subcategoria": "Transporte"},
    {"ticker": "IAG",    "nombre": "IAG",             "sector": "Industria",         "subcategoria": "Aerolíneas"},
    {"ticker": "MEL",    "nombre": "Meliá",           "sector": "Consumo",           "subcategoria": "Turismo"},
    {"ticker": "SOL",    "nombre": "Solaria",         "sector": "Energía",           "subcategoria": "Renovables"},
    {"ticker": "BNXT",   "nombre": "Bankinter",       "sector": "Financiero",        "subcategoria": "Banca"},
    {"ticker": "UNI",    "nombre": "Unicaja",         "sector": "Financiero",        "subcategoria": "Banca"},
    {"ticker": "SAB",    "nombre": "Sabadell",        "sector": "Financiero",        "subcategoria": "Banca"},
    {"ticker": "LOG",    "nombre": "Logista",         "sector": "Industria",         "subcategoria": "Logística"},
    {"ticker": "PHM",    "nombre": "Pharma Mar",      "sector": "Salud",             "subcategoria": "Biotecnología"},
    {"ticker": "VIS",    "nombre": "Viscofan",        "sector": "Consumo",           "subcategoria": "Alimentación"},
    {"ticker": "SGRE",   "nombre": "Siemens Gamesa",  "sector": "Energía",           "subcategoria": "Renovables"},
    {"ticker": "PUIG",   "nombre": "Puig",            "sector": "Consumo",           "subcategoria": "Cuidado Personal"},
    {"ticker": "FLUIDRA","nombre": "Fluidra",         "sector": "Industria",         "subcategoria": "Equipamiento"},
    {"ticker": "ROVI",   "nombre": "Rovi",            "sector": "Salud",             "subcategoria": "Farmacia"},
    {"ticker": "NXST",   "nombre": "Nexts",           "sector": "Tecnología",        "subcategoria": "Software"},
]


def get_mock_data() -> list:
    """Genera datos de mercado simulados para todas las empresas del IBEX35."""
    return [
        {
            **co,
            "precio":         round(random.uniform(1.0, 150.0), 2),
            "cambio_pct":     round(random.uniform(-5.0, 5.0), 2),
            "capitalizacion": round(random.uniform(500, 100_000), 0) * 1_000_000,
            "volumen":        round(random.uniform(100_000, 10_000_000), 0),
        }
        for co in IBEX35_COMPANIES
    ]


def find_accion_by_ticker(ticker: str) -> Optional[dict]:
    """Devuelve los datos de mercado de una empresa por ticker, o None si no existe."""
    ticker_upper = ticker.upper()
    return next(
        (item for item in get_mock_data() if item["ticker"] == ticker_upper),
        None,
    )
