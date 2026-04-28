using UnityEngine;
using UnityEngine.SceneManagement;

public class WebBridge : MonoBehaviour
{
    // Variables estáticas: persisten entre cambios de escena (son de clase, no de instancia)
    // Cualquier otro script puede leerlas con WebBridge.IdCentroActual
    public static string IdCentroActual { get; private set; } = "";
    public static string IdEscenaActual { get; private set; } = "";

    // Flags para saber qué IDs ya llegaron
    private bool _centroRecibido = false;
    private bool _escenaRecibida = false;

    // Control de pantalla completa
    // Guarda el estado actual de la pantalla completa
    private bool isFullScreen = false;

    // Enlace con la función JavaScript del archivo Fullscreen.jslib
    // Solo se usa en WebGL, en el Editor se usa Screen.fullScreen
    [System.Runtime.InteropServices.DllImport("__Internal")]
    private static extern void ToggleFullscreenJS();

    public void toggleFullScreen()
{
    isFullScreen = !isFullScreen;
    Debug.Log("[WebBridge] toggleFullScreen llamado: " + isFullScreen);

    #if UNITY_WEBGL && !UNITY_EDITOR
        Debug.Log("[WebBridge] Llamando a ToggleFullscreenJS...");
        ToggleFullscreenJS();
    #else
        Screen.fullScreen = isFullScreen;
    #endif
}

    // Activa la pantalla completa directamente
    public void fullScreen()
    {
        Screen.fullScreen = true;
    }

    // JavaScript llama a este método primero
    public void RecibirIdCentro(string idCentro)
    {
        IdCentroActual = idCentro;
        _centroRecibido = true;
        Debug.Log("[WebBridge] ID de centro recibido: " + idCentro);

        TryLoadScene();
    }

    // JavaScript llama a este método segundo
    public void RecibirIdEscena(string idEscena)
    {
        IdEscenaActual = idEscena;
        _escenaRecibida = true;
        Debug.Log("[WebBridge] ID de escena recibido: " + idEscena);

        TryLoadScene();
    }

    // Carga la escena solo cuando han llegado los dos IDs
    private void TryLoadScene()
    {
        if (!_centroRecibido || !_escenaRecibida)
        {
            Debug.Log("[WebBridge] Esperando el segundo ID antes de cargar escena...");
            return;
        }

        if (!int.TryParse(IdEscenaActual, out int sceneIndex))
        {
            Debug.LogWarning("[WebBridge] ID de escena inválido: " + IdEscenaActual);
            return;
        }

        Debug.Log($"[WebBridge] Cargando escena {sceneIndex} para centro {IdCentroActual}");
        SceneManager.LoadScene(sceneIndex);
    }
}