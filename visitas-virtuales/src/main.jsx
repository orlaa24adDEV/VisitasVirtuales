import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthProvider.jsx';
import App from './App.jsx';
import './assets/App.css';

// async function enableMocking() {
// 	if (import.meta.env.DEV) {
// 		const { worker } = await import('./mocks/browser');
// 		await worker.start({
// 			onUnhandledRequest: 'warn',
// 			serviceWorker: {
// 				url: '/mockServiceWorker.js',
// 			},
// 		});
// 		console.log('🚀 MSW started successfully');
// 	}
// }

// enableMocking().then(() =>
	createRoot(document.getElementById('root')).render(
		<StrictMode>
			<BrowserRouter>
				<AuthProvider>
					<App />
				</AuthProvider>
			</BrowserRouter>
		</StrictMode>,
	)
// );
