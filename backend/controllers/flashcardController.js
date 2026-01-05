import Flashcard from "../models/Flashcard.js";

// @desc    get all flashcards for a document
// @route   GET /api/flashcards/:documentId
// @access  Private
export const getFlashcards = async (req, res, next) => {
    try {
     
        const flashcards = await Flashcard.find({
            userId: req.user._id,
            documentId: req.params.documentId
        }).populate('documentId', 'title filename').sort

        res.status(200).json({
            success: true,
            count: flashcards.length,
            data: flashcards,
        });
    }catch (error) {
        next(error);
    }
}


// @desc    get all flashcard sets for  a user
// @route   GET /api/flashcards/
// @access  Private
export const getAllFlashcardSets = async (req, res, next) => {
    try {

        const flashcardSets = await Flashcard.find({
            userId: req.user._id,
        }).populate('documentId', 'title').sort({ createdAt: -1  });

        res.status(200).json({
            success: true,
            count: flashcardSets.length,
            data: flashcardSets,
        });
    }catch (error) {
        next(error);
    }

}


// @desc    mark flashcard as reviewed
// @route   POST /api/flashcards/:cardId/review
// @access  Private

export const reviewFlashcards = async (req, res, next) => {  try {
    const flashcard = await Flashcard.findOne({
        'cards._id': req.params.cardId,
        userId: req.user._id
    });

    if (!flashcard) {
        return res.status(404).json({ success: false, error: 'Flashcard not found', statusCode: 404 });
    }

    const cardIndex= flashcard.cards.findIndex(card => card._id.toString() === req.params.cardId);

    if (cardIndex === -1) {
        return res.status(404).json({ success: false, error: 'Card not found in flashcard set', statusCode: 404 });
    }
    //update review infor
    flashcard.cards[cardIndex].lastReviewed=Date.now();
    flashcard.cards[cardIndex].reviewCount+=1;

    await flashcard.save();
    res.status(200).json({
        success: true,
        data: flashcard,
        message: 'Flashcard reviewed successfully'
    });

    }catch (error) {
        next(error);
    }
}


// @desc    toggle star on flashcard
// @route   POST /api/flashcards/:cardId/star
// @access  Private
export const toggleStarFlashcard = async (req, res, next) => {
    try {
       const flashcardSet= await Flashcard.findOne({
        'cards._id': req.params.cardId,
        userId: req.user._id
         });
        if (!flashcardSet) {
            return res.status(404).json({ success: false, error: 'Flashcard not found', statusCode: 404 });
        }

        const cardIndex= flashcardSet.cards.findIndex(card => card._id.toString() === req.params.cardId);

        if (cardIndex === -1) {
            return res.status(404).json({ success: false, error: 'Card not found in flashcard set', statusCode: 404 });
        }


        //toggle star
        flashcardSet.cards[cardIndex].isStarred = !flashcardSet.cards[cardIndex].isStarred;

        await flashcardSet.save();
        res.status(200).json({
            success: true,
            data: flashcardSet,
            message: 'Flashcard star status toggled successfully'
        });
    }
    catch (error) {
        next(error);
    }

};

// @desc    delete flashcard set
// @route   DELETE /api/flashcards/:Id
// @access  Private
export const deleteFlashcardSet = async (req, res, next) => {

    try {
       const flashcardSet= await Flashcard.findOne({
        _id: req.params.id,
        userId: req.user._id
         });

        if (!flashcardSet) {
            return res.status(404).json({ success: false, error: 'Flashcard set not found', statusCode: 404 });
        }
        await flashcardSet.deleteOne();
        res.status(200).json({
            success: true,
            message: 'Flashcard set deleted successfully'
        });
    }

    catch (error) {
        next(error);
    }
};


