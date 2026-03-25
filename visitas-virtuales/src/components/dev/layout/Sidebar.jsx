import { NavLink } from "react-router-dom";

// 1. Recibimos 'closeMenu' para cerrar el sidebar al hacer clic en un enlace en móvil
export const Sidebar = ({ closeMenu }) => {
  
  const linkStyles = ({ isActive }) => 
    `flex items-center gap-3 p-4 rounded-xl transition-all group font-medium ${
      isActive 
        ? "bg-white text-blue-700 shadow-md" 
        : "text-white hover:bg-blue-600"
    }`;

  return (
    /* 2. ELIMINAMOS 'hidden md:flex' y 'w-64' de aquí, 
       porque el AdminLayout ya se encarga de eso con el <aside> */
    <div className="flex flex-col bg-blue-800 h-full w-full">
      <nav className="flex-1 p-4 space-y-2 flex flex-col">
        
        <div className="flex justify-between items-center px-3 mb-4">
          <p className="text-xs font-semibold text-blue-200 uppercase">
            SideBar
          </p>
          {/* 3. Botón opcional para cerrar manualmente en móvil */}
          <button 
            onClick={closeMenu} 
            className="md:hidden text-white text-xl"
          >
            ✕
          </button>
        </div>

        {/* Añadimos onClick={closeMenu} a los enlaces para que el menú se cierre al navegar */}
        <NavLink to="/dashboard" className={linkStyles} onClick={closeMenu}>
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/pois" className={linkStyles} onClick={closeMenu}>
          <span>POIs</span>
        </NavLink>

        <NavLink to="/historial" className={linkStyles} onClick={closeMenu}>
          <span>Historial</span>
        </NavLink>
      </nav>
    </div>
  );
};