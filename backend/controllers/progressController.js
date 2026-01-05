import Document from "../models/Document.js";
import Flashcard from "../models/Flashcard.js";
import Quiz from "../models/Quiz.js";

// @desc    Get user learning statisc show on dashboard
// @route   GET /api/progress/stats
// @access  Private
export const getDashboard = async (req, res, next) => {
    try {

        const userId = req.user._id;

        //get counts 
        const totalDocuments = await Document.countDocuments({ userId });
        const totalFlashcardSets = await Flashcard.countDocuments({ userId });
        const totalQuizzes = await Quiz.countDocuments({ userId });
        const completedQuizzes = await Quiz.countDocuments({ userId, completedAt: { $ne: null } });

        // get flashcard statistics
        const flashcardSets = await Flashcard.find({ userId });
        let totalFlashcardsReviewed = 0;
        let totalFlashcards = 0;
        let staredFlashcards = 0;

        flashcardSets.forEach(set => {
            totalFlashcards += set.cards.length;
            totalFlashcardsReviewed += set.cards.filter(card => card.reviewCount > 0).length;
            staredFlashcards += set.cards.filter(card => card.isStarted).length;
        });

        // get the quiz statistics

        const quizzes = await Quiz.find({ userId, completedAt: { $ne: null } });
        const averageScore = quizzes.length > 0 ? Math.round((quizzes.reduce((sum, quiz) => sum + quiz.score, 0) / quizzes.length) * 100) / 100 : 0;

        // recent activities
        const recentDocuments = await Document.find({ userId }).sort({ lastAccessed: -1 }).limit(5).select('title filename lastAccessed status');

        const recentQuizzes = await Quiz.find({ userId }).sort({ createdAt: -1 }).limit(5).populate('documentId', 'title').select('title score totalQuestions completedAt');

        // study break ( simplifie - in produce , trakc daily activite )
        const studyStrea = Math.floor(Math.random() * 30); // days

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalDocuments,
                    totalFlashcardSets,
                    totalFlashcards,
                    totalFlashcardsReviewed,
                    staredFlashcards,
                    totalQuizzes,
                    completedQuizzes,
                    averageScore,
                    studyStrea
                },
                recentActivities: {
                    documents: recentDocuments,
                    quizzes: recentQuizzes
                }
            },
        });
    } catch (error) {
        next(error);
    }


}