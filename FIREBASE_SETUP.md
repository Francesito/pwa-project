# Login con Firebase

1. En el proyecto Firebase indicado en `src/environments/environment.ts`, activa Authentication → Proveedores → Correo/Contraseña.
2. En Authentication → Configuración → Dominios autorizados, añade `localhost` si falta.
3. Crea una base de datos Cloud Firestore (la predeterminada).
4. Revisa `firestore.rules` y publica sus reglas desde la pestaña Reglas de Firestore. Si ya tienes otras colecciones, integra estas reglas conservando las que necesites. No se han publicado automáticamente.
5. Abre http://localhost:4200/login, pulsa “No tengo cuenta: registrarme” y crea una cuenta. El perfil se guarda en `users/{uid}`; la contraseña solo se envía a Authentication.
6. Tras entrar, se abre `/creators`. Puedes cerrar sesión desde el botón «Cerrar sesión» de la barra superior. Si el perfil no se pudo guardar tras crear la cuenta, corrige las reglas y usa Iniciar sesión con la misma cuenta; no necesitas registrarla otra vez.

## Clave de servicio opcional

Este login usa el SDK web y NO necesita `firebase-admin` ni una clave de servicio.
Si más adelante necesitas Admin SDK en un servidor, guarda la clave en:
`secrets/serviceAccountKey.json` (en la raíz del proyecto).
La carpeta está excluida de Git y no está entre los assets de Angular.
No importes esta clave en `src/`, no la pongas en `src/assets/` ni en los archivos environment.
El fragmento `admin.initializeApp(...)` solo debe ejecutarse en Node.js, en el servidor, nunca en un componente Angular.

La autenticación y las escrituras reales requieren habilitar los servicios y publicar las reglas en tu consola Firebase. No se han probado con una cuenta real desde este entorno.

## Listas

En `/creators`, escribe un título y, opcionalmente, un elemento por línea.
Las listas se guardan en `users/{uid}/lists/{listId}` con título, elementos y fecha del servidor.
La pantalla muestra los cambios de Firestore en tiempo real y permite eliminar listas.
Cada usuario accede únicamente a sus listas mediante las reglas incluidas.
La ruta `/registro` abre el formulario de creación de cuenta.
