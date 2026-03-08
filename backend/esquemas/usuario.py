from datetime import datetime
from typing import Optional, List
from typing_extensions import TypedDict

# Schemas de entrada (Solicitudes)
UsuarioRegistro = TypedDict('UsuarioRegistro', {
    'correo_electronico': str,
    'nombre_usuario': str,
    'contrasena': str,
})

UsuarioLogin = TypedDict('UsuarioLogin', {
    'correo_electronico': str,
    'contrasena': str,
})

UsuarioActualizacion = TypedDict('UsuarioActualizacion', {
    'rol': Optional[str],
    'plan': Optional[str],
})

SolicitudRefresco = TypedDict('SolicitudRefresco', {
    'token_refresco': str,
})

# Schemas de salida (Respuestas)
UsuarioRespuesta = TypedDict('UsuarioRespuesta', {
    'id': str,
    'correo_electronico': str,
    'nombre_usuario': str,
    'esta_activo': bool,
    'rol': str,
    'plan': str,
    'creado_en': datetime,
    'actualizado_en': datetime,
})

RespuestaToken = TypedDict('RespuestaToken', {
    'token_acceso': str,
    'token_refresco': str,
    'tipo_token': str,
})
