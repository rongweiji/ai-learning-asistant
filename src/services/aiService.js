import axiosInstance from "../utils/axioInstance";
import { API_PATHS } from "../utils/apiPaths";

const formatError = (error) => {
	const msg = error?.response?.data?.error || error?.message || "Request failed";
	const status = error?.response?.status;
	const err = new Error(msg);
	if (status) err.status = status;
	return err;
};

const generateFlashcards = async (documentId, options) => {
	try {
		const res = await axiosInstance.post(API_PATHS.AI.GENERATE_FLASHCARDS, {
			documentId,
			...options,
		});
		return res.data;
	} catch (error) {
		throw formatError(error);
	}
};

const generateQuiz = async (documentId, options ) => {
	try {
		const res = await axiosInstance.post(API_PATHS.AI.GENERATE_QUIZ, {
			documentId,
			...options,
		});
		return res.data;
	} catch (error) {
		throw formatError(error);
	}
};

const generateSummary = async (documentId) => {
	try {
		const res = await axiosInstance.post(API_PATHS.AI.GENERATE_SUMMARY, {
			documentId,
	
		});
		return res.data;
	} catch (error) {
		throw formatError(error);
	}
};

const chat = async (documentId, message) => {
	try {
		const res = await axiosInstance.post(API_PATHS.AI.CHAT, {
			documentId,
			question: message,
	
		});
		return res.data;
	} catch (error) {
		throw formatError(error);
	}
};

const explainConcept = async (documentId, concept) => {
	try {
		const res = await axiosInstance.post(API_PATHS.AI.EXPLAIN_CONCEPT, {
			documentId,
			concept,
	
		});
		return res.data;
	} catch (error) {
		throw formatError(error);
	}
};

const getChatHistory = async (documentId) => {
	try {
		const res = await axiosInstance.get(API_PATHS.AI.GET_CHAT_HISTORY(documentId));
		return res.data;
	} catch (error) {
		throw formatError(error);
	}
};

const aiService = {
	generateFlashcards,
	generateQuiz,
	generateSummary,
	chat,
	explainConcept,
	getChatHistory,
};

export default aiService;
