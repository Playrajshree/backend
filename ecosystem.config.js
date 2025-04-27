module.exports = {
    apps: [
      {
        name: "backend",
        script: "server.js", // ⚠️ Isko tumhare entry file se replace karo (e.g., server.js)
        instances: 4, // ya "max" for all CPU cores
        autorestart: true,
        watch: false,
        max_memory_restart: "512M",
        env: {
          NODE_ENV: "development",
        },
        env_production: {
          NODE_ENV: "production",
          PORT: 443 // apna production port yahan daalo
        }
      }
    ]
  };