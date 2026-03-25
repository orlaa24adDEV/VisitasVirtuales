import MockAPITest from './components/dev/MockApiTest';
import TopHeader from './components/TopHeader';
import Sidebar from './components/Sidebar';
import Login from './components/Login';

function App() {
	return (
		<div className="w-full flex items-center bg-white">
			<Sidebar className="h-screen" />
			<div className="flex-col flex w-full h-screen">
				<TopHeader />
				<Login />
			</div>
		</div>
	);
}
export default App;
