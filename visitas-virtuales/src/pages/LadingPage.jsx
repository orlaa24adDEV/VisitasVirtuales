import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="flex flex-col h-full bg-white items-center justify-center">
      <h1>LANDING PAGE</h1>
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold text-slate-800">
          Bienvenido a Visitas Virtuales
        </h1>
        <p className="text-slate-500 mt-2 text-lg">
          Explora centros educativos de forma virtual
        </p>
      </header>
      <button className=" items-right px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        <Link to="/login">Iniciar Sesión</Link>
      </button>
      <button className="items-right px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        <Link to="/centros">Explorar Centros</Link>
      </button>
      <button className="items-right px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        <a href="#information" className="scroll-smooth">
          Saber mas
        </a>
      </button>
      <section
        id="information"
        className="mt-20 w-full max-w-4xl px-6 py-10 bg-gray-50 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          Sobre Nosotros
        </h2>
        <p className="text-slate-600">Nosotros</p>
      </section>
    </div>
  );
};
export default LandingPage;
