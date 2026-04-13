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
        {
            string json = File.ReadAllText(path);

            // Si el JSON no ha cambiado, no hacemos nada
            if (json == ultimaVersion) return;
            ultimaVersion = json;

            // Deserializamos toda la estructura
            CentroList data = JsonUtility.FromJson<CentroList>(json);

            // Buscamos el centro que coincide con nuestro idCentro
            Centro centroActual = null;
            foreach (var centro in data.CENTROS)
            {
                if (centro.id_centro == idCentro)
                {
                    centroActual = centro;
                    break;
                }
            }

            if (centroActual == null)
            {
                Debug.LogWarning($"[JsonLoader] No se encontró el centro con id: {idCentro}");
                return;
            }

            // Actualiza los textos con los POIs del centro encontrado
            for (int i = 0; i < textos.Length && i < centroActual.POIs.Length; i++)
            {
                textos[i].text = $"<b>{centroActual.POIs[i].nombre_poi}</b>\n<size=80%>{centroActual.POIs[i].descripcion_poi}</size>";

            }

            Debug.Log($"[JsonLoader] Centro '{centroActual.nombre_centro}' cargado con {centroActual.POIs.Length} POIs.");
        }
        catch (System.Exception e)
        {
            Debug.LogWarning($"[JsonLoader] Error leyendo JSON: {e.Message}");
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
    public int id_poi;
    public string nombre_poi;
    public string descripcion_poi;
    public LocPoi loc_poi;
}

[System.Serializable]
public class Centro
{
    public string id_centro;
    public string nombre_centro;
    public string descripcion_centro;
    public Poi[] POIs;
}

[System.Serializable]
public class CentroList
{
    public Centro[] CENTROS;
}
