import { NavLink } from "react-router-dom";

export const Sidebar = () => {
  // Definimos las clases para no repetir código
  // isActive es un valor que nos da React Router automáticamente
  const linkStyles = ({ isActive }) => 
    `flex items-center gap-3 p-4 rounded-xl transition-all group font-medium ${
      isActive 
        ? "bg-white text-blue-700 shadow-md" // Estilo cuando estás en la ruta
        : "text-white hover:bg-blue-600"      // Estilo normal
    }`;

  return (
    <aside className="w-64 bg-blue-800 border-r border-slate-200 flex-col hidden md:flex h-screen sticky top-0">
      <nav className="flex-1 p-4 space-y-2 flex flex-col">
        <p className="text-xs font-semibold text-blue-200 uppercase px-3 mb-4">
          SideBar
        </p>

        {/* Usamos NavLink en lugar de <a> */}
        <NavLink to="/dashboard" className={linkStyles}>
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/pois" className={linkStyles}>
          <span>POIs</span>
        </NavLink>

        <NavLink to="/historial" className={linkStyles}>
          <span>Historial</span>
        </NavLink>
      </nav>
    </aside>
  );
};