import './assets/App.css';
import MockAPITest from './components/dev/MockApiTest';
import TopHeader from './components/TopHeader';

function App() {
	return (
		<div className="h-screen w-full flex flex-col justify-center items-center space-y-6 bg-white">
			<TopHeader ></TopHeader>
			<MockAPITest />
		</div>
	);
}

export default App;
