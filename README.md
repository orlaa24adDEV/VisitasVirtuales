# 🎮 WebGL Viewer — React

Visor de mi juego Unity WebGL hecho con React y Vite.

## Cómo ejecutar

```bash
npm install
npm run dev
```

Abre http://localhost:5173

## Estructura

```
src/
  App.jsx       ← todo el visor aquí
  main.jsx
  index.css
public/
  Build/
    Build.loader.js
    Build.framework.js
    Build.data
    Build.wasm
```

## Cambiar el build de Unity

Reemplaza los 4 archivos de `public/Build/` con tu nuevo build.
