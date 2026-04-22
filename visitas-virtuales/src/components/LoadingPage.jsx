import { LoaderCircle } from 'lucide-react';

export default function LoadingPage({ isExiting }) {
    return (
        <main 
          className={`
            fixed inset-0 z-50 /* This ensures it covers the content during the fade */
            flex flex-col gap-4 items-center justify-center bg-white
            transition-all duration-700 ease-in-out
            ${isExiting ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}
          `}
        >
            <LoaderCircle className="animate-spin text-blue-600" size={48} strokeWidth={2} />
            <div className="text-center px-4">
              <h2 className="text-xl font-semibold text-slate-800">
                Cargando contenido...
              </h2>
              <p className="text-slate-500 mt-1">
                Por favor, espera mientras preparamos todo para ti.
              </p>
            </div>
        </main>
    );
}