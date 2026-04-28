import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth.js';
import { ESCENAS_POR_CENTRO } from '@/helpers/escenas.js';

// TODO: cambiar a "true" cuando los archivos del build de Unity estén en el folder de Built_Unity
//Ver instrucciones en public/Build_Unity/.gitkeep
const UNITY_BUILD_LISTO = true;

export default function UnityViewer() {
  // Obtenemos el centro seleccionado del contexto global
    const { centerState } = useAuth();
    const { selectedCenter } = centerState;

    // Calculamos sceneId directamente desde selectedCenter, sin depender de la URL
    // Así evitamos problemas de timing cuando la URL todavía no fue actualizada
    const sceneId = selectedCenter ? (ESCENAS_POR_CENTRO[selectedCenter.id] ?? 0) : null;

    // Referencia directa al canvas del DOM
    // Es como un "puntero" para que Unity sepa dónde pintarse
    const canvasRef = useRef(null);
    const unityInstanceRef = useRef(null);

    // Se ejecuta una sola vez cuando el componente aparece en pantalla
    useEffect(() => {

        // Si el build no está listo todavía no se hace nada
        if (!UNITY_BUILD_LISTO) {
            console.log('Unity build no disponible aún');
            return;
        }

        // Crear el script del loader de Unity dinámicamente
        const script = document.createElement('script');
        script.src = '/Build_Unity/Build/Build_Unity.loader.js';

        // Cuando el script termina de cargar, arrancamos Unity
        script.onload = () => {

            // createUnityInstance: función global que viene del loader.
            // Recibe: el canvas, los paths a los archivos del build, y un callback de progreso
            // eslint-disable-next-line no-undef
            createUnityInstance(canvasRef.current, {
                dataUrl:      '/Build_Unity/Build/Build_Unity.data',
                frameworkUrl: '/Build_Unity/Build/Build_Unity.framework.js',
                codeUrl:      '/Build_Unity/Build/Build_Unity.wasm',
            }, (progress) => {
                console.log('Cargando Unity... ' + Math.round(progress * 100) + '%');
            })

            //Cuando Unity termino de cargar correctamente
            .then((unityInstance) => {
                unityInstanceRef.current = unityInstance;

                //Delay de 1.5seg para que encuente el gameobject antes
                setTimeout(() => {
                    // EL PUENTE: enviamos el ID del centro a Unity
                    unityInstance.SendMessage(
                        'WebBridge',
                        'RecibirIdCentro',
                        selectedCenter.id.toString()
                    );


                    console.log('ID enviado a Unity:', selectedCenter.id);

                    if(sceneId !== null) {
                        unityInstance.SendMessage(
                            'WebBridge',
                            'RecibirIdEscena',
                            sceneId.toString()
                        );
                        console.log('ID de escena enviado a Unity:', sceneId);
                    } else {
                        console.log('No se especificó escena en la URL, Unity usará la escena por defecto');
                    }
                
                }, 1500); // 1.5 seg de espera 
            })

            // Si Unity falla al cargar
            .catch((error) => {
                console.warn('Error al cargar Unity:', error);
            });
        };

        // Agregar el script al documento para que empiece a descargarse
        document.body.appendChild(script);

        // Limpieza cuando el usuario salga de esta página, y que no quede unity en segundo plano
        return () => {
            if (unityInstanceRef.current) {
                unityInstanceRef.current.Quit().then(() => {
                    if (document.body.contains(script)) {
                        document.body.removeChild(script);
                    }
                }).catch(() => {
                    if (document.body.contains(script)) {
                        document.body.removeChild(script);
                    }
                });
            } else {
                if (document.body.contains(script)) {
                    document.body.removeChild(script);
                }
            }
        };

    }, []);  // <-- [] ejecutar solo una vez al montar el componente

    // Lo que se muestra en pantalla
    return (
        <div className="flex flex-col w-200 h-200">

            {/* Texto de bienvenida */}
            <div className="flex flex-col items-center justify-center py-4 space-y-2">
                <h1 className="text-3xl font-bold text-center text-gray-800">
                    Bienvenido a {selectedCenter.name}
                </h1>
                <p className="text-xl italic text-gray-500">Inicio</p>
            </div>

            {/* Canvas de Unity — solo se muestra cuando el build está listo */}
            {UNITY_BUILD_LISTO ? (
                <canvas
                    ref={canvasRef}
                    id="unity-canvas"
                    className="flex-1 w-full"
                    style={{ display: 'block' }}
                />
            ) : (
                <div className="flex flex-col items-center justify-center flex-1 text-gray-400">
                    <p className="text-sm italic">Vista de Unity no disponible aún</p>
                </div>
            )}
        </div>
    );
}