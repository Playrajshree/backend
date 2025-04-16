const cluster = require("cluster");
const os = require("os");
const http = require("http");
const app = require('./app.js');
const connectDB = require('./src/db/dbConnect.js');
const Config = require('./src/configs/Config.js');



// const numOfCpus= os.cpus().length; // this method oc os provide the logical information of each cpu cores and returns an array of those informations 

// if(cluster.isMaster){
//      console.log(`Master ${process.pid} is running`);
//      // always call db in the master process otherwise it will increase the load on mongodb server 
//      connectDB().then(() => {
//           for(let i = 0; i < numOfCpus; i++){
//                cluster.fork(); // this method is used to create the worker

//           }
//      }).catch((error) => {
//          console.error('❌ Server startup failed due to DB error:', error)
//          process.exit(1); // end server of doing this if connection fails from the mongodb server
//      })
//       // here an event listener is beign attached to cluster so it can react if any worker dies 
//      cluster.on('exit', (worker) => {
//           console.log(`Worker ${worker.process.pid} died. Spawning a new one.`);
//           cluster.fork();ðß
//      })
// }
// else {
//    const server = http.createServer(app); // create an instance for each worker 
//       server.listen(Config.PORT, () => {
//         console.log(`Server started on port 3000 by worker ${process.pid}`);  
//       })
// }








const startServer = () => {
  connectDB()
    .then(() => {
      app.listen(Config.PORT, () => {
        console.log(`Server is running on port ${Config.PORT}`);
      });
    })
    .catch((error) => {
      console.error('❌ Server startup failed due to DB error:', error);
      process.exit(1);
    });
};

startServer();
