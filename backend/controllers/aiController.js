import Document from "../models/Document.js";
import Flashcard from "../models/Flashcard.js";
import Quiz from "../models/Quiz.js";
import ChatHistory from "../models/ChatHistory.js";
import * as geminiService from '../utils/geminiService.js';
import { findRelevantChunks } from "../utils/textChunker.js";
import { parse } from "dotenv";


// @desc    Generate flashcard for a document
// @route   POST /api/ai/generate-flashcards
// @access  Private
export const generateFlashcards = async (req, res, next) => {

    try {
        const { documentId, count = 10 } = req.body;

        if (!documentId) {
            return res.status(400).json({ success: false, error: 'Document ID is required', statusCode: 400 });
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready'
        });

        if (!document) {
            return res.status(404).json({ success: false, error: 'Document not found or not ready', statusCode: 404 });
        }

        // Generate flashcards using geminiService
        const cards = await geminiService.generateFlashcards(document.extractedText, parseInt(count));

        //save to database
        const flashcardSets = await Flashcard.create({
            userId: req.user._id,
            documentId: document._id,
            cards: cards.map(card => ({
                question: card.question,
                answer: card.answer,
                difficulty: card.difficulty,
                reviewCount: 0,
                isStarted: false,
            }))
        });

        res.status(200).json({
            success: true,
            data: flashcardSets,
            message: 'Flashcards generated successfully'
        });



    } catch (error) {
        next(error);
    }
}


// @desc    Generate quiz for a document
// @route   POST /api/ai/generate-quiz
// @access  Private

export const generateQuiz = async (req, res, next) => {
    try {

        const { documentId, numQuestions = 5 ,title} = req.body;

        if (!documentId) {
            return res.status(400).json({ success: false, error: 'Document ID is required', statusCode: 400 });
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready'
        });

        if (!document) {
            return res.status(404).json({ success: false, error: 'Document not found or not ready', statusCode: 404 });
        }

        // Generate quiz using geminiService
        const questions = await geminiService.generateQuiz(document.extractedText, parseInt(numQuestions));

        // Save to database
        const quiz = await Quiz.create({
            userId: req.user._id,
            documentId: document._id,
            title: title || `Quiz for ${document.title}`,
            questions:questions,
            totalQuestions: questions.length,
            userAnswers: [],
            score: 0,
        });

        res.status(200).json({
            success: true,
            data: quiz,
            message: 'Quiz generated successfully'
        });


    } catch (error) {
        next(error);
    }
}

// @desc    Generate summary for a document
// @route   POST /api/ai/generate-summary
// @access  Private
export const generateSummary = async (req, res, next) => {
    try {
        const { documentId } = req.body;
        if (!documentId) {
            return res.status(400).json({ success: false, error: 'Document ID is required', statusCode: 400 });
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready'
        });

        if (!document) {
            return res.status(404).json({ success: false, error: 'Document not found or not ready', statusCode: 404 });
        }

        // Generate summary using geminiService
        const summary = await geminiService.generateSummary(document.extractedText);

        res.status(200).json({
            success: true,
            data: {
                documentId: document._id,
                title: document.title,
                summary
            },
            message: 'Summary generated successfully'
        });

    } catch (error) {
        next(error);
    }
}

// @desc    Chat with document
// @route   POST /api/ai/chat
// @access  Private
export const chat = async (req, res, next) => {
    try {
        const { documentId, question } = req.body;

        if (!documentId || !question) {
            return res.status(400).json({ success: false, error: 'Document ID and question are required', statusCode: 400 });
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready'
        });


        if (!document) {
            return res.status(404).json({ success: false, error: 'Document not found or not ready', statusCode: 404 });
        }

        // Find relevant chunks
        const chunks = findRelevantChunks(document.chunks, question, 5);
        const chunkIndices = chunks.map(c => c.chunkIndex);


        // get or create chat history
        let chatHistory=await ChatHistory.findOne({
            userId:req.user._id,
            documentId:document._id
        });

        if(!chatHistory){
            chatHistory=await ChatHistory.create({
                userId:req.user._id,
                documentId:document._id,
                messages:[]
            });
        }

        // generate response from geminiService
        const answer = await geminiService.chatWithContext(question, chunks);

        // save conversation to chat history
        chatHistory.messages.push({
            role:'user',
            content:question,
            timestamp:new Date(),
            relevantChunks:[]
        },
        {            role:'assistant',
            content:answer,
            timestamp:new Date(),
            relevantChunks:chunkIndices
        });
        await chatHistory.save();


        res.status(200).json({
            success: true,
            data: {
                question,
                answer,
                relevantChunks: chunkIndices,
                chatHistoryId: chatHistory._id
            },
            message: 'Chat response generated successfully'
        });
    } catch (error) {
        next(error);
    }
};


// @desc    Explain concept
// @route   POST /api/ai/explain-concept
// @access  Private
export const explainConcept = async (req, res, next) => {
    try {

        const { documentId, concept } = req.body;

        if (!documentId || !concept) {
            return res.status(400).json({ success: false, error: 'Document ID and concept are required', statusCode: 400 });
        }


        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready'
        });
        if (!document) {
            return res.status(404).json({ success: false, error: 'Document not found or not ready', statusCode: 404 });
        }

        // find relevant chunks
        const chunks = findRelevantChunks(document.chunks, concept,3);
        const context = chunks.map(c => c.content).join("\n\n");

        // generate explanation from geminiService
        const explanation = await geminiService.explainConcept(concept, context);

        res.status(200).json({
            success: true,
            data: {
                concept,
                explanation,
                relevantChunks: chunks.map(c => c.chunkIndex)
            },
            message: 'Concept explanation generated successfully'
        });

    } catch (error) {
        next(error);
    }

};


// @desc    Get chat history for a document
// @route   GET /api/ai/chat-history/:documentId
// @access  Private
export const getChatHistory = async (req, res, next) => {
    try {
        const { documentId } = req.params;

        if (!documentId) {
            return res.status(400).json({ success: false, error: 'Document ID is required', statusCode: 400 });
        }

        const chatHistory = await ChatHistory.findOne({
            userId: req.user._id,
            documentId: documentId
        });

        if (!chatHistory) {
            return res.status(404).json({ success: false, error: 'Chat history not found', statusCode: 404 });
        }

        res.status(200).json({
            success: true,
            data: chatHistory.messages,
            message: 'Chat history retrieved successfully'
        });
    } catch (error) {
        next(error);
    }
};
