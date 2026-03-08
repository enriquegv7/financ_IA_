from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from nucleo.configuracion import configuracion

# connect_args={"check_same_thread": False} es necesario para SQLite con FastAPI
motor = create_engine(
    configuracion["URL_BASE_DATOS"],
    connect_args={"check_same_thread": False},
)

SesionLocal = sessionmaker(autocommit=False, autoflush=False, bind=motor)


def obtener_db():
    """
    Generador que abre una sesión de BD por request y la cierra al terminar.
    Uso como dependencia: db: Session = Depends(obtener_db)
    """
    db = SesionLocal()
    try:
        yield db
    finally:
        db.close()
