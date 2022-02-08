import React, { Component } from 'react';
import Wrapper from "../../src/components/Wrapper";
import UserHeader from "../../src/components/UserHeader";
import _ from "lodash";
import '../../src/assets/css/pages/historyDetails.css'
import { withRouter } from "react-router-dom";
import {
	Email, LocationOn, Person, Phone,
} from "@material-ui/icons";
import { connect } from "react-redux";
import { Button } from "@mui/material";
import t from "../helpers/transletor";
import DriverMap from "../components/map/DriverMap";
import { createClient } from "../store/actions/partnior/clients";
import Input from "../components/form/Input";
import PhoneInput from "../components/form/PhoneInput";
import ErrorEnum from "../helpers/ErrorHandler";

class AddClient extends Component {
	constructor(props) {
		super(props);
		this.state = {
			createFormData: {},
			branchId: this.props.match.params.bId, partnerId: this.props.match.params.id,
		}
	}

	handleChange = (path, ev) => {
		const {createFormData} = this.state;
		_.set(createFormData, path, ev);
		this.setState({createFormData})
	}

	handleSubmit = () => {
		const {createFormData, branchId} = this.state;
		_.set(createFormData, 'branchId', branchId);
		this.setState({createFormData});
		this.props.createClient(createFormData).then((d) => {
			if (d.payload.data.status === true){
				this.setState({createFormData: {}});
			}
		})
	}

	render() {
		const {clientsStatus, createClientErr} = this.props;
		const {createFormData} = this.state;

		return (<Wrapper>
			<UserHeader title={ <h3 className="users__title">{ t.addNewClient }</h3> }/>
			<div className="container">
				<div className="users__content">
					<h3>{ t.clientDetails }</h3>
					<div className="dfj">
						<div className="clients_left">
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
										value={ createFormData.name ? createFormData.name : '' }
										className="w100"
										errors={ createClientErr.name ? createClientErr.name : null }
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
										value={ createFormData.address ? createFormData.address : '' }
										className="w100"
										errors={ createClientErr.address ? createClientErr.address : null }
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
										value={ createFormData.phoneNumber ? createFormData.phoneNumber : "" }
										errors={ createClientErr.phoneNumber ? ErrorEnum[createClientErr.phoneNumber] ? ErrorEnum[createClientErr.phoneNumber] : createClientErr.phoneNumber : null }
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
										value={ createFormData.email ? createFormData.email : '' }
										className="w100"
										errors={ createClientErr.email ? createClientErr.email : null }
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
									</Button>
									<Button onClick={ this.handleSubmit } className={ clientsStatus === 'request' ? "" : "add__user" }
									        disabled={ clientsStatus === 'request' }
									        variant="contained" title={ t.submit }>
										{ clientsStatus === 'request' ? t.wait : t.submit }
									</Button>
								</div>
							</div>
						</div>
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
	createClientErr: state.clients.createClientErr,
})

const mapDispatchToProps = {
	createClient,
}

const AddClientContainer = connect(mapStateToProps, mapDispatchToProps,)(AddClient)

export default withRouter(AddClientContainer);
