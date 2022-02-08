import axios from 'axios';
import Storage from './helpers/Account'
import toFormData from "object-to-formdata";

const {REACT_APP_API_KEY, REACT_APP_API_URL} = process.env;

const api = axios.create({
	baseURL: REACT_APP_API_URL,
});

api.interceptors.request.use((config) => {
	const token = Storage.getToken();
	if (token){
		config.headers.Authorization = token
	}
	config.headers['X-API-KEY'] = REACT_APP_API_KEY;
	return config;
}, (error) => {
	return Promise.reject(error);
})

api.interceptors.response.use((response) => {
	return response;
}, async (error) => {
	const originalRequest = error.config;
	const refreshToken = Storage.getResetToken();
	if (refreshToken && error.response && error.response.status === 401 && !originalRequest._retry){
		originalRequest._retry = true;
		try {
			const res = await api.post("/refresh/token", {refreshToken});
			if (res.status === 200){
				const {data} = res.data;
				Storage.setToken(data?.accessToken);
				window.location.reload();
				return api(originalRequest);
			}
		} catch (_error) {
			return Promise.reject(_error);
		}
	}
	return Promise.reject(error);
});

class Api {
	static url = REACT_APP_API_URL;

	//Partnior
	static getProfile() {
		return api.get(`/partner/profile`);
	}

	static login(formData) {
		return api.post(`/partner/signin`, formData);
	}

	static forgotPassword(formData) {
		return api.post(`/partner/forgot`, formData);
	}

	static checkCode(formData) {
		return api.post(`/partner/forgot/check`, formData);
	}

	static newPassword(formData) {
		return api.post(`/partner/forgot/resetPassword`, formData);
	}

	static branches(partnerId) {
		return api.get(`/partner/branches`, {
			params: {partnerId}
		});
	}

	//Delivery
	static orders(page, branchId, endDate, startDate, address, status, driver) {
		return api.get(`/partner/delivery/orders`, {
			params: {page, branchId, endDate, startDate, address, status, driver}
		});
	}

	static order(id) {
		return api.get(`/partner/delivery/order`, {
			params: {id}
		});
	}

	static postOrder(formData) {
		return api.post(`/partner/delivery/orders`, formData);
	}

	static putOrder(formData) {
		return api.put(`/partner/delivery/orders`, formData);
	}

	static deleteOrder(id) {
		return api.delete(`/partner/delivery/orders/${ id }`);
	}

	//drivers
	static drivers(page, partner, partnerBranch, active, state, type) {
		return api.get(`/partner/branch/drivers`, {
			params: {page, partner, partnerBranch, active, state, type}
		});
	}

	static postMessage(formData) {
		return api.post(`/partner/send/message`, formData);
	}

	static postDriver(formData, uploadProcess) {
		return api.post(`/partner/driver/create`, toFormData.serialize(formData, {indices: true}), {
			onUploadProgress: uploadProcess,
		});
	}

	//client
	static clients(page, branchId) {
		return api.get(`/partner/clients`, {
			params: {page, branchId}
		});
	}

	static client(id) {
		return api.get(`/partner/client`, {
			params: {id}
		});
	}

	static postClient(formData) {
		return api.post(`/partner/client`, formData);
	}

	static putClient(formData) {
		return api.put(`/partner/client`, formData);
	}

	static deleteClient(id) {
		return api.delete(`/partner/client/${ id }`);
	}

	//statistics
	static getStatistics(branchId, toStartDate, fromStartDate, deliveryToStartDate, deliveryFromStartDate) {
		return api.get(`/partner/statistics`, {
			params: {branchId, toStartDate, fromStartDate, deliveryToStartDate, deliveryFromStartDate}
		});
	}
}

export default Api;
