import sys
import os

# Añadir el directorio backend al path
directorio_backend = r"c:\Users\enriq\proyectos enrique\financ_IA_\backend"
sys.path.append(directorio_backend)

# Configurar variables de entorno para la prueba
os.environ["DATABASE_URL"] = "sqlite:///./test_auth.db"

from sqlalchemy.orm import Session
from bd.sesion import SesionLocal, motor
from bd.base import Base
from rutas import autenticacion, usuarios
from esquemas.usuario import UsuarioRegistro, UsuarioLogin

def limpiar_bd():
    Base.metadata.drop_all(bind=motor)
    Base.metadata.create_all(bind=motor)

def probar_flujo_autenticacion():
    db = SesionLocal()
    try:
        print("1. Probando REGISTRO...")
        datos_registro = {
            "correo_electronico": "test@ejemplo.com",
            "nombre_usuario": "testuser",
            "contrasena": "password123"
        }
        res_registro = autenticacion.registro(datos_registro, db)
        assert res_registro["correo_electronico"] == "test@ejemplo.com"
        assert res_registro["nombre_usuario"] == "testuser"
        print("   - Registro: OK")

        print("2. Probando LOGIN...")
        datos_login = {
            "correo_electronico": "test@ejemplo.com",
            "contrasena": "password123"
        }
        res_login = autenticacion.login(datos_login, db)
        assert "token_acceso" in res_login
        assert "token_refrefresco" not in res_login # Es token_refresco en mi schema? Ah, espera.
        # Check schema: RespuestaToken has token_refresco
        assert "token_refresco" in res_login
        print("   - Login: OK")

        print("3. Probando PERFIL (simulado)...")
        # Simular dependencia de obtener_perfil
        perfil = autenticacion.obtener_perfil(res_registro)
        assert perfil["nombre_usuario"] == "testuser"
        print("   - Perfil: OK")

    except Exception as e:
        print(f"Error en la prueba: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    limpiar_bd()
    probar_flujo_autenticacion()
    print("\n¡FLUJO DE AUTENTICACION VERIFICADO CORRECTAMENTE!")
    # Limpiar archivo de prueba
    if os.path.exists("./test_auth.db"):
        os.remove("./test_auth.db")
