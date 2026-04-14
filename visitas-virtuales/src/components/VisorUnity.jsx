import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function VisorUnity() {
  const { unityProvider, isLoaded, loadingProgression } = useUnityContext({
    loaderUrl: "Built_Unity/Build/Buil_Unity.loader.js",
    dataUrl: "Built_Unity/Build/Buil_Unity.data",
    frameworkUrl: "Built_Unity/Build/Buil_Unity.framework.js",
    codeUrl: "Built_Unity/Build/Buil_Unity.wasm",
  });

  return (
    <div style={{ width: "100%", height: "90vh" }}>
      {!isLoaded && (
        <p style={{ textAlign: "center" }}>
          Cargando Street View: {Math.round(loadingProgression * 100)}%
        </p>
      )}
      <Unity
        unityProvider={unityProvider}
        style={{ width: "100%", height: "100%", display: isLoaded ? "block" : "none" }}
      />
    </div>
  );
}

export default VisorUnity;
