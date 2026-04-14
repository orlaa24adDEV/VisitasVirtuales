import MockAPITest from "../components/dev/MockApiTest";

const Pois = () => {
  return (
    <div className="flex flex-col justify-center items-center space-y-6 h-full">
      <MockAPITest />
      <h1 className="text-2xl font-light text-gray-300 italic text-center">
        Hola Mundo <br />
        Gestión de Puntos de Interés (POIs)
      </h1>
    </div>
  );
};

export default Pois;