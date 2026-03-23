import { useState } from 'react';
import './assets/App.css';
import MockAPITest from './components/dev/MockApiTest';

function App() {
	return (
		<div className="h-screen w-full flex flex-col justify-center items-center space-y-6 bg-white">
			<MockAPITest />
		</div>
	);
}

export default App;
