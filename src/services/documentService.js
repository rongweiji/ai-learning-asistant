import axiosInstance from "../utils/axioInstance";
import { API_PATHS } from "../utils/apiPaths";

const formatError = (error) => {
	const msg = error?.response?.data?.error || error?.message || "Request failed";
	const status = error?.response?.status;
	const err = new Error(msg);
	if (status) err.status = status;
	return err;
};

const uploadDocument = async (formData) => {
	try {
		const res = await axiosInstance.post(API_PATHS.DOCUMENTS.UPLOAD, formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		return res.data;
	} catch (error) {
		throw formatError(error);
	}
};

const getDocuments = async () => {
	try {
		const res = await axiosInstance.get(API_PATHS.DOCUMENTS.GET_DOCUMENTS);
		return res.data;
	} catch (error) {
		throw formatError(error);
	}
};

const getDocumentById = async (id) => {
	try {
		const res = await axiosInstance.get(API_PATHS.DOCUMENTS.GET_DOCUMENT_BY_ID(id));
		return res.data;
	} catch (error) {
		throw formatError(error);
	}
};


const deleteDocument = async (id) => {
	try {
		const res = await axiosInstance.delete(API_PATHS.DOCUMENTS.DELETE_DOCUMENT(id));
		return res.data;
	} catch (error) {
		throw formatError(error);
	}
};

const documentService = {
	uploadDocument,
	getDocuments,
	getDocumentById,
	deleteDocument,
};

export default documentService;
