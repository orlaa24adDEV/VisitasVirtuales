using System.Collections;
using UnityEngine;
using TMPro;
using System.IO;
using Unity.VisualScripting;

public class JsonLoader : MonoBehaviour
{
    public TMP_Text[] textos; 

    [SerializeField] private float tiempoActualizacion = 2f;

    string ultimaVersion = "";

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
        string path = Path.Combine(Application.streamingAssetsPath, "poiTexts.json");

        if (!File.Exists(path))
        {
            Debug.Log("No se encontró el JSON");
            return;
        }

        try
        {
            string json = File.ReadAllText(path);

            if (json == ultimaVersion)
                return;

            ultimaVersion = json;

            Data data = JsonUtility.FromJson<Data>(json);

            textos[0].text = data.p1;
            textos[1].text = data.p2;
            textos[2].text = data.p3;
            textos[3].text = data.p4;
            textos[4].text = data.p5;
            textos[5].text = data.p6;
            textos[6].text = data.p7;
            textos[7].text = data.p8;
            textos[8].text = data.p9;
            textos[9].text = data.p10;
        }
        catch
        {
            Debug.Log("JSON en proceso de edición...");
        }
    }
}

[System.Serializable]
public class Data
{
    public string p1;
    public string p2;
    public string p3;
    public string p4;
    public string p5;
    public string p6;
    public string p7;
    public string p8;
    public string p9;
    public string p10;
}
