import axiosInstance from "../utils/axioInstance";
import { API_PATHS } from "../utils/apiPaths";

const formatError = (error) => {
	const msg = error?.response?.data?.error || error?.message || "Request failed";
	const status = error?.response?.status;
	const err = new Error(msg);
	if (status) err.status = status;
	return err;
};

const register = async (username, email, password) => {
	try {
		const res = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
			username,
			email,
			password,
		});
		return res.data;
	} catch (error) {
		throw formatError(error);
	}
};

const login = async (email, password) => {
	try {
		const res = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
			email,
			password,
		});
		return res.data;
	} catch (error) {
		throw formatError(error);
	}
};

const getProfile = async () => {
	try {
		const res = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
		return res.data;
	} catch (error) {
		throw formatError(error);
	}
};

const updateProfile = async (profileUpdates) => {
	try {
		const res = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, profileUpdates);
		return res.data;
	} catch (error) {
		throw formatError(error);
	}
};

const changePassword = async (passwords) => {
	try {
		const res = await axiosInstance.post(API_PATHS.AUTH.CHANGE_PASSWORD, passwords);
		return res.data;
	} catch (error) {
		throw formatError(error);
	}
};



const authService = {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,
 
};
export default authService;