import * as driver from "../../actions/partnior/driver";
import { NEW_COORDS, SOCKET_ACTIVE_DRIVERS } from "../../actions/socket";
import _ from "lodash";

const initialState = {
	drivers: {},
	driversData: {},
	driversStatus: '',
	driversErr: {},
	onlineDrivers: [],
	coordsList: [],
	messageStatus: '',
	message: {},
	messageErr: {},
	driverCreate: {},
	driverCreateErr: {},
}

export default function reducer(state = initialState, action) {

	switch ( action.type ) {
		case SOCKET_ACTIVE_DRIVERS: {
			return {
				...state,
				onlineDrivers: _.uniq(action.payload.drivers),
			}
		}

		case driver.GET_DRIVERS.REQUEST: {
			return {
				...state,
				driversStatus: 'request',
			}
		}
		case driver.GET_DRIVERS.SUCCESS: {
			return {
				...state,
				driversStatus: 'success',
				drivers: action.payload.data.data,
				driversErr: {},
			}
		}
		case driver.GET_DRIVERS.FAIL: {
			const {data} = action.payload;
			return {
				...state,
				driversStatus: 'fail',
				driversErr: data.message,
			}
		}

		case NEW_COORDS: {
			const oldCoords = state.coordsList;
			const newCoords = oldCoords.filter((item) => +item.driverId !== +action?.payload?.driverId)
			return {
				...state,
				coordsList: [...newCoords, action.payload],
			}
		}

		case driver.SEND_MESSAGE.REQUEST: {
			return {
				...state,
				messageStatus: 'request',
			}
		}
		case driver.SEND_MESSAGE.SUCCESS: {
			return {
				...state,
				messageStatus: 'success',
				message: action.payload.data,
				messageErr: {},
			}
		}
		case driver.SEND_MESSAGE.FAIL: {
			const {data} = action.payload;
			return {
				...state,
				messageStatus: 'fail',
				messageErr: data.message,
			}
		}

		case driver.POST_DRIVER.REQUEST: {
			return {
				...state,
				driversStatus: 'request',
			}
		}
		case driver.POST_DRIVER.SUCCESS: {
			return {
				...state,
				driversStatus: 'success',
				driverCreate: action.payload.data,
				driverCreateErr: {},
			}
		}
		case driver.POST_DRIVER.FAIL: {
			const {data} = action.payload;
			return {
				...state,
				driversStatus: 'fail',
				driverCreateErr: data.message,
			}
		}

		case driver.DELETE_DRIVER_DATA: {
			return {
				...state,
				message: {},
				messageErr: '',
				driverCreate: {},
				driverCreateErr: {},
			}
		}

		default: {
			return state;
		}
	}
}
