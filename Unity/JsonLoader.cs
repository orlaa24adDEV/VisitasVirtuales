using System.Collections;
using UnityEngine;
using TMPro;
using System.IO;

public class JsonLoader : MonoBehaviour
{
    [Header("Configuración del Centro")]
    [SerializeField] private string idCentro = "centro-1"; // <- Esto se cambia en el Inspector por cada centro y por cada centro pones una escena

    [Header("Textos UI")]
    public TMP_Text[] textos;

    [Header("Ajustes")]
    [SerializeField] private float tiempoActualizacion = 2f;  //Velocidad para cambiar el texto del .json

    private string ultimaVersion = "";

    void Start()
    {
        StartCoroutine(ActualizarJson());
    }

    IEnumerator ActualizarJson()
    {
        while (true)
        {
            LeerJson();
            yield return new WaitForSeconds(tiempoActualizacion);
        }
    }

    void LeerJson()
    {
        string path = Path.Combine(Application.streamingAssetsPath, "pois.json");

        if (!File.Exists(path))
        {
            Debug.LogWarning($"[JsonLoader] No se encontró el JSON en: {path}");
            return;
        }

        try
        {using System.Collections;
using UnityEngine;
using System.IO;
using UnityEngine.Networking;
using TMPro;

public class JsonLoader : MonoBehaviour
{
    [Header("Configuración del Centro")]
    [SerializeField] private string idCentro = "center-1"; // <- Esto se cambia en el Inspector por cada centro y por cada centro pones una escena

    [Header("Textos UI")]
    public TMP_Text[] textos;

    [Header("Ajustes")]
    [SerializeField] private float tiempoActualizacion = 2f; // Velocidad para cambiar el texto del .json

    private string ultimaVersion = "";

    void Start()
    {
        StartCoroutine(ActualizarJson());
    }

    IEnumerator ActualizarJson()
    {
        while (true)
        {
            yield return StartCoroutine(LeerJsonWebGL());
            yield return new WaitForSeconds(tiempoActualizacion);
        }
    }

    IEnumerator LeerJsonWebGL()
    {
        string path = Path.Combine(Application.streamingAssetsPath, "pois.json");

        using (UnityWebRequest www = UnityWebRequest.Get(path))
        {
            yield return www.SendWebRequest();

            if (www.result != UnityWebRequest.Result.Success)
            {
                Debug.LogWarning($"[JsonLoader] Error cargando JSON: {www.error}");
                yield break;
            }

            string json = www.downloadHandler.text;

            // Si el JSON no ha cambiado, no hacemos nada
            if (json == ultimaVersion) yield break;
            ultimaVersion = json;

            
            CentroList data = JsonUtility.FromJson<CentroList>(json);

            // Buscamos el centro que coincide con nuestro idCentro
            Centro centroActual = null;
            foreach (var centro in data.CENTERS)
            {
                if (centro.centerId == idCentro)
                {
                    centroActual = centro;
                    break;
                }
            }

            if (centroActual == null)
            {
                Debug.LogWarning($"[JsonLoader] No se encontró el centro con id: {idCentro}");
                yield break;
            }

            // Actualizamos los textos con los POIs del centro encontrado
            for (int i = 0; i < textos.Length && i < centroActual.POIs.Length; i++)
            {
                textos[i].text = $"<b>{centroActual.POIs[i].name}</b>\n<size=80%>{centroActual.POIs[i].description}</size>";
            }

            Debug.Log($"[JsonLoader] Centro '{centroActual.centerName}' cargado con {centroActual.POIs.Length} POIs.");
        }
    }
}

// --- Clases de datos que reflejan la estructura del JSON ---

[System.Serializable]
public class LocPoi
{
    public float x;
    public float y;
    public float z;
}

[System.Serializable]
public class Poi
{
    public int id; 
    public string name;
    public string description;
    public LocPoi loc_poi;
}

[System.Serializable]
public class Centro
{
    public string centerId; 
    public string centerName; 
    public string centerDescription; 
    public Poi[] POIs;
}

[System.Serializable]
public class CentroList
{
    public Centro[] CENTERS; 
}
