import CenterSelectionPage from "./CenterSelectionPage";
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { selectedCenter } = useAuth();
  return (
    <div className="flex flex-col justify-center items-center space-y-6 h-full">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard de {selectedCenter.name}</h1>
      <p className="text-gray-500 italic text-xl">Bienvenido al dashboard de {selectedCenter?.name}</p>
    </div>
  );
};

export default Dashboard;