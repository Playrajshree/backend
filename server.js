const cluster = require("cluster");
const os = require("os");
const http = require("http");
const app = require('./app.js');
const connectDB = require('./src/db/dbConnect.js');
const Config = require('./src/configs/Config.js');

const numOfCpus = os.cpus().length;

const https = require('https');
const fs = require('fs');
const express = require('express');
const app = express();

const options = {
  key: fs.readFileSync(Config.PRIV_KEY),
  cert: fs.readFileSync(Config.CERT_KEY)
};
const startServer = async ( ) => {
    if (cluster.isMaster) {
      console.log(`Master process ${process.pid} is running`);
        for (let i = 0; i < numOfCpus; i++) {
          cluster.fork();  // Creating worker processes
        }
        cluster.on('exit', (worker) => {
          console.log(`Worker ${worker.process.pid} died. Spawning a new one.`);
          cluster.fork();  // Spawn a new worker if one dies
        });
    }
    else {
      try {
         await connectDB();
         const server = http.createServer(options, app);          
            server.listen(Config.PORT, () => {
            console.log(`Worker ${process.pid} started server on port ${Config.PORT}`);
          });
      } catch (error) {
        console.error(`Worker ${process.pid} failed to connect DB:`, error);
        process.exit(1);
        
      }
  }
}
    

startServer();




// const startServer = () => {
//   connectDB()
//     .then(() => {
//       app.listen(Config.PORT, () => {
//         console.log(`Server is running on port ${Config.PORT}`);
//       });
//     })
//     .catch((error) => {
//       console.error('❌ Server startup failed due to DB error:', error);
//       process.exit(1);
//     });
// };

// startServer();
