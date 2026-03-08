from sqlalchemy.orm import declarative_base

# Base de la que heredan todos los metadatos de SQLAlchemy.
# No se usaran clases para modelos, solo para el metadato Base.
Base = declarative_base()
