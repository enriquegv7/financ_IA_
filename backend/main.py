import uuid
from datetime import datetime
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Routers de datos de mercado (estilo funcional previo)
from rutas import mercado, global_search

# Routers del sistema de autenticacion (nuevo estilo funcional)
from rutas import autenticacion as auth_app
from rutas import usuarios as users_app

# Base de datos y modelos
from bd.base import Base
from bd.sesion import SesionLocal, motor
from modelos.usuario import tabla_usuarios, RolUsuario, PlanUsuario

# Configuracion y seguridad
from nucleo.configuracion import configuracion
from nucleo.seguridad import hashear_contrasena


# ---------------------------------------------------------------------------
# Inicialización de base de datos
# ---------------------------------------------------------------------------

def crear_tablas() -> None:
    """Crea todas las tablas en SQLite si no existen."""
    Base.metadata.create_all(bind=motor)


def crear_primer_admin() -> None:
    """
    Crea el usuario administrador inicial si no existe.
    """
    correo_admin = configuracion["PRIMER_ADMIN_CORREO"]
    contrasena_admin = configuracion["PRIMER_ADMIN_CONTRASENA"]
    
    if not correo_admin or not contrasena_admin:
        return

    db = SesionLocal()
    try:
        # Consulta usando Table
        existente = db.query(tabla_usuarios).filter(tabla_usuarios.c.correo_electronico == correo_admin).first()
        if existente:
            return

        id_admin = str(uuid.uuid4())
        admin_data = {
            "id": id_admin,
            "correo_electronico": correo_admin,
            "nombre_usuario": configuracion["PRIMER_ADMIN_USUARIO"] or "admin",
            "contrasena_hasheada": hashear_contrasena(contrasena_admin),
            "rol": RolUsuario.ADMIN,
            "plan": PlanUsuario.DE_PAGO,
            "creado_en": datetime.utcnow(),
            "actualizado_en": datetime.utcnow(),
        }
        
        db.execute(tabla_usuarios.insert().values(**admin_data))
        db.commit()
        print(f"[arranque] Admin creado: {correo_admin}")
    except Exception as e:
        print(f"[arranque] Error al crear admin: {e}")
        db.rollback()
    finally:
        db.close()


# ---------------------------------------------------------------------------
# Lifespan
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    crear_tablas()
    crear_primer_admin()
    yield


# ---------------------------------------------------------------------------
# Aplicación FastAPI
# ---------------------------------------------------------------------------

app = FastAPI(
    title="FinancIAl API",
    description="API de Financial Hub con sistema de autenticacion funcional",
    version="2.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4200",
        "http://127.0.0.1:4200",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------

# Datos de mercado
app.include_router(mercado.router)
app.include_router(global_search.router)

# Autenticacion y gestion de usuarios
app.include_router(auth_app.router)
app.include_router(users_app.router)


@app.get("/", tags=["health"])
async def root():
    return {"mensaje": "FinancIAl API activa", "version": "2.1.0"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
