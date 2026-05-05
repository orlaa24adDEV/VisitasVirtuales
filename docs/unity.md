Unity - Visitas Virtuales 360

Build WebGL
El proyecto Unity se exporta como build WebGL y se integra en la web mediante el componente UnityViewer.jsx de React. La build debe estar en la carpeta:
visitas-virtuales/public/Build_Unity/
Para actualizar la build:
1. Abrir el proyecto en Unity 2022.3.62f3
2. File → Build Settings → WebGL
3. Add Open Scenes (seleccionar la escena del centro)
4. Build → carpeta destino Build_Unity
5. Copiar los 4 archivos generados a public/Build_Unity/Build/
   - Build_Unity.data
   - Build_Unity.framework.js
   - Build_Unity.loader.js
   - Build_Unity.wasm
 Mantener siempre el nombre "Build_Unity" para no romper las rutas del frontend.

Scripts C#

JsonLoader.cs
Ubicación: Assets/Scripts/JsonLoader.cs
Script principal encargado de obtener los POIs de cada centro desde la API REST y mostrarlos en la interfaz de Unity.
Flujo de funcionamiento:
1. Lee el ID del centro desde el WebBridge
2. Hace login en la API para obtener un token JWT
3. Usa el token para pedir los POIs del centro
4. Muestra los POIs en los textos TMP de la escena
5. Repite la petición cada 30 segundos
Decisiones técnicas:

Usa UnityWebRequest en lugar de File.ReadAllText porque WebGL no permite acceso directo al sistema de ficheros
Autenticación JWT automática con renovación del token si expira
Refresco cada 30 segundos configurable desde el Inspector

Métodos principales:
MétodoDescripciónStart()Comprueba el WebBridge y arranca la conexiónLogin()POST a /api/v1/users/auth, guarda el tokenActualizarJson()Bucle de refresco cada 30 segundosObtenerPoisDesdeAPI()GET a /api/v1/centers/{id}/pois con el token
Clases de datos:
TokenResponse  → accessToken del login
PoiDetails     → descripción del POI
Poi            → POI completo (id, name, details)
PoiWrapper     → wrapper del array de POIs

WebBridge.cs

Ubicación: Assets/Scripts/WebBridge.cs

Puente de comunicación entre la web (React) y Unity. Recibe el ID del centro y la escena desde JavaScript y gestiona el fullscreen.
Flujo de funcionamiento:
1. La web envía RecibirIdCentro(id) via SendMessage
2. La web envía RecibirIdEscena(id) via SendMessage
3. Cuando tiene los dos IDs carga la escena
4. El JsonLoader lee el ID del centro desde aquí
Métodos principales:
MétodoDescripciónRecibirIdCentro(string)Recibe el ID del centro desde la webRecibirIdEscena(string)Recibe el ID de la escena desde la webTryLoadScene()Carga la escena cuando tiene los dos IDstoggleFullScreen()Alterna fullscreen adaptado a WebGL y Editor

Puente JavaScript ↔ Unity

Fullscreen.jslib
Ubicación: Assets/Plugins/WebGL/Fullscreen.jslib
Plugin JavaScript necesario para activar el fullscreen nativo del navegador. Los navegadores bloquean el fullscreen si no viene de JavaScript directamente.
javascriptmergeInto(LibraryManager.library, {
    ToggleFullscreenJS: function() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
});

Comunicación web → Unity

Desde React se usa SendMessage para enviar datos a Unity:
javascriptunityInstance.SendMessage('WebBridge', 'RecibirIdCentro', centerId.toString());
unityInstance.SendMessage('WebBridge', 'RecibirIdEscena', sceneId.toString());

Control de versiones

El proyecto Unity se gestiona con Plastic SCM integrado en el editor.

Para sincronizar cambios:
Window → Unity Version Control → Update workspace
Los scripts C# también se versionan en Git en el repositorio principal del proyecto para coordinación con el equipo de DAW y DAM.