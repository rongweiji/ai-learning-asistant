import { error } from "console";

const errorHandler = (err, req, res, next) => {
    let statustCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Mongoose bad objectid
    if(err.name === 'CastError'){
        message = `Resource not found with id of ${err.value}`;
        statustCode = 404;
    }

    // Mongoose duplicate key
    if(err.code === 11000){
        const field=Object.keys(err.keyValue)[0];
        message = `Duplicate field value entered for ${field}`;
        statustCode = 400;
    }

    // mongoose validation error
    if(err.name === 'ValidationError'){
        message = Object.values(err.errors).map(val => val.message).join(', ');
        statustCode = 400;
    }

    // multer file size error
    if(err.code === 'LIMIT_FILE_SIZE'){
        message = 'File size is too large. Max limit is 10MB';
        statustCode = 400;
    }

    // jwt error
    if(err.name === 'JsonWebTokenError'){
        message = 'Invalid token. Please log in again';
        statustCode = 401;
    }
    
    console.error('Error:',{
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });

    res.status(statustCode).json({
        success: false,
        error: message,
        statusCode: statustCode,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
}

export default errorHandler;