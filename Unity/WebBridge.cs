using UnityEngine;

public class WebBridge : MonoBehaviour
{
    // Variable estática: cualquier otro script puede leer el ID 
    // con WebBridge.IdCentroActual sin necesitar referencia al objeto
    public static string IdCentroActual { get; private set; }

    // Este método lo llama JavaScript con SendMessage
    // IMPORTANTE: tiene que ser público y no estático
    public void RecibirIdCentro(string idCentro)
    {
        IdCentroActual = idCentro;
        Debug.Log("[WebBridge] ID de centro recibido: " + idCentro);
    }
}