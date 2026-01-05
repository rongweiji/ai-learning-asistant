import axiosInstance from "../utils/axioInstance";
import { API_PATHS } from "../utils/apiPaths";

const formatError = (error) => {
	const msg = error?.response?.data?.error || error?.message || "Request failed";
	const status = error?.response?.status;
	const err = new Error(msg);
	if (status) err.status = status;
	return err;
};

const getDashboard = async () => {
	try {
		const res = await axiosInstance.get(API_PATHS.PROGRESS.GET_DASHBOARD);
		return res.data;
	} catch (error) {
		throw formatError(error);
	}
};

const progressService = {
	getDashboard,
};

export default progressService;
