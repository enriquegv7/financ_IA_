from datetime import datetime, timedelta
from typing import Optional

import bcrypt
from jose import JWTError, jwt

from nucleo.configuracion import configuracion

# Usamos bcrypt directamente para evitar la incompatibilidad entre
# passlib <= 1.7.4 y bcrypt >= 4.0.0 (detect_wrap_bug falla con bcrypt 4.x)


def hashear_contrasena(contrasena: str) -> str:
    """Devuelve el hash bcrypt de la contraseña en texto plano."""
    return bcrypt.hashpw(contrasena.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verificar_contrasena(contrasena_plana: str, contrasena_hasheada: str) -> bool:
    """Compara la contraseña en texto plano con el hash almacenado."""
    return bcrypt.checkpw(
        contrasena_plana.encode("utf-8"),
        contrasena_hasheada.encode("utf-8"),
    )


def crear_token_acceso(datos: dict, delta_expiracion: Optional[timedelta] = None) -> str:
    """
    Genera un token de acceso JWT con expiración corta.
    """
    para_codificar = datos.copy()
    expiracion = datetime.utcnow() + (
        delta_expiracion or timedelta(minutes=configuracion["MINUTOS_EXPIRACION_ACCESO"])
    )
    para_codificar.update({"exp": expiracion, "tipo": "acceso"})
    return jwt.encode(para_codificar, configuracion["CLAVE_SECRETA"], algorithm=configuracion["ALGORITMO"])


def crear_token_refresco(datos: dict) -> str:
    """
    Genera un token de refresco JWT con expiración larga.
    """
    para_codificar = datos.copy()
    expiracion = datetime.utcnow() + timedelta(days=configuracion["DIAS_EXPIRACION_REFRESCO"])
    para_codificar.update({"exp": expiracion, "tipo": "refresco"})
    return jwt.encode(para_codificar, configuracion["CLAVE_SECRETA"], algorithm=configuracion["ALGORITMO"])


def decodificar_token(token: str) -> Optional[dict]:
    """
    Decodifica y valida un JWT.
    """
    try:
        carga_util = jwt.decode(token, configuracion["CLAVE_SECRETA"], algorithms=[configuracion["ALGORITMO"]])
        return carga_util
    except JWTError:
        return None
