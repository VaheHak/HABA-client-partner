import * as userAction from "../../actions/partnior/users";
import Account from '../../../helpers/Account';

const initialState = {
	requestStatus: '',
	token: Account.getToken(),
	resetToken: Account.getResetToken(),
	errors: {},
	loginData: {},
	profileStatus: '',
	myAccount: {},
	myAccountErrors: {},
	forgotPassword: {},
	forgotPasswordErr: {},
	checkCode: {},
	checkCodeErr: {},
	passwordChanged: {},
	passwordChangedErr: {},
	branches: [],
	branchesErr: {},
}

export default function reducer(state = initialState, action) {

	switch ( action.type ) {
		case userAction.PROFILE.REQUEST: {
			return {
				...state,
				myAccount: {},
				profileStatus: 'request',
			}
		}
		case userAction.PROFILE.SUCCESS: {
			return {
				...state,
				profileStatus: 'success',
				myAccount: action.payload.data.data,
				myAccountErrors: {},
			}
		}
		case userAction.PROFILE.FAIL: {
			const {data} = action.payload;
			return {
				...state,
				profileStatus: 'fail',
				myAccountErrors: data.message,
			}
		}

		case userAction.LOGIN.REQUEST: {
			return {
				...state,
				token: '',
				myAccount: {},
				requestStatus: 'request',
			}
		}
		case userAction.LOGIN.SUCCESS: {
			const {data} = action.payload.data;
			if (data){
				Account.setToken(data['accessToken']);
				Account.setResetToken(data['refreshToken']);
			}
			return {
				...state,
				requestStatus: 'success',
				token: data !== null && data['accessToken'] ? data['accessToken'] : '',
				resetToken: data !== null && data['refreshToken'] ? data['refreshToken'] : '',
				loginData: action.payload.data,
				errors: '',
			}
		}
		case userAction.LOGIN.FAIL: {
			const {data} = action.payload;
			if (data.message.phoneNumber){
				return {
					...state,
					requestStatus: 'fail',
					errors: data.message,
				}
			} else{
				return {
					...state,
					requestStatus: 'fail',
					errors: {
						message: data.message
					}
				}
			}
		}

		case userAction.FORGOT_PASSWORD.REQUEST: {
			return {
				...state,
				requestStatus: 'request',
				forgotPasswordErr: {},
			}
		}
		case userAction.FORGOT_PASSWORD.SUCCESS: {
			const {data} = action.payload;
			return {
				...state,
				requestStatus: 'success',
				forgotPassword: data,
			}
		}
		case userAction.FORGOT_PASSWORD.FAIL: {
			const {message} = action.payload.data;
			return {
				...state,
				requestStatus: 'fail',
				forgotPasswordErr: message
			}
		}

		case userAction.CHECK_CODE.REQUEST: {
			return {
				...state,
				requestStatus: 'request',
				checkCodeErr: {},
			}
		}
		case userAction.CHECK_CODE.SUCCESS: {
			const {data} = action.payload;
			return {
				...state,
				requestStatus: 'success',
				checkCode: data,
			}
		}
		case userAction.CHECK_CODE.FAIL: {
			const {message} = action.payload.data;
			return {
				...state,
				requestStatus: 'fail',
				checkCodeErr: message
			}
		}

		case userAction.NEW_PASSWORD.REQUEST: {
			return {
				...state,
				requestStatus: 'request',
				passwordChangedErr: {},
			}
		}
		case userAction.NEW_PASSWORD.SUCCESS: {
			const {data} = action.payload;
			return {
				...state,
				requestStatus: 'success',
				passwordChanged: data,
			}
		}
		case userAction.NEW_PASSWORD.FAIL: {
			const {message} = action.payload.data;
			return {
				...state,
				requestStatus: 'fail',
				passwordChangedErr: message
			}
		}

		case userAction.GET_BRANCHES.REQUEST: {
			return {
				...state,
				branchesStatus: 'request',
			}
		}
		case userAction.GET_BRANCHES.SUCCESS: {
			return {
				...state,
				branchesStatus: 'success',
				branches: action.payload.data.data,
				branchesErr: {},
			}
		}
		case userAction.GET_BRANCHES.FAIL: {
			const {data} = action.payload;
			return {
				...state,
				branchesStatus: 'fail',
				branchesErr: data.message,
			}
		}

		case userAction.USER_TOKEN_DELETE: {
			Account.delete();
			return {
				...state,
				token: '',
				resetToken: '',
			}
		}

		case userAction.BACK_TO_FORGOT: {
			return {
				...state,
				forgotPassword: {},
				forgotPasswordErr: {},
			}
		}

		case userAction.BACK_TO_CHECK: {
			return {
				...state,
				checkCode: {},
				checkCodeErr: {},
				forgotPassword: {},
				forgotPasswordErr: {},
			}
		}

		case userAction.DELETE_USER_DATA: {
			return {
				...state,
				loginData: {},
				checkCode: {},
				checkCodeErr: {},
				forgotPassword: {},
				forgotPasswordErr: {},
				passwordChanged: {},
				passwordChangedErr: {},
			}
		}

		default: {
			return state;
		}
	}
}
