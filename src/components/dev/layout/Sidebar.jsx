export const Sidebar = () => (
  <aside className="w-64 bg-blue-800 border-r border-slate-200 flex-col hidden md:flex h-screen sticky top-0">
    <nav className="flex-1 p-4 space-y-6 flex-col gap-3 ">
      <p className="text-xs font-semibold text-white uppercase px-3 mb-2">Sidebar</p>
      <a href="#" className="flex items-center gap-3 p-4 text-white hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all group">
        <span className="font-medium">Dashboard</span>
      </a>
      <a href="#" className="flex items-center gap-3 p-4 text-white hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all">
        <span className="font-medium">POIs</span>
      </a>
      <a href="#" className="flex items-center gap-3 p-4 text-white hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all">
        <span className="font-medium">Historial</span>
      </a>
    </nav>
    
  </aside>
);