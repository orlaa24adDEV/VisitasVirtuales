import MockAPITest from './components/dev/MockApiTest';
import { useState } from 'react';
import TopHeader from './components/TopHeader';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Crud from './components/Crud';

function App() {

	//Estado para responsive en movil
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	return (
		<div className="w-full flex bg-white min-h-screen">
			<Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
			<div className="flex-col flex w-full h-screen overflow-hidden">
				<TopHeader onMenuClick={() => setIsMobileMenuOpen(true)}/>
				<main className="flex-1 overflow-y-auto flex items-center justify-center">
					<Login />
					<Crud></Crud>
				</main>
				
			</div>
		</div>
	);
}
export default App;
