import axiosInstance from "../utils/axioInstance";
import { API_PATHS } from "../utils/apiPaths";

const formatError = (error) => {
	const msg = error?.response?.data?.error || error?.message || "Request failed";
	const status = error?.response?.status;
	const err = new Error(msg);
	if (status) err.status = status;
	return err;
};

const getQuizzesForDocument = async (documentId) => {
	try {
		const res = await axiosInstance.get(API_PATHS.QUIZZES.GET_QUIZZES_FOR_DOCUMENT(documentId));
		return res.data;
	} catch (error) {
		throw formatError(error);
	}
};

const getQuizById = async (id) => {
	try {
		const res = await axiosInstance.get(API_PATHS.QUIZZES.GET_QUIZ_BY_ID(id));
		return res.data;
	} catch (error) {
		throw formatError(error);
	}
};

const submitQuiz = async (id, answers) => {
	try {
		const res = await axiosInstance.post(API_PATHS.QUIZZES.SUBMIT_QUIZ(id), { answers });
		return res.data;
	} catch (error) {
		throw formatError(error);
	}
};

const getQuizResults = async (id) => {
	try {
		const res = await axiosInstance.get(API_PATHS.QUIZZES.GET_QUIZ_RESULTS(id));
		return res.data;
	} catch (error) {
		throw formatError(error);
	}
};

const deleteQuiz = async (id) => {
	try {
		const res = await axiosInstance.delete(API_PATHS.QUIZZES.DELETE_QUIZ(id));
		return res.data;
	} catch (error) {
		throw formatError(error);
	}
};

const quizService = {
	getQuizzesForDocument,
	getQuizById,
	submitQuiz,
	getQuizResults,
	deleteQuiz,
};

export default quizService;
