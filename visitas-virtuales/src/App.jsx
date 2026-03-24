import { useState } from 'react';
import './assets/App.css';
import MockAPITest from './components/dev/MockApiTest';
import Sidebar from './components/dev/Sidebar';

function App() {


	const [seccion, setSeccion] = useState('inicio'); // Para cambiar color de seleccion

	return (
		
		<div className="flex"> {/* flex para posicionar. Esto creo que no lo hago yo*/}
      
			{/* Barra lateral */}
			<Sidebar onSelect={setSeccion} activeItem={seccion}/>

			{/* El contenido principal de tu aplicación */}
			<main className="flex-1 p-8 bg-gray-100 min-h-screen">
				{/* Da true porque un html siempre da true */}
				{seccion === 'inicio' && <h1>Estás en Inicio</h1>}
				{seccion === 'perfil' && <h1>Perfil de Usuario</h1>}
				{seccion === 'mensajes' && <h1>Bandeja de Entrada</h1>}
				{seccion === 'dashboard' && <h1>Esto es un dashboard</h1>}
				{seccion === 'seleccion-centro' && <h1>Elije un centro</h1>}
				{seccion === 'gestion-pois' && <h1>Selecciona el POI</h1>}
				{seccion === 'auditoria' && <h1>Realiza una auditoría</h1>}
				<MockAPITest />
			</main>

		</div>

	)

}

export default App;


/*
<div className="h-screen w-full flex flex-col justify-center items-center space-y-6 bg-white">
	<MockAPITest />
</div>*/