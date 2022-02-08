import { define } from "../../../helpers/redux-request";
import Api from "../../../Api";

export const GET_CLIENTS = define('GET_CLIENTS');

export function getClients(branchId, page) {
	return GET_CLIENTS.request(() => Api.clients(page, branchId)).takeLatest();
}

export const GET_CLIENT = define('GET_CLIENT');

export function getClient(id) {
	return GET_CLIENT.request(() => Api.client(id)).takeLatest();
}

export const CREATE_CLIENT = define('CREATE_CLIENT');

export function createClient(formData) {
	return CREATE_CLIENT.request(() => Api.postClient(formData)).takeLatest();
}

export const UPDATE_CLIENT = define('UPDATE_CLIENT');

export function updateClient(formData) {
	return UPDATE_CLIENT.request(() => Api.putClient(formData)).takeLatest();
}

export const DELETE_CLIENT = define('DELETE_CLIENT');

export function deleteClient(id) {
	return DELETE_CLIENT.request(() => Api.deleteClient(id)).takeLatest();
}

export const DELETE_CLIENT_DATA = 'DELETE_CLIENT_DATA';

export function deleteClientData() {
	return {
		type: DELETE_CLIENT_DATA, payload: {}
	}
}

