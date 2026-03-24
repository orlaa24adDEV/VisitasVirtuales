import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden text-slate-900">
      {/* 1. SIDEBAR: Columna izquierda fija */}
      <Sidebar />

      {/* 2. CONTENEDOR DERECHO: Header + (Contenido + Footer) */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* HEADER: Fijo arriba */}
        <Header />

        {/* 3. ÁREA DE SCROLL: Contenido dinámico y Footer al final */}
        <main className="flex-1 overflow-y-auto flex flex-col bg-slate-50">
          
          {/* Contenedor de las páginas (Outlet) */}
          <div className="flex-1 p-6">
            <Outlet />
          </div>

          {/* FOOTER: Siempre al final del scroll */}
          <Footer />

        </main>
      </div>
    </div>
  );
};

