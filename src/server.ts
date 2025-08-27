/* eslint-disable no-console */


import {Server} from "http"
import mongoose  from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { envVars } from './app/config/env';
let server : Server





const startServer = async() => {

  try{
    console.log(envVars.NODE_ENV)
      console.log(process.env.NODE_ENV);
    // await mongoose.connect(
    //   `mongodb+srv://ph_tour:nUClQL7IEKjFALhQ@cluster0.7cqr184.mongodb.net/tour-management-server?retryWrites=true&w=majority&appName=Cluster0`
    // );
    console.log("Connected to MongoDB");

  server = app.listen(envVars.PORT, () => {
      console.log(`Server is running on port ${envVars.PORT}`);
    });

  }

  catch(err){
    console.error("Error starting server:", err)
  }
}

startServer();

process.on("unhandledRejection", (err)=>{

    console.log("Unhandled Rejection detected, we are closing the server")
    console.error("Error details:", err);

    if(server){
        server.close(()=>{
            console.log("Server closed");
        });
        process.exit(1);
    }

    process.exit(1);
})
process.on("uncaughtException", (err)=>{

    console.log("Uncaught Exception detected, we are closing the server")
    console.error("Error details:", err);

    if(server){
        server.close(()=>{
            console.log("Server closed");
        });
        process.exit(1);
    }

    process.exit(1);
})
process.on("SIGTERM", (err) => {
  console.log("SIGTERM detected, we are closing the server");
  console.error("Error details:", err);

  if (server) {
    server.close(() => {
      console.log("Server closed");
    });
    process.exit(1);
  }

  process.exit(1);
});
process.on("SIGINT", (err) => {
  console.log("SIGINT detected, we are closing the server");
  console.error("Error details:", err);

  if (server) {
    server.close(() => {
      console.log("Server closed");
    });
    process.exit(1);
  }

  process.exit(1);
});

// unhandled promise rejection
// Promise.reject(new Error("I forgot catch this promise"));


// uncaught exception
// throw new Error("I forgot to catch this local error");

/* * 
* unhandled promise rejection
* uncaught rejection Error
* Signal Termination - sigterm 
*/