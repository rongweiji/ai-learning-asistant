import axiosInstance from "../utils/axioInstance";
import { API_PATHS } from "../utils/apiPaths";

const formatError = (error) => {
	const msg = error?.response?.data?.error || error?.message || "Request failed";
	const status = error?.response?.status;
	const err = new Error(msg);
	if (status) err.status = status;
	return err;
};

const getAllFlashcardSets = async () => {
	try {
		const res = await axiosInstance.get(API_PATHS.FLASHCARDS.GET_ALL_FLASHCARD_SETS);
		return res.data;
	} catch (error) {
		throw formatError(error);
	}
};

const getFlashcardsForDocument = async (documentId) => {
	try {
		const res = await axiosInstance.get(API_PATHS.FLASHCARDS.GET_FLASHCARD_FOR_DOCUMENT(documentId));
		return res.data;
	} catch (error) {
		throw formatError(error);
	}
};

const reviewFlashcard = async (cardId,cardIndex) => {
	try {
		const res = await axiosInstance.post(API_PATHS.FLASHCARDS.REVIEW_FLASHCARD(cardId,{cardIndex}));
		return res.data;
	} catch (error) {
		throw formatError(error);
	}
};

const toggleStarFlashcard = async (cardId) => {
	try {
		const res = await axiosInstance.post(API_PATHS.FLASHCARDS.TOGGLE_STAR(cardId));
		return res.data;
	} catch (error) {
		throw formatError(error);
	}
};

const deleteFlashcardSet = async (id) => {
	try {
		const res = await axiosInstance.delete(API_PATHS.FLASHCARDS.DELETE_FLASHCARD_SET(id));
		return res.data;
	} catch (error) {
		throw formatError(error);
	}
};

const flashcardService = {
	getAllFlashcardSets,
	getFlashcardsForDocument,
	reviewFlashcard,
	toggleStarFlashcard,
	deleteFlashcardSet,
};

export default flashcardService;
