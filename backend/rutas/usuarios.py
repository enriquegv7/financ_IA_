from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from nucleo.dependencias import requiere_admin
from bd.sesion import obtener_db
from modelos.usuario import tabla_usuarios, RolUsuario, PlanUsuario
from esquemas.usuario import UsuarioRespuesta, UsuarioActualizacion

router = APIRouter(prefix="/api/usuarios", tags=["usuarios (admin)"])


@router.get(
    "/",
    response_model=List[UsuarioRespuesta],
    summary="Listar usuarios (solo admin)",
)
def listar_usuarios(
    rol: Optional[RolUsuario] = Query(default=None, description="Filtrar por rol"),
    plan: Optional[PlanUsuario] = Query(default=None, description="Filtrar por plan"),
    db: Session = Depends(obtener_db),
    _admin: dict = Depends(requiere_admin),
):
    """
    Devuelve todos los usuarios, incluyendo los desactivados.
    """
    consulta = db.query(tabla_usuarios)
    if rol:
        consulta = consulta.filter(tabla_usuarios.c.rol == rol)
    if plan:
        consulta = consulta.filter(tabla_usuarios.c.plan == plan)
    
    resultados = consulta.all()
    # Convertir Rows a dicts
    return [dict(r._mapping) for r in resultados]


@router.get(
    "/{id_usuario}",
    response_model=UsuarioRespuesta,
    summary="Obtener usuario por ID (solo admin)",
)
def obtener_usuario(
    id_usuario: str,
    db: Session = Depends(obtener_db),
    _admin: dict = Depends(requiere_admin),
):
    """Devuelve los datos de un usuario específico por su UUID."""
    usuario = db.query(tabla_usuarios).filter(tabla_usuarios.c.id == id_usuario).first()
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado",
        )
    return dict(usuario._mapping)


@router.patch(
    "/{id_usuario}",
    response_model=UsuarioRespuesta,
    summary="Actualizar rol o plan (solo admin)",
)
def actualizar_usuario(
    id_usuario: str,
    datos: UsuarioActualizacion,
    db: Session = Depends(obtener_db),
    _admin: dict = Depends(requiere_admin),
):
    """
    Permite al admin cambiar el rol y/o plan de un usuario.
    """
    usuario = db.query(tabla_usuarios).filter(tabla_usuarios.c.id == id_usuario).first()
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado",
        )

    campos_actualizar = {}
    if datos.get("rol") is not None:
        campos_actualizar["rol"] = datos["rol"]
    if datos.get("plan") is not None:
        campos_actualizar["plan"] = datos["plan"]

    if campos_actualizar:
        campos_actualizar["actualizado_en"] = datetime.utcnow()
        db.execute(
            tabla_usuarios.update().where(tabla_usuarios.c.id == id_usuario).values(**campos_actualizar)
        )
        db.commit()

    # Recuperar actualizado
    usuario_actualizado = db.query(tabla_usuarios).filter(tabla_usuarios.c.id == id_usuario).first()
    return dict(usuario_actualizado._mapping)


@router.delete(
    "/{id_usuario}",
    response_model=UsuarioRespuesta,
    summary="Desactivar usuario (solo admin)",
)
def desactivar_usuario(
    id_usuario: str,
    db: Session = Depends(obtener_db),
    _admin: dict = Depends(requiere_admin),
):
    """
    Soft-delete: marca esta_activo=False.
    """
    usuario = db.query(tabla_usuarios).filter(tabla_usuarios.c.id == id_usuario).first()
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado",
        )
    if not usuario.esta_activo:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El usuario ya está desactivado",
        )

    db.execute(
        tabla_usuarios.update().where(tabla_usuarios.c.id == id_usuario).values(
            esta_activo=False,
            actualizado_en=datetime.utcnow()
        )
    )
    db.commit()
    
    usuario_actualizado = db.query(tabla_usuarios).filter(tabla_usuarios.c.id == id_usuario).first()
    return dict(usuario_actualizado._mapping)
