import socket from "socket.io-client";
import Api from "../../Api";
import {
	getCreatedOrders, getDoneOrders, getPendingOrders, getTookOrders
} from "./partnior/delivery";

let io;
export const NEW_STATUS = "NEW_STATUS";
export const SOCKET_ACTIVE_DRIVERS = "SOCKET_ACTIVE_DRIVERS";
export const NEW_COORDS = "NEW_COORDS"

export function socketInit(token) {
	return (dispatch) => {
		if (io){
			return;
		}
		io = socket(Api.url, {
			extraHeaders: {Authorization: `Bearer ${ token }`},
			withCredentials: true,
			autoConnect: true,
			pingInterval: 25000,
			pingTimeout: 180000,
			reconnection: true,
			reconnectionDelay: 1000,
			reconnectionDelayMax: 10000,
			reconnectionAttempts: 5,
			secure: true,
			path: '/socket.io',
		});

		io.on('unauthorized', (error, callback) => {
			if (error.data.type === 'UnauthorizedError' || error.data.code === 'invalid_token'){
				callback();
				console.log('User token has expired');
			}
		});

		io.on('partner-drivers', (drivers) => {
			dispatch({
				type: SOCKET_ACTIVE_DRIVERS,
				payload: {drivers},
			})
		});

		io.on('new-status', (data) => {
			dispatch(getCreatedOrders(data?.partnerBranchId, 1, void 0, void 0, void 0, 0));
			dispatch(getPendingOrders(data?.partnerBranchId, 1, void 0, void 0, void 0, 1));
			dispatch(getTookOrders(data?.partnerBranchId, 1, void 0, void 0, void 0, 2));
			dispatch(getDoneOrders(data?.partnerBranchId, 1, void 0, void 0, void 0, 3));
			dispatch({
				type: NEW_STATUS,
				payload: data,
			})
		})

		io.on('new-coords', (data) => {
			dispatch({
				type: NEW_COORDS,
				payload: data,
			})
		})
	}
}
