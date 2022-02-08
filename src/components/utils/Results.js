import React, { Component } from 'react';
import ResInfo from "./ResInfo";
import { connect } from "react-redux";
import { deleteUserData } from "../../store/actions/partnior/users";
import ErrorEnum from "../../helpers/ErrorHandler";
import { withRouter } from "react-router-dom";
import { deleteDeliveryData } from "../../store/actions/partnior/delivery";
import { deleteClientData } from "../../store/actions/partnior/clients";
import { deleteDriverData } from "../../store/actions/partnior/driver";

class Results extends Component {

	render() {
		const {
			deleteUserData, deleteDeliveryData, deleteClientData, deleteDriverData,
			forgotPassword, passwordChanged, loginData, createOrder, updateOrder, deleteOrder, createClient, updateClient,
			deleteClient, message, driverCreate,
		} = this.props;

		return (
			<>
				<ResInfo value={ loginData.message && loginData.status === false ? 'on' : null }
				         successFunc={ deleteUserData } res={ loginData.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[loginData.message] ? ErrorEnum[loginData.message] : loginData.message }/>
				<ResInfo value={ forgotPassword.message && forgotPassword.status === false ? 'on' : null }
				         successFunc={ deleteUserData } res={ forgotPassword.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[forgotPassword.message] ? ErrorEnum[forgotPassword.message] : forgotPassword.message }/>
				<ResInfo value={ passwordChanged.message ? 'on' : null } successFunc={ deleteUserData }
				         res={ passwordChanged.status === true ? 'success' : passwordChanged.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[passwordChanged.message] ? ErrorEnum[passwordChanged.message] : passwordChanged.message }/>
				<ResInfo value={ createOrder.message ? 'on' : null } successFunc={ deleteDeliveryData }
				         res={ createOrder.status === true ? 'success' : createOrder.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[createOrder.message] ? ErrorEnum[createOrder.message] : createOrder.message }/>
				<ResInfo value={ updateOrder.message ? 'on' : null } successFunc={ deleteDeliveryData }
				         res={ updateOrder.status === true ? 'success' : updateOrder.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[updateOrder.message] ? ErrorEnum[updateOrder.message] : updateOrder.message }/>
				<ResInfo value={ deleteOrder.message ? 'on' : null } successFunc={ deleteDeliveryData }
				         res={ deleteOrder.status === true ? 'success' : deleteOrder.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[deleteOrder.message] ? ErrorEnum[deleteOrder.message] : deleteOrder.message }/>
				<ResInfo value={ createClient.message ? 'on' : null } successFunc={ deleteClientData }
				         res={ createClient.status === true ? 'success' : createClient.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[createClient.message] ? ErrorEnum[createClient.message] : createClient.message }/>
				<ResInfo value={ updateClient.message ? 'on' : null } successFunc={ deleteClientData }
				         res={ updateClient.status === true ? 'success' : updateClient.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[updateClient.message] ? ErrorEnum[updateClient.message] : updateClient.message }/>
				<ResInfo value={ deleteClient.message ? 'on' : null } successFunc={ deleteClientData }
				         res={ deleteClient.status === true ? 'success' : deleteClient.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[deleteClient.message] ? ErrorEnum[deleteClient.message] : deleteClient.message }/>
				<ResInfo value={ message.message ? 'on' : null } successFunc={ deleteDriverData }
				         res={ message.status === true ? 'success' : message.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[message.message] ? ErrorEnum[message.message] : message.message }/>
				<ResInfo value={ driverCreate.message ? 'on' : null } successFunc={ deleteDriverData }
				         res={ driverCreate.status === true ? 'success' : driverCreate.status === false ? 'error' : "info" }
				         msg={ ErrorEnum[driverCreate.message] ? ErrorEnum[driverCreate.message] : driverCreate.message }/>
			</>
		);
	}
}

const mapStateToProps = (state) => ({
	loginData: state.users.loginData,
	forgotPassword: state.users.forgotPassword,
	passwordChanged: state.users.passwordChanged,
	createOrder: state.delivery.createOrder,
	updateOrder: state.delivery.updateOrder,
	deleteOrder: state.delivery.deleteOrder,
	createClient: state.clients.createClient,
	updateClient: state.clients.updateClient,
	deleteClient: state.clients.deleteClient,
	message: state.driver.message,
	driverCreate: state.driver.driverCreate,
})

const mapDispatchToProps = {
	deleteUserData,
	deleteDeliveryData,
	deleteClientData,
	deleteDriverData,
}

const ResultsContainer = connect(
	mapStateToProps,
	mapDispatchToProps,
)(Results)

export default withRouter(ResultsContainer);
