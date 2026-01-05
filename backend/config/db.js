import mongoose from "mongoose";


const connectDB=async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    }catch(error){
        console.error(`Error connecting to mongoDB  : ${error.message}`);
        process.exit(1); //exit with failure
    }
};

export default connectDB;