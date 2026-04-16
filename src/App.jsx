import { useEffect, useRef, useState } from 'react'

// Mensajes que aparecen mientras carga el juego
const LOADING_MSGS = [
  'Cargando archivos...',
  'Iniciando Unity...',
  'Cargando texturas...',
  'Preparando la escena...',
  '¡Ya casi está!',
]

export default function App() {
  const canvasRef = useRef(null)
  const unityRef  = useRef(null)   // ref para el cleanup (el state no es visible en closures viejas)

  // Estados del visor
  const [loading,  setLoading]  = useState(true)
  const [progress, setProgress] = useState(0)
  const [msgIndex, setMsgIndex] = useState(0)
  const [error,    setError]    = useState(null)
  const [muted,    setMuted]    = useState(false)
  const [unity,    setUnity]    = useState(null)

  // Cargar el script del loader de Unity e instanciar el juego
  useEffect(() => {
    const script = document.createElement('script')
    script.src = '/Build/Build.loader.js'

    script.onload = () => {
      createUnityInstance(canvasRef.current, {
        dataUrl:      '/Build/Build.data',
        frameworkUrl: '/Build/Build.framework.js',
        codeUrl:      '/Build/Build.wasm',
        companyName:  'MiEmpresa',
        productName:  'MiJuego',
        productVersion: '1.0',
      }, (p) => {
        // Actualizar progreso (p va de 0 a 1)
        setProgress(p)
        setMsgIndex(Math.min(Math.floor(p * LOADING_MSGS.length), LOADING_MSGS.length - 1))
      })
      .then((instance) => {
        unityRef.current = instance
        setUnity(instance)
        setLoading(false)
      })
      .catch((err) => {
        setError('No se pudo cargar el juego: ' + (err?.message ?? String(err)))
        setLoading(false)
      })
    }

    script.onerror = () => {
      setError('No se encontró Build.loader.js. ¿Está la carpeta Build en /public?')
      setLoading(false)
    }

    document.body.appendChild(script)

    // Limpiar al desmontar
    return () => {
      unityRef.current?.Quit?.()
      document.body.removeChild(script)
    }
  }, [])

  // Silenciar / activar audio
  function handleMute() {
    const next = !muted
    setMuted(next)
    unity?.SetVolume(next ? 0 : 1)
  }

  // Pantalla completa
  function handleFullscreen() {
    if (!document.fullscreenElement) {
      document.getElementById('game-area').requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  return (
    <div style={styles.app}>

      {/* ── HEADER ── */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Zaitec</h1>
          <p style={styles.subtitle}>Visitas virtuales</p>
        </div>

        <div style={styles.buttons}>
          <button style={styles.btn} onClick={handleMute}>
            {muted ? '🔇 Activar sonido' : '🔊 Silenciar'}
          </button>
          <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={handleFullscreen}>
            ⛶ Pantalla completa
          </button>
        </div>
      </header>

      {/* ── ZONA DEL JUEGO ── */}
      <div id="game-area" style={styles.gameArea}>

        {/* Canvas de Unity — siempre en el DOM para que Unity lo encuentre */}
        <canvas ref={canvasRef} id="unity-canvas" style={styles.canvas} />

        {/* Pantalla de carga — encima del canvas mientras carga */}
        {loading && (
          <div style={styles.loadingScreen}>
            <div style={styles.loadingBox}>
              <p style={styles.loadingTitle}>Cargando juego...</p>

              {/* Barra de progreso */}
              <div style={styles.barBg}>
                <div style={{ ...styles.barFill, width: `${Math.round(progress * 100)}%` }} />
              </div>

              <p style={styles.loadingPct}>{Math.round(progress * 100)}%</p>
              <p style={styles.loadingMsg}>{LOADING_MSGS[msgIndex]}</p>
            </div>
          </div>
        )}

        {/* Pantalla de error */}
        {error && (
          <div style={styles.loadingScreen}>
            <div style={{ ...styles.loadingBox, borderColor: '#ef4444' }}>
              <p style={{ color: '#ef4444', fontWeight: 'bold', marginBottom: 8 }}>
                ❌ Error
              </p>
              <p style={{ fontSize: 13, color: '#555' }}>{error}</p>
            </div>
          </div>
        )}

      </div>

      {/* ── FOOTER ── */}
      <footer style={styles.footer}>
        <span style={{ color: loading ? '#3b82f6' : '#16a34a', fontWeight: 'bold' }}>
          {loading ? '⏳ Cargando...' : error ? '❌ Error' : '✅ Juego cargado'}
        </span>
        <span style={{ color: '#94a3b8' }}>WebGL Viewer · 2026</span>
      </footer>

    </div>
  )
}

// ── Estilos en objeto (sin fichero CSS extra) ──────────────
const styles = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },

  // Header
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 20px',
    backgroundColor: '#1d4ed8',
    color: 'white',
    flexShrink: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 0,
  },
  subtitle: {
    fontSize: 12,
    opacity: 0.8,
    margin: 0,
  },
  buttons: {
    display: 'flex',
    gap: 8,
  },
  btn: {
    padding: '7px 14px',
    borderRadius: 6,
    border: '1px solid rgba(255,255,255,0.4)',
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  btnPrimary: {
    backgroundColor: 'white',
    color: '#1d4ed8',
    border: 'none',
  },

  // Zona del juego
  gameArea: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  canvas: {
    width: '100%',
    height: '100%',
    display: 'block',
  },

  // Loading
  loadingScreen: {
    position: 'absolute',
    inset: 0,
    backgroundColor: '#f0f4ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  loadingBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    padding: '32px 40px',
    backgroundColor: 'white',
    borderRadius: 12,
    border: '2px solid #bfdbfe',
    minWidth: 300,
    boxShadow: '0 4px 24px rgba(29,78,216,0.10)',
  },
  loadingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1d4ed8',
  },
  barBg: {
    width: '100%',
    height: 10,
    backgroundColor: '#dbeafe',
    borderRadius: 10,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#1d4ed8',
    borderRadius: 10,
    transition: 'width 0.2s ease',
  },
  loadingPct: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1d4ed8',
  },
  loadingMsg: {
    fontSize: 12,
    color: '#64748b',
  },

  // Footer
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 20px',
    backgroundColor: 'white',
    borderTop: '1px solid #dbeafe',
    fontSize: 12,
    flexShrink: 0,
  },
}
