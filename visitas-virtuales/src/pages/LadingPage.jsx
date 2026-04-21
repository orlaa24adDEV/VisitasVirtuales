function LadingPage() {
  return (
    <div className="absolute w-full h-screen bg-gradient-to-r from-cyan-300 via-blue-500 to-purple-600 ">
      <header className="flex flex-row w-full p-5 justify-between border">
        <h1 className="w-40 p-1 text-3xl uppercase text-white font-bold ">
          Proyecto360
        </h1>
        <nav>
          <button
            type="text"
            className="w-40 p-2 text-white bg-blue-400 border border-blue-400 rounded-lg shadow-md"
          >
            Iniciar Sesión
          </button>
        </nav>
      </header>
      <section>
        <div>
          <h1>Esto es el contenido de la lading... </h1>
        </div>
      </section>
    </div>
  );
}

export default LadingPage;
