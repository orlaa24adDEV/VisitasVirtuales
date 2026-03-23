import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

worker.events.on('request:start', ({ request }) => {
	console.debug('MSW intercepted:', request.method, request.url);
});

worker.events.on('request:match', ({ request }) => {
	console.debug('MSW matched:', request.method, request.url);
});

worker.events.on('request:unhandled', ({ request }) => {
	console.debug('MSW unhandled:', request.method, request.url);
});

worker.start({
  onUnhandledRequest: 'bypass', // Esto le dice: "Si no lo conoces, cállate y déjalo pasar"
})
