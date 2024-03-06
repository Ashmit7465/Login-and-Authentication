import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect("mongodb://localhost:27017", {
      dbName: "loginAuth",
    })
    .then(() => console.log("Database connected successfully"))
    .catch((error) => console.log(error));
};