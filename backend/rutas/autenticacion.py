import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from nucleo.dependencias import requiere_autenticacion
from nucleo.seguridad import (
    crear_token_acceso,
    crear_token_refresco,
    decodificar_token,
    hashear_contrasena,
    verificar_contrasena,
)
from bd.sesion import obtener_db
from modelos.usuario import tabla_usuarios
from esquemas.usuario import (
    SolicitudRefresco,
    RespuestaToken,
    UsuarioLogin,
    UsuarioRegistro,
    UsuarioRespuesta,
)

router = APIRouter(prefix="/api/autenticacion", tags=["autenticacion"])


@router.post(
    "/registro",
    response_model=UsuarioRespuesta,
    status_code=status.HTTP_201_CREATED,
    summary="Registrar nuevo usuario",
)
def registro(datos: UsuarioRegistro, db: Session = Depends(obtener_db)):
    """
    Crea una cuenta nueva con rol=usuario y plan=gratis por defecto.
    """
    # Consulta usando el objeto Table
    if db.query(tabla_usuarios).filter(tabla_usuarios.c.correo_electronico == datos["correo_electronico"]).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El correo electrónico ya está registrado",
        )
    if db.query(tabla_usuarios).filter(tabla_usuarios.c.nombre_usuario == datos["nombre_usuario"]).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El nombre de usuario ya está en uso",
        )

    id_nuevo = str(uuid.uuid4())
    # Insercion usando Core/Table style (pero a traves de la sesion para mantener transaccionalidad)
    nuevo_usuario_data = {
        "id": id_nuevo,
        "correo_electronico": datos["correo_electronico"],
        "nombre_usuario": datos["nombre_usuario"],
        "contrasena_hasheada": hashear_contrasena(datos["contrasena"]),
        "creado_en": datetime.utcnow(),
        "actualizado_en": datetime.utcnow(),
    }
    
    db.execute(tabla_usuarios.insert().values(**nuevo_usuario_data))
    db.commit()
    
    # Recuperar el usuario insertado
    usuario = db.query(tabla_usuarios).filter(tabla_usuarios.c.id == id_nuevo).first()
    return dict(usuario._mapping)


@router.post("/login", response_model=RespuestaToken, summary="Iniciar sesión")
def login(datos: UsuarioLogin, db: Session = Depends(obtener_db)):
    """
    Autentica al usuario con correo + contraseña.
    """
    usuario = db.query(tabla_usuarios).filter(tabla_usuarios.c.correo_electronico == datos["correo_electronico"]).first()

    if not usuario or not verificar_contrasena(datos["contrasena"], usuario.contrasena_hasheada):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas",
        )
    
    if not usuario.esta_activo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Esta cuenta ha sido desactivada",
        )

    datos_token = {"sub": usuario.id}
    return {
        "token_acceso": crear_token_acceso(datos_token),
        "token_refresco": crear_token_refresco(datos_token),
        "tipo_token": "bearer",
    }


@router.post("/refrescar", response_model=RespuestaToken, summary="Renovar tokens")
def refrescar(datos: SolicitudRefresco, db: Session = Depends(obtener_db)):
    """
    Renueva el token de acceso usando un token de refresco válido.
    """
    carga_util = decodificar_token(datos["token_refresco"])

    if carga_util is None or carga_util.get("tipo") != "refresco":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de refresco inválido o expirado",
        )

    id_usuario = carga_util.get("sub")
    usuario = db.query(tabla_usuarios).filter(
        tabla_usuarios.c.id == id_usuario, 
        tabla_usuarios.c.esta_activo == True
    ).first()
    
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado",
        )

    datos_token = {"sub": usuario.id}
    return {
        "token_acceso": crear_token_acceso(datos_token),
        "token_refresco": crear_token_refresco(datos_token),
        "tipo_token": "bearer",
    }


@router.get("/perfil", response_model=UsuarioRespuesta, summary="Perfil del usuario autenticado")
def obtener_perfil(usuario_actual: dict = Depends(requiere_autenticacion)):
    """
    Devuelve los datos del usuario autenticado.
    """
    return usuario_actual
