import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServices } from '../services/auth.services';
import { environment } from '../../environments/environment';

@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = '';
  password = '';
  @Input() registro = false;
  cargando = false;
  error = '';

  constructor(private auth: AuthServices, private router: Router, route: ActivatedRoute) {
    this.registro = route.snapshot.data.registro === true;
  }

  cambiarModo(): void {
    this.registro = !this.registro;
    this.error = '';
    this.password = '';
  }

  async enviar(): Promise<void> {
    if (this.cargando) { return; }
    this.error = '';
    this.cargando = true;
    try {
      if (this.registro) {
        await this.auth.register(this.email, this.password);
      } else {
        await this.auth.loginWithEmail(this.email, this.password);
      }
      this.password = '';
      await this.router.navigate(['/creators']);
    } catch (error) {
      this.error = this.mensajeError(error.code, error.message || '')
        + (error.code ? ' Código: ' + error.code : '');
    } finally {
      this.cargando = false;
    }
  }

  private mensajeError(code: string, detalle: string): string {
    // Older Firebase SDKs wrap newer backend errors in auth/internal-error.
    if (code === 'auth/internal-error' && /\bINVALID_LOGIN_CREDENTIALS\b/.test(detalle)) {
      return 'Correo o contraseña incorrectos. Si aún no tienes cuenta en este proyecto, pulsa “No tengo cuenta: registrarme”.';
    }
    switch (code) {
      case 'auth/internal-error': {
        let motivo = 'Firebase no proporcionó un motivo específico.';
        try {
          const respuesta = JSON.parse(detalle);
          if (respuesta.error && typeof respuesta.error.message === 'string') {
            motivo = respuesta.error.message.substring(0, 240);
          }
        } catch (_) {
          // Keep the generic explanation if the SDK did not supply JSON.
        }
        return 'Firebase no pudo completar el acceso. Detalle: ' + motivo;
      }
      case 'auth/invalid-email': return 'Introduce un correo válido.';
      case 'auth/email-already-in-use': return 'Este correo ya tiene una cuenta. Inicia sesión.';
      case 'auth/weak-password': return 'La contraseña debe tener al menos 6 caracteres.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-login-credentials':
      case 'auth/invalid-credential': return 'Correo o contraseña incorrectos.';
      case 'auth/too-many-requests': return 'Demasiados intentos. Inténtalo más tarde.';
      case 'auth/network-request-failed': return 'Comprueba tu conexión a internet.';
      case 'auth/operation-not-allowed': return 'Firebase rechazó el acceso por correo/contraseña. Comprueba que el proveedor esté habilitado en el proyecto '
        + environment.firebase.projectId + ' y que la configuración web (incluida apiKey) pertenezca a ese mismo proyecto.';
      case 'auth/unauthorized-domain': return 'Autoriza localhost en Firebase Authentication.';
      case 'permission-denied': return 'No se pudo guardar el perfil. Revisa las reglas de Firestore e inicia sesión de nuevo.';
      default: return 'No se pudo completar el acceso. Revisa la configuración de Firebase e inténtalo de nuevo.';
    }
  }
}
