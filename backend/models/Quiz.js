import mongoose from "mongoose";

const quizSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    documentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Document',
        required:true
    },
    title:{
        type:String,
        required:true,
        trim:true
    },
    questions:[{
        question:{
            type:String,
            required:true,
        },
        options:{
            type:[String],
            required:true,
            validate:[array=>array.length===4,'There must be exactly 4 options']
        },
        correctAnswer:{
            type:String,
            required:true,
        },
        explaination:{
            type:String,
            default:''
        },
        diffuculty:{
            type:String,
            enum:['easy','medium','hard'],
            default:'medium'
        }
    }],
    userAnswer:[{
        questionIndex:{
            type:Number,
            requried:true,
        },
        selectedAnswer:{
            type:String,
            required:true,
        },
        isCorrect:{
            type:Boolean,
            required:true,
        },
        answereAt:{
            type:Date,
            default:Date.now
        }
    }],
    score:{
        type:Number,
        default:0
    
    },totalQuestions:{
        type:Number,
        required:true,
    },
    completedAt:{
        type:Date,
        default:null
    }
},{
    timestamps:true
});


// To ensure a user can have only one quiz per document
quizSchema.index({userId:1,documentId:1});

const Quiz=mongoose.model('Quiz',quizSchema);
export default Quiz;