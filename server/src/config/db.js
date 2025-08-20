import mongoose from "mongoose";
import dotEnv from "dotenv";

dotEnv.config({ path: "../config.env" }); // To Access to The config.env File

console.log(process.env.CONN_STRING);

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.CONN_STRING);
    console.log("Connected To Db Successfully");
  } catch (err) {
    console.log("SomeThing Got Wrong Connecting To Db");
    process.exit(1);
  }
};

export default connectToDb;

// mongoose.connect()
