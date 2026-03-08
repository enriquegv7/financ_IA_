import os
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

# Configuracion global como un diccionario para evitar el uso de clases
configuracion = {
    # JWT
    "CLAVE_SECRETA": os.getenv("SECRET_KEY", "dev-secret-key-change-in-production-please"),
    "ALGORITMO": os.getenv("ALGORITHM", "HS256"),
    "MINUTOS_EXPIRACION_ACCESO": int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30)),
    "DIAS_EXPIRACION_REFRESCO": int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7)),

    # Base de datos
    "URL_BASE_DATOS": os.getenv("DATABASE_URL", "sqlite:///./aplicacion.db"),

    # Usuario administrador inicial
    "PRIMER_ADMIN_CORREO": os.getenv("FIRST_ADMIN_EMAIL"),
    "PRIMER_ADMIN_CONTRASENA": os.getenv("FIRST_ADMIN_PASSWORD"),
    "PRIMER_ADMIN_USUARIO": os.getenv("FIRST_ADMIN_USERNAME", "admin"),
}
