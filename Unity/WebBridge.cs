using UnityEngine;

public class WebBridge : MonoBehaviour
{
    // Variable estática: cualquier otro script puede leer el ID 
    // con WebBridge.IdCentroActual sin necesitar referencia al objeto
    public static string IdCentroActual { get; private set; }

    //ID de la escena seleccionada, lo dejamos en 'null' no recibe escena desde la web
    //Unity usará la escena inicual del build por defecto
    public static string IdEscenaActual {get; private set; } = null; 

    // Este método lo llama JavaScript con SendMessage
    public void RecibirIdCentro(string idCentro)
    {
        IdCentroActual = idCentro;
        Debug.Log("[WebBridge] ID de centro recibido: " + idCentro);
    }

    //JavaScript llama a este método para enviar el ID de la escena
    //TODO: pendiente confirmar el índice de cada escena por centro
    public void RecibirIdEscena(string idEscena)
    {
        IdEscenaActual = idEscena;
        Debug.Log("[WebBridge] ID de escena recibido: " + idEscena);
    }
}