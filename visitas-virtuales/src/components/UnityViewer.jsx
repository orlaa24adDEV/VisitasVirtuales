import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth.js';
import { useSearchParams } from 'react-router-dom';

// TODO: cambiar a "true" cuando los archivos del build de Unity estén en el folder de Built_Unity
//Ver instrucciones en public/Build_Unity/.gitkeep
const UNITY_BUILD_LISTO = true;

export default function UnityViewer() {
  // Obtenemos el centro seleccionado del contexto global
    const { selectedCenter } = useAuth();

    // Leemos el parámetro scene de la URL (ej: ?center=2&scene=1)
    // Si no hay parámetro scene en la URL, sceneId será null
    const [searchParams] = useSearchParams();
    const sceneId = searchParams.get('scene');

    // Referencia directa al canvas del DOM
    // Es como un "puntero" para que Unity sepa dónde pintarse
    const canvasRef = useRef(null);

    // Se ejecuta una sola vez cuando el componente aparece en pantalla
    useEffect(() => {

        // Si el build no está listo todavía no se hace nada
        if (!UNITY_BUILD_LISTO) {
            console.log('Unity build no disponible aún');
            return;
        }

        // Crear el script del loader de Unity dinámicamente
        const script = document.createElement('script');
        script.src = '/Built_Unity/Build/Built_Unity.loader.js';

        // Cuando el script termina de cargar, arrancamos Unity
        script.onload = () => {

            // createUnityInstance: función global que viene del loader.
            // Recibe: el canvas, los paths a los archivos del build, y un callback de progreso
            // eslint-disable-next-line no-undef
            createUnityInstance(canvasRef.current, {
                dataUrl:      '/Built_Unity/Build/Built_Unity.data',
                frameworkUrl: '/Built_Unity/Build/Built_Unity.framework.js',
                codeUrl:      '/Built_Unity/Build/Built_Unity.wasm',
            }, (progress) => {
                console.log('Cargando Unity... ' + Math.round(progress * 100) + '%');
            })

            //Cuando Unity termino de cargar correctamente
            .then((unityInstance) => {
                console.log('Unity cargado correctamente');

                // EL PUENTE: enviamos el ID del centro a Unity
                unityInstance.SendMessage(
                    'WebBridge',  // nombre del GameObject en la escena Unity
                    'RecibirIdCentro',  // nombre del método en WebBridge.cs
                    selectedCenter.id.toString()  // el ID del centro
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
            })

            // Si Unity falla al cargar
            .catch((error) => {
                console.warn('Error al cargar Unity:', error);
            });
        };

        // Agregar el script al documento para que empiece a descargarse
        document.body.appendChild(script);

        // Limpieza cuando el usuario salga de esta página, quitamos el script
        return () => {
            document.body.removeChild(script);
        };

    }, [selectedCenter.id, sceneId]); // <-- [] ejecutar solo una vez al montar el componente

    // Lo que se muestra en pantalla
    return (
        <div className="flex flex-col w-200px h-200px">

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