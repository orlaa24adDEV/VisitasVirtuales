// CenterSelectionPage — tarjetas con imagen superior, info centrada y línea azul inferior
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.js';
// eslint-disable-next-line no-unused-vars
import fetchWithTimeout from '@/helpers/fetchWithTimeout.js';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import Button from '@/components/Button.jsx';

export default function CenterSelectionPage() {
  const navigate = useNavigate();
  const { selectCenter, allCenters, centersError, isCentersLoading, selectedCenter } = useAuth();
  
  // Iniciamos el local con lo que haya en el contexto (por si vuelve para cambiar)
  const [localSelectedCenter, setLocalSelectedCenter] = useState(selectedCenter || null);
  const [hasShownToast, setHasShownToast] = useState(false);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (isCentersLoading || centersError || !allCenters || allCenters.length === 0) return;

    if (hasMounted.current) {
      if (!selectedCenter && !hasShownToast) {
        toast.info('Selecciona un centro para continuar', { 
          description: 'Es necesario elegir un centro educativo para acceder al tour' 
        });
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHasShownToast(true);
      }
    } else {
      hasMounted.current = true;
    }
  }, [isCentersLoading, centersError, allCenters, selectedCenter, hasShownToast]);

  const handleConfirm = () => {
    if (localSelectedCenter) {
      // Actualizamos el contexto global (esto permitirá entrar a /viewer)
      selectCenter(localSelectedCenter);
      
      toast.success(`Cargando ${localSelectedCenter.name}`, { 
        description: `Preparando tour virtual...` 
      });
      
      // Redirigimos a la escena de Unity
      navigate('/viewer');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Botón flotante para volver a la Landing (útil para invitados) */}
      <div className="absolute top-4 left-2">
        <Link to="/">
          <Button variant="ghost" size="normal" className="text-slate-500!">
            <ArrowLeft size={20} />
            <span>Volver a inicio</span>
          </Button>
        </Link>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-5xl">

          {/* Título */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
              ¿Qué centro quieres visitar?
            </h1>
            <p className="text-slate-500 mt-2 text-sm max-w-md mx-auto">
              Selecciona una ubicación para explorar sus instalaciones en el tour virtual 360°.
            </p>
          </div>

          {/* ... (Tus estados de carga y error se mantienen igual) ... */}
          {isCentersLoading && (
             <div className="flex justify-center items-center h-48">
               <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
             </div>
          )}

          {/* Grid de tarjetas */}
          {!isCentersLoading && !centersError && allCenters && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allCenters.map((center, index) => {
                  const isActive = localSelectedCenter?.id === center.id;
                  return (
                    <button
                      key={`${center.id}-${index}`}
                      onClick={() => setLocalSelectedCenter(center)}
                      className={`
                        group relative text-left rounded-2xl overflow-hidden bg-white
                        border-2 transition-all duration-300 focus:outline-none
                        hover:shadow-2xl cursor-pointer flex flex-col
                        ${isActive ? 'border-blue-600 ring-4 ring-blue-50' : 'border-slate-100 hover:border-blue-200'}
                      `}
                    >
                      {/* Imagen con overlay si está activo */}
                      <div className="relative h-40 w-full overflow-hidden">
                        {center.imageUrl ? (
                          <img src={center.imageUrl} alt={center.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full bg-linear-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold">
                            {center.name.charAt(0)}
                          </div>
                        )}
                        {isActive && <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-[1px]" />}
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h2 className="font-bold text-slate-800 text-base mb-1">{center.name}</h2>
                          <p className="text-slate-500 text-xs flex items-center gap-1">
                             {center.location || 'Ubicación disponible'}
                          </p>
                        </div>

                        {/* Indicador visual de selección */}
                        <div className={`mt-4 w-full py-2 rounded-lg text-center text-xs font-bold transition-colors ${
                          isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600'
                        }`}>
                          {isActive ? 'CENTRO SELECCIONADO' : 'SELECCIONAR'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Botón confirmar mejorado */}
              <div className="mt-12 flex justify-center">
                <Button
                  onClick={handleConfirm}
                  disabled={!localSelectedCenter}
                  variant={"primary"}
                  size={"large"}
                >
                  Acceder al Centro
                </Button>
                
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
