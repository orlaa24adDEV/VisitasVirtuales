export const Header = () => (
  <header className="h-16 bg-gray-300 text-black flex items-center justify-between px-6 shadow-lg z-10">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-blue-800 rounded-lg"></div>
      <span className="font-bold text-xl tracking-tight">Header</span>
    </div>
    <div className="p-4 border-t border-black">
      <button className="w-full flex items-center gap-3 p-3 text-black hover:bg-red-50 rounded-xl transition-all">
        <span className="font-medium">Iniciar Sesion</span>
      </button>
    </div>
  </header>
);