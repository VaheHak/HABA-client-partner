import { define } from "../../../helpers/redux-request";
import Api from "../../../Api";

export const GET_DRIVERS = define('GET_DRIVERS');

export function getDrivers(page, partner, partnerBranch, active, state, type) {
	return GET_DRIVERS.request(() => Api.drivers(page, partner, partnerBranch, active, state, type)).takeLatest();
}

export const SEND_MESSAGE = define('SEND_MESSAGE');

export function sendMessage(formData) {
	return SEND_MESSAGE.request(() => Api.postMessage(formData)).takeLatest();
}

export const POST_DRIVER = define('POST_DRIVER');

export function createDriver(formData, uploadProcess, cb) {
	return POST_DRIVER.request(() => Api.postDriver(formData, uploadProcess, cb)).takeLatest();
}

export const DELETE_DRIVER_DATA = 'DELETE_DRIVER_DATA';

export function deleteDriverData() {
	return {
		type: DELETE_DRIVER_DATA, payload: {}
	}
}
