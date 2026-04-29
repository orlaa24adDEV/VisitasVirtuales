using System.Collections;
using UnityEngine;
using UnityEngine.Networking;
using TMPro;

public class JsonLoader : MonoBehaviour
{
    [Header("Configuración del Centro")]
    [SerializeField] private int idCentro = 1; // <- ID numérico del centro, se cambia en el Inspector por cada escena

    [Header("Textos UI")]
    public TMP_Text[] textos;

    [Header("Ajustes")]
    [SerializeField] private float tiempoActualizacion = 30f; // Refresco cada 30 segundos para no sobrecargar el servidor

    // URL base de la API donde está desplegado el servidor
    private const string API_BASE_URL = "https://visitasvirtuales.dedyn.io";

    // Credenciales para obtener el token de acceso
    private const string EMAIL = "admin_mad@instituto.es";
    private const string PASSWORD = "Admin123!";

    // Token JWT que obtenemos al hacer login
    // Lo guardamos para reutilizarlo en cada petición
    private string accessToken = "";

    void Start()
    {
        // Antes de pedir POIs, revisa WebBridge recibio un ID desde la web, si lo tiene usa ese.
        // Si no lo tiene sigue usando el número que está en el inspector
        if (!string.IsNullOrEmpty(WebBridge.IdCentroActual) 
            && int.TryParse(WebBridge.IdCentroActual, out int idDesdeWeb))
        {
            idCentro = idDesdeWeb;
            Debug.Log($"[JsonLoader] Usando ID de centro desde WebBridge: {idCentro}");
        }
        else
        {
            Debug.LogWarning($"[JsonLoader] WebBridge sin ID, usando valor del Inspector: {idCentro}");
        }

        // Primero hacemos login para obtener el token
        // y cuando lo tengamos empezamos a pedir los POIs
        StartCoroutine(IniciarConexion());
    }

    IEnumerator IniciarConexion()
    {
        // Login para obtener el token
        yield return StartCoroutine(Login());

        // Si tenemos token arrancamos el bucle de actualización
        if (!string.IsNullOrEmpty(accessToken))
        {
            Debug.Log("[JsonLoader] Login correcto, iniciando carga de POIs...");
            StartCoroutine(ActualizarJson());
        }
        else
        {
            Debug.LogWarning("[JsonLoader] No se pudo obtener el token, verifica las credenciales.");
        }
    }

    IEnumerator Login()
    {
        // Endpoint de login según la documentación de la API
        string url = $"{API_BASE_URL}/api/v1/users/auth";

        // Construimos el cuerpo de la petición con las credenciales
        string bodyJson = $"{{\"email\":\"{EMAIL}\",\"password\":\"{PASSWORD}\"}}";

        using (UnityWebRequest www = new UnityWebRequest(url, "POST"))
        {
            // Convertimos el JSON a bytes para enviarlo
            byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(bodyJson);
            www.uploadHandler = new UploadHandlerRaw(bodyRaw);
            www.downloadHandler = new DownloadHandlerBuffer();

            // Le decimos a la API que mandamos JSON
            www.SetRequestHeader("Content-Type", "application/json");

            yield return www.SendWebRequest();

            if (www.result != UnityWebRequest.Result.Success)
            {
                Debug.LogWarning($"[JsonLoader] Error en login: {www.error}");
                yield break;
            }

            // Deserializamos la respuesta para obtener el accessToken
            string json = www.downloadHandler.text;
            TokenResponse tokenResponse = JsonUtility.FromJson<TokenResponse>(json);

            if (tokenResponse != null && !string.IsNullOrEmpty(tokenResponse.accessToken))
            {
                accessToken = tokenResponse.accessToken;
                Debug.Log("[JsonLoader] Token obtenido correctamente.");
            }
            else
            {
                Debug.LogWarning("[JsonLoader] La respuesta del login no contiene token.");
            }
        }
    }

    IEnumerator ActualizarJson()
    {
        while (true)
        {
            yield return StartCoroutine(ObtenerPoisDesdeAPI());
            yield return new WaitForSeconds(tiempoActualizacion);
        }
    }

    IEnumerator ObtenerPoisDesdeAPI()
    {
        // Construimos la URL con el id numérico del centro
        string url = $"{API_BASE_URL}/api/v1/centers/{idCentro}/pois";

        using (UnityWebRequest www = UnityWebRequest.Get(url))
        {
            // Añadimos el token JWT en el header de autorización
            www.SetRequestHeader("Authorization", $"Bearer {accessToken}");

            yield return www.SendWebRequest();

            // Si el token ha expirado, hacemos login de nuevo automáticamente
            if (www.responseCode == 403)
            {
                Debug.LogWarning("[JsonLoader] Token expirado, renovando...");
                yield return StartCoroutine(Login());
                yield break;
            }

            if (www.result != UnityWebRequest.Result.Success)
            {
                Debug.LogWarning($"[JsonLoader] Error obteniendo POIs: {www.error}");
                yield break;
            }

            string json = www.downloadHandler.text;

            // La API devuelve un objeto con dos propiedades: message y pois
            // JsonUtility mapea directamente el JSON al PoiWrapper sin necesidad de manipularlo
            PoiWrapper data = JsonUtility.FromJson<PoiWrapper>(json);

            if (data == null || data.pois == null || data.pois.Length == 0)
            {
                Debug.LogWarning($"[JsonLoader] No se encontraron POIs para el centro: {idCentro}");
                yield break;
            }

            // Actualizamos los textos con los POIs recibidos de la API
            for (int i = 0; i < textos.Length && i < data.pois.Length; i++)
            {
                textos[i].text = $"<b>{data.pois[i].name}</b>\n<size=80%>{data.pois[i].details.description}</size>";
            }

            Debug.Log($"[JsonLoader] Centro {idCentro} cargado con {data.pois.Length} POIs.");
        }
    }
}

// --- Clases de datos que reflejan la respuesta de la API ---

// Respuesta del endpoint de login
[System.Serializable]
public class TokenResponse
{
    public string accessToken;
}

// El campo details de cada POI contiene la descripción
[System.Serializable]
public class PoiDetails
{
    public string description;
}

// Un POI tal como lo devuelve la API
[System.Serializable]
public class Poi
{
    public int id;
    public string name;
    public PoiDetails details;
    public int centerId;
    public int userId;
}

// Wrapper necesario porque JsonUtility no lee arrays directamente en la raíz
[System.Serializable]
public class PoiWrapper
{
    public string message;
    public Poi[] pois;
}