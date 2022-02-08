import * as clients from "../../actions/partnior/clients";

const initialState = {
	clients: {},
	client: {},
	clientsStatus: '',
	clientStatus: '',
	clientsErr: {},
	createClient: {},
	createClientErr: {},
	updateClient: {},
	updateClientErr: {},
	deleteClient: {},
	deleteClientErr: {},
}

export default function reducer(state = initialState, action) {

	switch ( action.type ) {
		case clients.GET_CLIENTS.REQUEST: {
			return {
				...state,
				clientsStatus: 'request',
			}
		}
		case clients.GET_CLIENTS.SUCCESS: {
			return {
				...state,
				clientsStatus: 'success',
				clients: action.payload.data.data,
				clientsErr: {},
			}
		}
		case clients.GET_CLIENTS.FAIL: {
			const {data} = action.payload;
			return {
				...state,
				clientsStatus: 'fail',
				clientsErr: data.message,
			}
		}

		case clients.GET_CLIENT.REQUEST: {
			return {
				...state,
				clientStatus: 'request',
			}
		}
		case clients.GET_CLIENT.SUCCESS: {
			return {
				...state,
				clientStatus: 'success',
				client: action.payload.data.data,
				clientsErr: {},
			}
		}
		case clients.GET_CLIENT.FAIL: {
			const {data} = action.payload;
			return {
				...state,
				clientStatus: 'fail',
				clientsErr: data.message,
			}
		}

		case clients.CREATE_CLIENT.REQUEST: {
			return {
				...state,
				clientsStatus: 'request',
			}
		}
		case clients.CREATE_CLIENT.SUCCESS: {
			return {
				...state,
				clientsStatus: 'success',
				createClient: action.payload.data,
				createClientErr: {},
			}
		}
		case clients.CREATE_CLIENT.FAIL: {
			const {data} = action.payload;
			return {
				...state,
				clientsStatus: 'fail',
				createClientErr: data.message,
			}
		}

		case clients.UPDATE_CLIENT.REQUEST: {
			return {
				...state,
				clientsStatus: 'request',
			}
		}
		case clients.UPDATE_CLIENT.SUCCESS: {
			return {
				...state,
				clientsStatus: 'success',
				updateClient: action.payload.data,
				updateClientErr: {},
			}
		}
		case clients.UPDATE_CLIENT.FAIL: {
			const {data} = action.payload;
			return {
				...state,
				clientsStatus: 'fail',
				updateClientErr: data.message,
			}
		}

		case clients.DELETE_CLIENT.REQUEST: {
			return {
				...state,
				clientsStatus: 'request',
			}
		}
		case clients.DELETE_CLIENT.SUCCESS: {
			return {
				...state,
				clientsStatus: 'success',
				deleteClient: action.payload.data,
				deleteClientErr: {},
			}
		}
		case clients.DELETE_CLIENT.FAIL: {
			const {data} = action.payload;
			return {
				...state,
				clientsStatus: 'fail',
				deleteClientErr: data.message,
			}
		}

		case clients.DELETE_CLIENT_DATA: {
			return {
				...state,
				createClient: {},
				createClientErr: {},
				updateClient: {},
				updateClientErr: {},
				deleteClient: {},
				deleteClientErr: {},
			}
		}

		default: {
			return state;
		}
	}
}
