import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';

async function enableMocking() {
	if (import.meta.env.DEV) {
		const { worker } = await import('./mocks/browser');
		await worker.start({
			onUnhandledRequest: 'warn',
			serviceWorker: {
				url: '/mockServiceWorker.js',
			},
		});
		console.log('🚀 MSW started successfully');
	}
}

enableMocking().then(() =>
	
	ReactDOM.createRoot(document.getElementById('root')).render(
		<React.StrictMode>
			<BrowserRouter>
				<App />
			</BrowserRouter>
			
		</React.StrictMode>,
	),
);
