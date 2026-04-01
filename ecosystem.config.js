module.exports = {
  apps: [
    {
      name: "adroll-static",
      script: "server.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 8082 // Port changed since 8080 and 8081 are in use
      }
    }
  ]
};
