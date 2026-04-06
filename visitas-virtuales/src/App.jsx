import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import TopHeader from './components/TopHeader';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Crud from './components/Crud';

import Dashboard from './pages/Dashboard.jsx';
import Pois from './pages/Pois.jsx';
import Historial from './pages/Historial.jsx';
import CenterSelectionPage from './pages/CenterSelectionPage.jsx';


function App() {

	//Estado para responsive en movil
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	return (
		<div className="w-full flex bg-white min-h-screen">
			<Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
			<div className="flex-col flex w-full h-screen overflow-hidden">
				<TopHeader onMenuClick={() => setIsMobileMenuOpen(true)}/>

				{/**Contenido de la página */}
				<main className="flex-1 overflow-y-auto">
					<Routes>
						<Route path="/login" element={<Login/>} />
						<Route path="/perfil" element={<div className="p-10 text-center text-gray-500 text-3xl font-bold">Bienvenido a Perfil</div>} />
						<Route path="/mensajes" element={<div className="p-10 text-center text-gray-500 text-3xl font-bold">Bienvenido a Mensajes</div>} />
						<Route path="/crud" element={<Crud />} />
						<Route path="/pois" element={<Pois />} /> 
						<Route path="/centros" element={<CenterSelectionPage />} />
						<Route path="/historial" element={<Historial />} />
						{/* Ruta por defecto (404) */}
						<Route path="*" element={<div className="p-10">Página no encontrada</div>} />
					</Routes>
				</main>
				
			</div>
		</div>
	);
}
export default App;
