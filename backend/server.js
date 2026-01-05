import dotenv from "dotenv"
dotenv.config() // read from the .env global screat vaibrla 

import express from 'express'; // webserver 
import cors from 'cors';  //alwo access cross domain 
import path from 'path'; //corret path cross win/lun/mac 
import { fileURLToPath } from "url"; //es style URL to file path 
import connectDB from './config/db.js'; //database connection
import errorHandler from  './middleware/errorHandler.js';
import authRoutes from './routes/authRouters.js';

// es6 module __dirname alternative
const __filename = fileURLToPath(import.meta.url);  //get current server/js path 
const __dirname = path.dirname(__filename); // get the current server.js directory 

// initial express app
const app = express();  


//connect to database
connectDB( )

// midllware handler CORS 
// frontend at  http://localhost:5173/
// backend at 5000 , it alwo the access 
app.use(
    cors({
        origin:"*",
        methods:["GET","POST","PUT","DELETE"],
        allowedHeaders:["Content-Type","Authorization"],
        credentials:true,
    })
)

app.use(express.json())  //get the json from the request body 
app.use(express.urlencoded({ extended: true }));  //parse html form bodies

// static folder for updas

app.use('/uploads',express.static(path.join(__dirname,'uploads')));

//Routes
app.use('/api/auth',authRoutes)



app.use(errorHandler);


app.use((req,res)=>{
    res.status(404).json({
        success:false,
        error:'Route node found',
        statusCode:404
    });
});


// start server
const PORT=process.env.PORT || 8000;
app.listen(PORT,()=>{
    console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT} `)
})

process.on('unhandledRejection',(err)=>{
    console.error(`Error: ${err.message}`);
    process.exit(1);
})
