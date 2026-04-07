import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { selectedCenter } = useAuth();
        return (
            <div className="flex flex-col justify-center items-center space-y-6 h-full">
                <h1 className=" text-center text-3xl font-bold text-gray-800">Bienvenido a {selectedCenter.name}</h1>
                <p className="text-gray-500 italic text-xl">Inicio</p>
            </div>
        );
};

export default Home;