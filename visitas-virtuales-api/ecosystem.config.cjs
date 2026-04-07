module.exports = {
  apps: [{
    name: "visitas-virtuales",
    script: "./src/app.js",
    node_args: "--require ./preload-env.js",
    exec_mode: "cluster",
    instances: "max",
    autorestart: true,
    max_memory_restart: '1G',
    env_production: {
      NODE_ENV: "production",
    }
  }]
}