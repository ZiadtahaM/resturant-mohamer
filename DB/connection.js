

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({quiet:true});
//Added quiet:true to remove the message when the server starts

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.CONN_STR);
    //console.log("Mongo URI:", process.env.MONGO_URI);


    console.log("MongoDB connected successfully");

    mongoose.connection.on("connected", () => {
      console.log("Mongoose: Connected to DB");
    });
    mongoose.connection.on("error", (err) => {
      console.error("Mongoose: Connection error:", err);
    });
    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose: Disconnected from DB");
    });

  } catch (error) {
    console.error("Database connection error:", error);
  }
};

export default dbConnection;
