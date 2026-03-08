import os
import sys
from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool
from alembic import context

# Añadir el directorio backend/ al path para importar los módulos de la app
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Importar la configuración y la Base para que Alembic detecte los modelos
from app.core.config import settings
from app.db.base import Base
import app.models.user  # noqa: F401 — registra el modelo en Base.metadata

# Configuración de Alembic desde alembic.ini
config = context.config

# Usar la DATABASE_URL del .env en lugar del valor en alembic.ini
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

# Configurar logging si hay un archivo de configuración
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Metadata de todos los modelos — Alembic la usa para generar migraciones
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """
    Modo offline: genera SQL sin conectarse a la BD.
    Útil para revisar los cambios antes de aplicarlos.
    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """
    Modo online: se conecta a la BD y aplica los cambios directamente.
    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
