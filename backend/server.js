//to use this add type module in package.json

import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./database/db_connection.js";
import router from "./routes/route.js";

const app = express();

//middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-y"); //less hackers know about your stack

const port = 4000;

//http get request
app.get("/", (req, res) => {
  res.status(201).json({
    success: true,
    message: "Get request successfull",
  });
});

//api routes
app.use("/api/v1", router);

connectDB()
  .then(() => {
    try {
      //starting development server
      app.listen(port, (req, res) => {
        console.log(`Server is connected successfully on port ${port}`);
      });
    } catch (error) {
      console.log("Cannot connect to the database server");
    }
  })
  .catch((error) => {
    console.log("Invalid database connection");
  });
