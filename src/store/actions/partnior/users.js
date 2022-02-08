import { define } from "../../../helpers/redux-request";
import Api from "../../../Api";

export const PROFILE = define('PROFILE');

export function getAccount() {
	return PROFILE.request(() => Api.getProfile()).takeLatest();
}

export const LOGIN = define('LOGIN');

export function postLoginRequest(formData) {
	return LOGIN.request(() => Api.login(formData)).takeLatest();
}

export const FORGOT_PASSWORD = define('FORGOT_PASSWORD');

export function postForgotPassword(formData) {
	return FORGOT_PASSWORD.request(() => Api.forgotPassword(formData)).takeLatest();
}

export const CHECK_CODE = define('CHECK_CODE');

export function postCheckCode(formData) {
	return CHECK_CODE.request(() => Api.checkCode(formData)).takeLatest();
}

export const NEW_PASSWORD = define('NEW_PASSWORD');

export function postNewPassword(formData) {
	return NEW_PASSWORD.request(() => Api.newPassword(formData)).takeLatest();
}

export const GET_BRANCHES = define('GET_BRANCHES');

export function getBranches(partnerId) {
	return GET_BRANCHES.request(() => Api.branches(partnerId)).takeLatest();
}

export const USER_TOKEN_DELETE = 'USER_TOKEN_DELETE';

export function deleteToken() {
	return {
		type: USER_TOKEN_DELETE,
		payload: {}
	}
}

export const BACK_TO_FORGOT = 'BACK_TO_FORGOT';

export function backToForgot() {
	return {
		type: BACK_TO_FORGOT,
		payload: {}
	}
}

export const BACK_TO_CHECK = 'BACK_TO_CHECK';

export function backToCheck() {
	return {
		type: BACK_TO_CHECK,
		payload: {}
	}
}

export const DELETE_USER_DATA = 'DELETE_USER_DATA';

export function deleteUserData() {
	return {
		type: DELETE_USER_DATA,
		payload: {}
	}
}

