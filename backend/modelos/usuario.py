import enum
import uuid
from datetime import datetime
from sqlalchemy import Table, Column, String, Boolean, DateTime, Enum as SAEnum

# Importar la Base compartida — CRÍTICO: todos los modelos deben usar la MISMA
# instancia de Base para que create_all() las encuentre todas.
from bd.base import Base

class RolUsuario(str, enum.Enum):
    ADMIN = "admin"
    USUARIO = "usuario"

class PlanUsuario(str, enum.Enum):
    GRATIS = "gratis"
    DE_PAGO = "de_pago"

# Definicion de la tabla sin usar clases para el modelo
tabla_usuarios = Table(
    "usuarios",
    Base.metadata,
    Column("id", String(36), primary_key=True, default=lambda: str(uuid.uuid4())),
    Column("correo_electronico", String(255), unique=True, nullable=False, index=True),
    Column("nombre_usuario", String(100), unique=True, nullable=False, index=True),
    Column("contrasena_hasheada", String, nullable=False),
    Column("esta_activo", Boolean, default=True, nullable=False),
    Column("rol", SAEnum(RolUsuario), default=RolUsuario.USUARIO, nullable=False),
    Column("plan", SAEnum(PlanUsuario), default=PlanUsuario.GRATIS, nullable=False),
    Column("creado_en", DateTime, default=datetime.utcnow, nullable=False),
    Column("actualizado_en", DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False),
)
