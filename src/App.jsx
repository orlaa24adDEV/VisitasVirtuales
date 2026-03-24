import './assets/App.css';
import MockAPITest from './components/dev/MockApiTest';
import { MainLayout } from './components/dev/layout/MainLayout';

function App() {
	return (
  		<MainLayout>
    		<div className="flex-1 w-full flex flex-col justify-center items-center space-y-6 bg-white">
      			
      			<MockAPITest />
      
      			<h1 className="text-2xl font-light text-gray-300 italic">
        				Plantilla en Blanco
      			</h1>
    		</div>
  		</MainLayout>
	);
}

export default App;
