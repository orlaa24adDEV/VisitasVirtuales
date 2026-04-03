export const Header = ({ onMenuClick }) => (
  <header className="h-16 bg-gray-300 text-white flex items-center justify-between px-6 shadow-lg z-10">
    <div className="flex items-center gap-2">
      {/* Botón de Hamburguesa: visible solo en móvil, activa el toggleSidebar */}
      <button 
        onClick={onMenuClick}
        className="p-2 mr-2 text-black md:hidden hover:bg-gray-400 rounded-lg transition-colors"
        aria-label="Abrir menú"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="w-8 h-8 bg-black rounded-lg cursor-pointer" />
      <span className="font-bold text-xl text-black tracking-tight cursor-pointer">Header</span>
    </div>

    <div className="p-4 border-t border-black">
      <button className="w-full flex items-center gap-3 p-3 text-black hover:bg-blue-600 rounded-xl transition-all cursor-pointer">
        <span className="font-medium">Admin</span>
      </button>
    </div>
  </header>
);