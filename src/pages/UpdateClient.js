import React, { Component } from 'react';
import Wrapper from "../../src/components/Wrapper";
import UserHeader from "../../src/components/UserHeader";
import _ from "lodash";
import '../../src/assets/css/pages/historyDetails.css'
import { withRouter } from "react-router-dom";
import { Email, LocationOn, Person, Phone, } from "@material-ui/icons";
import { connect } from "react-redux";
import { Button } from "@mui/material";
import t from "../helpers/transletor";
import DriverMap from "../components/map/DriverMap";
import { deleteClient, getClient, updateClient } from "../store/actions/partnior/clients";
import Input from "../components/form/Input";
import PhoneInput from "../components/form/PhoneInput";
import ErrorEnum from "../helpers/ErrorHandler";
import ModalButton from "../components/modals/modal";

class UpdateClient extends Component {
	constructor(props) {
		super(props);
		this.state = {
			createFormData: {},
			branchId: this.props.match.params.bId,
			partnerId: this.props.match.params.id,
			clientId: this.props.match.params.cId,
		}
	}

	componentDidMount() {
		const {clientId} = this.state;
		if (clientId){
			this.props.getClient(clientId);
		}
	}

	handleChange = (path, ev) => {
		const {createFormData} = this.state;
		_.set(createFormData, path, ev);
		this.setState({createFormData})
	}

	handleSubmit = () => {
		const {createFormData, clientId} = this.state;
		_.set(createFormData, 'id', clientId);
		this.setState({createFormData});
		this.props.updateClient(createFormData).then((d) => {
			if (d.payload.data.status === true){
				this.setState({createFormData: {}});
				this.props.getClient(clientId);
			}
		})
	}

	render() {
		const {clientsStatus, clientStatus, updateClientErr, client} = this.props;
		const {createFormData} = this.state;

		return (<Wrapper>
			<UserHeader title={ <h3 className="users__title">{ t.addNewClient }</h3> }/>
			<div className="container">
				<div className="users__content">
					<h3>{ t.clientDetails }</h3>
					<div className="dfj">
						{ !_.isEmpty(client) ? <div className="clients_left">
								<br/>
								<div className="dfj">
									<div className="add_client_icon">
										<Person/>
									</div>
									<label className='add_client_label'>
										<h5>&ensp;{ t.clientName }</h5><br/>
										<Input
											size='small'
											type={ "text" }
											defaultValue={ client?.name || '' }
											className="w100"
											errors={ updateClientErr.name ? updateClientErr.name : null }
											placeholder={ "Name" }
											title={ createFormData.name }
											onChange={ (event) => this.handleChange('name', event.target.value) }
										/>
									</label>
								</div>
								<br/>
								<div className="dfj">
									<div className="add_client_icon">
										<LocationOn/>
									</div>
									<label className='add_client_label'>
										<h5>&ensp;{ t.address }</h5><br/>
										<Input
											size='small'
											type={ "text" }
											defaultValue={ client?.address || '' }
											className="w100"
											errors={ updateClientErr.address ? updateClientErr.address : null }
											placeholder={ "Address" }
											title={ createFormData.name }
											onChange={ (event) => this.handleChange('address', event.target.value) }
										/>
									</label>
								</div>
								<br/>
								<div className="dfj">
									<div className="add_client_icon">
										<Phone/>
									</div>
									<label className='add_client_label'>
										<h5>&ensp;{ t.phoneNumber }</h5><br/>
										<PhoneInput
											className="w100"
											defaultValue={ client?.phoneNumber || '' }
											errors={ updateClientErr.phoneNumber ? ErrorEnum[updateClientErr.phoneNumber] ? ErrorEnum[updateClientErr.phoneNumber] : updateClientErr.phoneNumber : null }
											title={ createFormData.phoneNumber ? createFormData.phoneNumber : null }
											onChange={ (event) => this.handleChange('phoneNumber', event && !event.toString().includes('+') ? `+${ event }` : event) }
										/>
									</label>
								</div>
								<br/>
								<div className="dfj">
									<div className="add_client_icon">
										<Email/>
									</div>
									<label className='add_client_label'>
										<h5>&ensp;{ t.email }</h5><br/>
										<Input
											size='small'
											type={ "email" }
											defaultValue={ client?.email || '' }
											className="w100"
											errors={ updateClientErr.email ? updateClientErr.email : null }
											placeholder={ "Email" }
											title={ createFormData.email }
											onChange={ (event) => this.handleChange('email', event.target.value) }
										/>
									</label>
								</div>
								<br/>
								<br/>
								<div className="add_client_button">
									<div className="dfj">
										<Button title={ t.cancel } className="add__user" variant="contained"
										        onClick={ () => this.props.history.goBack() }>
											{ t.cancel }
										</Button>&ensp;&ensp;
										<ModalButton
											title={ t.delete }
											label={ t.delete }
											className={ "add__user" }
											cl={ 'log_out' }
											text={ 'Are you sure you want to delete this client' }
											button={ t.delete }
											enter={ t.yes }
											onClick={ () => this.props.deleteClient(client?.id).then(() => this.props.history.goBack()) }
										/>
										<Button onClick={ () => this.handleSubmit(client?.id) } variant={ "contained" } title={ t.save }
										        className={ _.isEmpty(createFormData) || clientsStatus === "request" ? "" : "add__user" }
										        disabled={ _.isEmpty(createFormData) || clientsStatus === "request" }
										>
											{ clientsStatus === 'request' ? t.wait : t.save }
										</Button>
									</div>
								</div>
							</div> :
							<p className="clients_left_empty">{ clientStatus === "request" ? 'loading...' : 'No such client' }</p> }
						<div className="clients_right">
							<DriverMap state={ [] }/>
						</div>
					</div>
				</div>
			</div>
		</Wrapper>);
	}
}

const mapStateToProps = (state) => ({
	clientsStatus: state.clients.clientsStatus,
	clientStatus: state.clients.clientStatus,
	client: state.clients.client,
	updateClientErr: state.clients.updateClientErr,
})

const mapDispatchToProps = {
	getClient, updateClient, deleteClient,
}

const UpdateClientContainer = connect(mapStateToProps, mapDispatchToProps,)(UpdateClient)

export default withRouter(UpdateClientContainer);
