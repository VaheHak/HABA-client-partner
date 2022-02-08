import * as deliveryAction from "../../actions/partnior/delivery";
import { NEW_STATUS } from "../../actions/socket";
import _ from "lodash";

const initialState = {
	orderStatus: '',
	orders: [],
	ordersErr: {},
	order: {},
	orderErr: {},
	createStatus: '',
	createOrder: [],
	createOrderErr: {},
	updateStatus: '',
	updateOrder: [],
	updateOrderErr: {},
	deleteStatus: '',
	deleteOrder: [],
	deleteOrderErr: {},
	created: [],
	pending: [],
	took: [],
	done: [],
	createdData: {},
	pendingData: {},
	tookData: {},
	doneData: {},
	createdStatus: '',
	pendingStatus: '',
	tookStatus: '',
	doneStatus: '',
}

export default function reducer(state = initialState, action) {

	switch ( action.type ) {
		case NEW_STATUS: {
			const oldCreated = state.created;
			const oldPending = state.pending;
			const oldTook = state.took;
			const oldDone = state.done;

			const s = +action?.payload?.status;

			const newCreated = oldCreated.filter((item) => +item.id !== +action?.payload?.id);
			const newPending = oldPending.filter((item) => +item.id !== +action?.payload?.id);
			const newTook = oldTook.filter((item) => +item.id !== +action?.payload?.id);
			const newDone = oldDone.filter((item) => +item.id !== +action?.payload?.id);

			return {
				...state,
				created: s === 0 ? [action.payload, ...newCreated] : newCreated,
				pending: s === 1 ? [action.payload, ...newPending] : newPending,
				took: s === 2 ? [action.payload, ...newTook] : newTook,
				done: s === 3 ? [action.payload, ...newDone] : newDone,
			}
		}

		case deliveryAction.GET_ORDERS_CREATED.REQUEST: {
			return {
				...state,
				createdStatus: 'request',
			}
		}
		case deliveryAction.GET_ORDERS_CREATED.SUCCESS: {
			return {
				...state,
				createdStatus: 'success',
				created: +action.payload.data.data.currentPage === 1 ? action.payload.data.data.array :
					_.uniqBy([...state.created, ...action.payload.data.data.array || []], "id"),
				createdData: action.payload.data.data,
				ordersErr: {},
			}
		}
		case deliveryAction.GET_ORDERS_CREATED.FAIL: {
			const {data} = action.payload;
			return {
				...state,
				createdStatus: 'fail',
				ordersErr: data.message,
			}
		}

		case deliveryAction.GET_ORDERS_PENDING.REQUEST: {
			return {
				...state,
				pendingStatus: 'request',
			}
		}
		case deliveryAction.GET_ORDERS_PENDING.SUCCESS: {
			return {
				...state,
				pendingStatus: 'success',
				pending: +action.payload.data.data.currentPage === 1 ? action.payload.data.data.array :
					_.uniqBy([...state.pending, ...action.payload.data.data.array || []], "id"),
				pendingData: action.payload.data.data,
				ordersErr: {},
			}
		}
		case deliveryAction.GET_ORDERS_PENDING.FAIL: {
			const {data} = action.payload;
			return {
				...state,
				pendingStatus: 'fail',
				ordersErr: data.message,
			}
		}

		case deliveryAction.GET_ORDERS_TOOK.REQUEST: {
			return {
				...state,
				tookStatus: 'request',
			}
		}
		case deliveryAction.GET_ORDERS_TOOK.SUCCESS: {
			return {
				...state,
				tookStatus: 'success',
				took: +action.payload.data.data.currentPage === 1 ? action.payload.data.data.array :
					_.uniqBy([...state.took, ...action.payload.data.data.array || []], "id"),
				tookData: action.payload.data.data,
				ordersErr: {},
			}
		}
		case deliveryAction.GET_ORDERS_TOOK.FAIL: {
			const {data} = action.payload;
			return {
				...state,
				tookStatus: 'fail',
				ordersErr: data.message,
			}
		}

		case deliveryAction.GET_ORDERS_DONE.REQUEST: {
			return {
				...state,
				doneStatus: 'request',
			}
		}
		case deliveryAction.GET_ORDERS_DONE.SUCCESS: {
			return {
				...state,
				doneStatus: 'success',
				done: +action.payload.data.data.currentPage === 1 ? action.payload.data.data.array :
					_.uniqBy([...state.done, ...action.payload.data.data.array || []], "id"),
				doneData: action.payload.data.data,
				ordersErr: {},
			}
		}
		case deliveryAction.GET_ORDERS_DONE.FAIL: {
			const {data} = action.payload;
			return {
				...state,
				deleteStatus: 'fail',
				ordersErr: data.message,
			}
		}

		case deliveryAction.GET_ORDERS.REQUEST: {
			return {
				...state,
				orderStatus: 'request',
			}
		}
		case deliveryAction.GET_ORDERS.SUCCESS: {
			return {
				...state,
				orderStatus: 'success',
				orders: action.payload.data.data,
				ordersErr: {},
			}
		}
		case deliveryAction.GET_ORDERS.FAIL: {
			const {data} = action.payload;
			return {
				...state,
				orderStatus: 'fail',
				ordersErr: data.message,
			}
		}

		case deliveryAction.GET_ORDER.REQUEST: {
			return {
				...state,
				orderStatus: 'request',
			}
		}
		case deliveryAction.GET_ORDER.SUCCESS: {
			return {
				...state,
				orderStatus: 'success',
				order: action.payload.data.data,
				orderErr: {},
			}
		}
		case deliveryAction.GET_ORDER.FAIL: {
			const {data} = action.payload;
			return {
				...state,
				orderStatus: 'fail',
				orderErr: data.message,
			}
		}

		case deliveryAction.CREATE_ORDER.REQUEST: {
			return {
				...state,
				createStatus: 'request',
			}
		}
		case deliveryAction.CREATE_ORDER.SUCCESS: {
			return {
				...state,
				createStatus: 'success',
				createOrder: action.payload.data,
				createOrderErr: {},
			}
		}
		case deliveryAction.CREATE_ORDER.FAIL: {
			const {data} = action.payload;
			return {
				...state,
				createStatus: 'fail',
				createOrderErr: data.message,
			}
		}

		case deliveryAction.UPDATE_ORDER.REQUEST: {
			return {
				...state,
				updateStatus: 'request',
			}
		}
		case deliveryAction.UPDATE_ORDER.SUCCESS: {
			return {
				...state,
				updateStatus: 'success',
				updateOrder: action.payload.data,
				updateOrderErr: {},
			}
		}
		case deliveryAction.UPDATE_ORDER.FAIL: {
			const {data} = action.payload;
			return {
				...state,
				updateStatus: 'fail',
				updateOrderErr: data.message,
			}
		}

		case deliveryAction.DELETE_ORDER.REQUEST: {
			return {
				...state,
				deleteStatus: 'request',
			}
		}
		case deliveryAction.DELETE_ORDER.SUCCESS: {
			return {
				...state,
				deleteStatus: 'success',
				deleteOrder: action.payload.data,
				deleteOrderErr: {},
			}
		}
		case deliveryAction.DELETE_ORDER.FAIL: {
			const {data} = action.payload;
			return {
				...state,
				deleteStatus: 'fail',
				deleteOrderErr: data.message,
			}
		}

		case deliveryAction.DELETE_DELIVERY_DATA: {
			return {
				...state,
				ordersErr: {},
				createStatus: '',
				createOrder: [],
				createOrderErr: {},
				updateStatus: '',
				updateOrder: [],
				updateOrderErr: {},
				deleteStatus: '',
				deleteOrder: [],
				deleteOrderErr: {},
			}
		}

		default: {
			return state;
		}
	}
}
