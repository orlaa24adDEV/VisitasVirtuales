import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";

export const MainLayout = ({ children }) => {
  return (
    // Contenedor Flex: Divide la pantalla en Izquierda (Sidebar) y Derecha (Todo lo demás)
    <div className="flex min-h-screen bg-slate-50">
      
      {/* SIDEBAR: Se queda fijo a la izquierda, ocupando el 100% de la altura */}
      <aside className="w-sidebar bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
        <Sidebar />
      </aside>

      {/* BLOQUE DERECHO: Header + Contenido + Footer */}
      <div className="flex-1 flex flex-col">
        
        {/* HEADER: Ocupa el ancho restante a la derecha del sidebar */}
        <Header />

        {/* CONTENIDO: Crece para empujar al footer al fondo */}
        <main className="flex-1 p-6">
          <div className="bg-white rounded-xl border border-slate-200 min-h-full p-6 shadow-sm">
            {children}
          </div>
        </main>

        {/* FOOTER: Al final del bloque derecho */}
        <Footer />
      </div>

    </div>
  );
};