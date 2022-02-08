import React, { Component } from 'react';
import _ from "lodash";
import Input from "../components/form/Input";
import Selects from "../components/form/Select";
import { Button } from "@mui/material";
import { connect } from "react-redux";
import Wrapper from "../components/Wrapper";
import Results from "../components/utils/Results";
import ErrorEnum from "../helpers/ErrorHandler";
import PhoneInput from "../components/form/PhoneInput";
import { createDriver } from "../store/actions/partnior/driver";
import UserHeader from "../components/UserHeader";
import t from "../helpers/transletor";
import Transports from "../helpers/Enums";
import { validateInput } from "../helpers/InputValidation";
import InputPassword from "../components/form/InputPassword";
import FileInput from "../components/form/FileInput";
import { Redirect } from "react-router-dom";

class AddDriver extends Component {
	constructor(props) {
		super(props);
		this.state = {
			formData: {}, process: '', partnerId: this.props.match.params.id, branchId: this.props.match.params.bId,
		};
	}

	handleChangeValue = (path, ev) => {
		const {formData} = this.state;
		_.set(formData, path, ev);
		this.setState({formData})
	}

	handleSubmit = () => {
		const {formData, branchId} = this.state;
		_.set(formData, 'branchId', branchId);
		this.setState({formData});
		this.props.createDriver(formData, (v) => {
			this.setState({process: v.loaded / v.total * 100})
		}, () => {
			console.log()
		}).then((d) => {
			if (d.payload.data.status === true){
				this.setState({formData: {}});
			}
		})
	}

	render() {
		const {driverCreateErr, driversStatus, myAccount} = this.props;
		const {formData, process, partnerId, branchId} = this.state;
		if (myAccount?.userPartners && myAccount?.userPartners?.subscribe !== true){
			return <Redirect to={ `/${ partnerId }/${ branchId }/drivers` }/>
		}

		return (<Wrapper showFooter={ false }>
			<UserHeader title={ <h3 className="users__title">{ t.addDriver }</h3> }/>
			<div className="container">
				<div className="add__content dfj">
					<div className="driver__add_content">
						<label className="driver__update_label">
							<p>{ t.profileImage }</p>{ process && +process !== 100 && _.isEmpty(driverCreateErr) ?
							<p style={ {color: 'forestgreen'} }>{ process }%</p> : null }
							<br/>
							<FileInput accept="image/*"
							           onClick={ () => this.handleChangeValue('avatar', '') }
							           onChange={ (ev, files) => this.handleChangeValue('avatar', files[0]) }/>
							{ driverCreateErr.avatar ? <p className="err">{ driverCreateErr.avatar }</p> : null }
						</label>
						<br/>
						<label className="driver__update_label">
							<p>{ t.firstName }</p><br/>
							<Input
								className={ `user__update_input` }
								size={ 'small' }
								name={ "firstName" }
								type={ "text" }
								mask={ "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" }
								maskChar={ '' }
								errors={ driverCreateErr.firstName ? driverCreateErr.firstName.replaceAll('_', ' ') : null }
								placeholder={ "FirstName" }
								title={ formData.firstName ? formData.firstName : '' }
								value={ formData.firstName ? formData.firstName : '' }
								onChange={ (event) => this.handleChangeValue('firstName', event.target.value) }
							/>
						</label>
						<label className="driver__update_label">
							<p>{ t.lastName }</p><br/>
							<Input
								className={ `user__update_input` }
								size={ 'small' }
								name={ "lastName" }
								type={ "text" }
								mask={ "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" }
								maskChar={ '' }
								errors={ driverCreateErr.lastName ? driverCreateErr.lastName.replaceAll('_', ' ') : null }
								placeholder={ "LastName" }
								title={ formData.lastName ? formData.lastName : '' }
								value={ formData.lastName ? formData.lastName : '' }
								onChange={ (event) => this.handleChangeValue('lastName', event.target.value) }
							/>
						</label>
						<label className="driver__update_label">
							<p>{ t.email }</p><br/>
							<Input
								size={ 'small' }
								className={ `user__update_input` }
								type={ "email" }
								errors={ driverCreateErr.email ? ErrorEnum[driverCreateErr.email] ? ErrorEnum[driverCreateErr.email] : driverCreateErr.email.replaceAll('_', ' ') : null }
								placeholder={ "example@mail.com" }
								title={ formData.email ? formData.email : '' }
								value={ formData.email ? formData.email : '' }
								onChange={ (event) => this.handleChangeValue('email', event.target.value) }
							/>
						</label>
						<br/>
						<h3>{ t.loginDetails }</h3>
						<br/>
						<label className="driver__update_label">
							<p>{ t.phoneNumber }</p><br/>
							<PhoneInput
								errors={ driverCreateErr.phoneNumber ? ErrorEnum[driverCreateErr.phoneNumber] ? ErrorEnum[driverCreateErr.phoneNumber] : driverCreateErr.phoneNumber.replaceAll('_', ' ') : null }
								title={ formData.phoneNumber ? formData.phoneNumber : '' }
								value={ formData.phoneNumber ? formData.phoneNumber : '' }
								onChange={ (event) => this.handleChangeValue('phoneNumber', event.toString().includes('+') ? event : `+${ event }`) }
							/>
						</label>
						<label className="driver__update_label">
							<p>{ t.password }</p><br/>
							<InputPassword
								value={ formData.password ? formData.password : '' }
								onChange={ (event) => this.handleChangeValue('password', event.target.value) }
								errors={ driverCreateErr.password ? driverCreateErr.password.replaceAll('_', ' ') : null }
							/>
						</label>
						<br/>
						<h3>{ t.transportation }</h3>
						<br/>
						<label className="driver__update_label">
							<p>{ t.type }</p><br/>
							<Selects
								size={ "small" }
								className={ 'user__create_input' }
								df={ 'Select Type' }
								data={ Transports }
								errors={ driverCreateErr.type ? driverCreateErr.type.replaceAll('_', ' ') : null }
								value={ formData.type ? formData.type : '' }
								vName={ 'name' }
								keyValue={ 'value' }
								onChange={ (event) => this.handleChangeValue('type', event.target.value) }
							/>
						</label>
						<label className="driver__update_label">
							<p>{ t.details }</p><br/>
							<Input
								className={ `user__update_input` }
								size={ 'small' }
								name={ "details" }
								type={ "text" }
								mask={ "**********************************************" }
								maskChar={ '' }
								errors={ driverCreateErr.details ? driverCreateErr.details.replaceAll('_', ' ') : null }
								placeholder={ "Details" }
								title={ formData.details ? formData.details : '' }
								value={ formData.details ? formData.details : '' }
								onChange={ (event) => this.handleChangeValue('details', event.target.value) }
							/>
						</label>
						<div className="dfj">
							<label className="filter__label_row">
								<p>Kg</p><br/>
								<Input
									className={ `user__update_input` }
									size={ 'small' }
									name={ "kg" }
									type={ "number" }
									errors={ driverCreateErr.kg ? driverCreateErr.kg.replaceAll('_', ' ') : null }
									placeholder={ "Kg" }
									title={ formData.kg ? formData.kg : '' }
									value={ formData.kg ? formData.kg : '' }
									onChange={ (event) => this.handleChangeValue('kg', validateInput(event.target.value)) }
								/>
							</label>
							<label className="filter__label_row">
								<p>M3</p><br/>
								<Input
									className={ `user__update_input` }
									size={ 'small' }
									name={ "m3" }
									type={ "number" }
									errors={ driverCreateErr.m3 ? driverCreateErr.m3.replaceAll('_', ' ') : null }
									placeholder={ "M3" }
									title={ formData.m3 ? formData.m3 : '' }
									value={ formData.m3 ? formData.m3 : '' }
									onChange={ (event) => this.handleChangeValue('m3', validateInput(event.target.value)) }
								/>
							</label>
						</div>
					</div>
					<div className="driver__add_button">
						<div className="add__buttons_row">
							<Button title={ t.cancel } className="add__user" variant="contained"
							        onClick={ () => this.props.history.goBack() }>
								{ t.cancel }
							</Button>
							<Button onClick={ this.handleSubmit } className={ driversStatus === 'request' ? "" : "add__user" }
							        disabled={ driversStatus === 'request' }
							        variant="contained" title={ t.submit }>
								{ driversStatus === 'request' ? t.wait : t.submit }
							</Button>
						</div>
					</div>
				</div>
				<Results/>
			</div>
		</Wrapper>);
	}
}

const mapStateToProps = (state) => ({
	driversStatus: state.driver.driversStatus,
	driverCreateErr: state.driver.driverCreateErr,
	myAccount: state.users.myAccount,
})

const mapDispatchToProps = {
	createDriver
}

const AddDriverContainer = connect(mapStateToProps, mapDispatchToProps,)(AddDriver)

export default AddDriverContainer;
