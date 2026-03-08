from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from bd.sesion import obtener_db
from nucleo.seguridad import decodificar_token
from modelos.usuario import tabla_usuarios, RolUsuario, PlanUsuario

esquema_bearer = HTTPBearer()


def obtener_usuario_actual(
    credenciales: HTTPAuthorizationCredentials = Depends(esquema_bearer),
    db: Session = Depends(obtener_db),
) -> dict:
    """
    Valida el JWT y devuelve el usuario activo como un diccionario.
    """
    token = credenciales.credentials
    carga_util = decodificar_token(token)

    if carga_util is None or carga_util.get("tipo") != "acceso":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )

    id_usuario: str = carga_util.get("sub")
    if id_usuario is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token mal formado",
        )

    # Consulta usando el objeto Table
    usuario = db.query(tabla_usuarios).filter(
        tabla_usuarios.c.id == id_usuario, 
        tabla_usuarios.c.esta_activo == True
    ).first()
    
    if usuario is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado o desactivado",
        )

    # Convertir Row a dict para consistencia funcional
    return dict(usuario._mapping)


def requiere_admin(usuario_actual: dict = Depends(obtener_usuario_actual)) -> dict:
    """
    Garantiza que el usuario autenticado es administrador.
    """
    if usuario_actual["rol"] != RolUsuario.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acceso restringido a administradores",
        )
    return usuario_actual


def requiere_pago(usuario_actual: dict = Depends(obtener_usuario_actual)) -> dict:
    """
    Garantiza que el usuario tiene plan de pago o es admin.
    """
    if usuario_actual["plan"] != PlanUsuario.DE_PAGO and usuario_actual["rol"] != RolUsuario.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Esta función está disponible solo para usuarios con plan de pago",
        )
    return usuario_actual


# Alias semántico
requiere_autenticacion = obtener_usuario_actual
