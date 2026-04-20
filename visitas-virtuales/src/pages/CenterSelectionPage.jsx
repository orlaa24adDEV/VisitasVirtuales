// CenterSelectionPage — tarjetas con imagen superior, info centrada y línea azul inferior
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.js';
import fetchWithTimeout from '@/helpers/fetchWithTimeout.js';

export default function CenterSelectionPage() {
  const navigate = useNavigate();
  const { selectCenter, allCenters, centersError, isCentersLoading, selectedCenter, setSelectedCenter } = useAuth();

  const handleConfirm = () => {
    if (selectedCenter) {
      selectCenter(selectedCenter);
      navigate('/home');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Contenido */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-5xl">

          {/* Título */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold text-slate-800">
              Selecciona un centro educativo
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              Elige el centro
            </p>
          </div>

          {/* Estado: cargando */}
          {isCentersLoading && (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
            </div>
          )}

          {/* Estado: error */}
          {centersError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-center text-sm">
              {centersError}
            </div>
          )}

          {/* Grid de tarjetas */}
          {!isCentersLoading && !centersError && allCenters && allCenters.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {allCenters.map((center, index) => {
                  const isActive = selectedCenter?.id === center.id;
                  return (
                    <button
                      key={`${center.id}-${index}`}
                      onClick={() => setSelectedCenter(center)}
                      className={`
                        group text-left rounded-2xl overflow-hidden bg-white
                        border-2 transition-all duration-200 focus:outline-none
                        hover:scale-105 hover:shadow-xl cursor-pointer
                        ${isActive
                          ? 'border-blue-600 shadow-2xl scale-105'
                          : 'border-gray-200 shadow-xl hover:border-blue-200'
                        }
                      `}
                    >
                      {/* Imagen del centro */}
                      {center.imageUrl ? (
                        <img
                          src={center.imageUrl}
                          alt={center.name}
                          className="w-full h-36 object-cover"
                        />
                      ) : (
                        /* Placeholder si la API aún no devuelve imagen */
                        <div className="w-full h-36 bg-linear-to-br from-blue-200 to-blue-400 flex items-center justify-center">
                          <span className="text-4xl font-semibold text-blue-700">
                            {center.name.charAt(0)}
                          </span>
                        </div>
                      )}

                      {/* Info del centro */}
                      <div className="px-4 py-4 text-center">
                        <h2 className="font-semibold text-slate-800 text-sm leading-snug">
                          {center.name}
                        </h2>
                        {center.neighborhood && (
                          <p className="text-slate-500 text-xs mt-0.5">{center.neighborhood}</p>
                        )}
                        {center.address && (
                          <p className="text-slate-500 text-xs mt-0.5">{center.address}</p>
                        )}
                        {center.phone && (
                          <p className="text-slate-500 text-xs mt-0.5">{center.phone}</p>
                        )}

                        {/* Badge seleccionado */}
                        {isActive && (
                          <div className="mt-3 inline-flex items-center gap-1 bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Seleccionado
                          </div>
                        )}
                        {/* Placeholder si no está seleccionado */}
                        {!isActive && (
                          <div className="h-6 mt-3"></div>
                        )}
                        
                      </div>

                      {/* Línea inferior: azul si activo, gris si no */}
                      <div
                        className={`h-2 w-full transition-colors duration-200 ${
                          isActive ? 'bg-blue-600' : 'bg-slate-100 group-hover:bg-blue-200'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Botón confirmar */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleConfirm}
                  disabled={!selectedCenter}
                  className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    selectedCenter
                      ? 'bg-blue-700 text-white hover:bg-blue-800 shadow-md hover:shadow-lg'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Acceder al centro
                </button>
              </div>
            </>
          )}

          {/* Sin centros disponibles */}
          {!isCentersLoading && !centersError && allCenters && allCenters.length === 0 && (
            <div className="text-center text-slate-500 py-10">No hay centros disponibles.</div>
          )}
        </div>
      </main>
    </div>
  );
}
