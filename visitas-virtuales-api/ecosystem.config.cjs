module.exports = {
	apps: [
		{
			name: 'visitas-virtuales',
			script: './dist/app.js',
			node_args: '--import ./dist/env.js',
			exec_mode: 'cluster',
			instances: 'max',
			autorestart: true,
			max_memory_restart: '1G',
		},
	],
}
