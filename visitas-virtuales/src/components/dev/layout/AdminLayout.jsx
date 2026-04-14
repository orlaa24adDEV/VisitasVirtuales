import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useState } from "react";

export const AdminLayout = () => {
  // 2. Estado para controlar el menú móvil
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden text-slate-900 relative">
      
      {/* 3. OVERLAY (Capa oscura para móvil)
          Solo se ve cuando el sidebar está abierto en pantallas pequeñas 
      */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={toggleSidebar}
        />
      )}

      {/* 4. SIDEBAR ADAPTADO
          - En móvil: Se posiciona absoluto y sale desde la izquierda (fixed).
          - En escritorio (md): Se comporta como una columna normal.
      */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 
        ${isSidebarOpen ? "translate-x-0" : "translate-x-0 md:translate-x-0 hidden md:flex"}
      `}>
        <Sidebar closeMenu={() => setIsSidebarOpen(false)} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 w-full">
        
        {/* 5. PASAMOS LA FUNCIÓN AL HEADER
            El Header necesita recibir 'toggleSidebar' para que el botón funcione.
        */}
        <Header onMenuClick={toggleSidebar} />

        <main className="flex-1 overflow-y-auto flex flex-col bg-slate-50">
          <div className="flex-1 p-4 md:p-8">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};


