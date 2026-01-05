import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';
import {extractTextFromPDF} from '../utils/pdfParser.js';
import {chunkText} from '../utils/textChunker.js';

import fs from 'fs/promises';
import mongoose from 'mongoose';


// @desc    Upload pdf document
// @route   POST /api/documents/upload
// @access  Private
export const uploadDocument = async (req, res, next) => {
    try {
       if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file uploaded', statusCode: 400 });
       }

       const {title}=req.body;
       if(!title){
        // clean up uploaded file
        await fs.unlink(req.file.path);
        return res.status(400).json({ success: false, error: 'Title is required', statusCode: 400 });
       }

       // construct document data
       const baseUrl=`http://localhost:${process.env.PORT || 8000}`;
       const fileUrl=`${baseUrl}/uploads/documents/${req.file.filename}`;

       // create document record 
       const document=await Document.create({
        userId:req.user._id,
        title,
        filename:req.file.originalname,
        filepath:fileUrl,
        filesize:req.file.size,
        status:'processing'
         });

         // process PDF in background 
        processPDF(document._id,req.file.path).catch(err=>{
            console.error("Error processing PDF:",err);
        })


        res.status(201).json({
            success: true,
            data: document,
            message: 'Document uploaded successfully and is being processed',
        });

    }catch (error) {
        // clean up uploaded file in case of error
        if(req.file){
            await fs.unlink(req.file.path).catch(()=>{});
        }
        next(error);
    }
}



// helper function processing PDF
const processPDF=async(documentId,filePath)=>{
    try {
        const {text}=await extractTextFromPDF(filePath);

        //Create chunks
        const chunks=chunkText(text,50,5);

        // update document record
        await Document.findByIdAndUpdate(documentId,{
            extractedText:text,
            chunks:chunks,
            status:'ready'
        });

        console.log(`Document ${documentId} processed successfully.`);
    } catch (error) {
        console.error(`Error processing document ${documentId}:`,error);
        await Document.findByIdAndUpdate(documentId,{
            status:'failed'
        });
    }
}

// @desc    Get all documents for the user
// @route   GET /api/documents
// @access  Private
export const getDocuments = async (req, res, next) => {
    try {
        const documents=await Document.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(req.user._id) } },
            { $lookup: {
                from: 'flashcards',
                localField: '_id',
                foreignField: 'documentId',
                as: 'flashcardSets',
                }
            },
            { $lookup: {
                from: 'quizzes',
                localField: '_id',
                foreignField: 'documentId',
                as: 'quizzes',
                }
            },
            { $addFields: {
                flashcardCount: { $size: '$flashcardSets' },
                quizCount: { $size: '$quizzes' },
            }},
            { $project: { extractedText:0,chunks:0,flashcardSets:0,quizzes:0 } },
            { $sort: { uploadDate: -1 } }]);

        res.status(200).json({
            success: true,
            count: documents.length,
            data: documents,
        });


    }catch (error) {
        next(error);
    }
}

// @desc    Get single document by ID
// @route   GET /api/documents/:id
// @access  Private
export const getDocument = async (req, res, next) => {
       try {
        const document=await Document.findOne({
            _id:req.params.id,
            userId:req.user._id
        });
        if(!document){
            return  res.status(404).json({ success: false, error: 'Document not found', statusCode: 404 });
        }   

        // get count of ascsociated flashcards and quizzes
        const flashcardCount=await Flashcard.countDocuments({documentId:document._id,userId:req.user._id});
        const quizCount=await Quiz.countDocuments({documentId:document._id,userId:req.user._id});
        
        // update last accessed
        document.lastAccessed=Date.now();
        await document.save();

        // combine document data with counts
        const documentData=document.toObject();
        documentData.flashcardCount=flashcardCount;
        documentData.quizCount=quizCount;

        res.status(200).json({
            success: true,
            data: documentData,
        });

    }catch (error) {
        next(error);
    }
}



// @desc    Delete document by ID
// @route   DELETE /api/documents/:id
// @access  Private
export const deleteDocument = async (req, res, next) => {
       try {
        const document=await Document.findOne({
            _id:req.params.id,
            userId:req.user._id
        });

        if (!document) {
            return res.status(404).json({ success: false, error: 'Document not found', statusCode: 404 });
        }

        // delete file from file system
        await fs.unlink(document.filepath).catch(()=>{});

        //delete document
        await document.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Document deleted successfully',
        });

    }catch (error) {
        next(error);
    }
}


