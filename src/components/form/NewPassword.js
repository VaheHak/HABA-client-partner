import React, { Component } from 'react';
import _ from "lodash";
import { postNewPassword } from "../../store/actions/partnior/users";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import ErrorEnum from "../../helpers/ErrorHandler";
import InputPassword from "./InputPassword";
import { Link, Redirect } from "react-router-dom";
import { KeyboardBackspace } from "@material-ui/icons";
import t from "../../helpers/transletor";

class NewPassword extends Component {
	constructor(props) {
		super(props);
		this.state = {
			formData: {},
		}
	}

	handleChange = (path, ev) => {
		const {formData} = this.state;
		const {data} = this.props;
		_.set(formData, path, ev);
		_.set(formData, 'phoneNumber', data?.phoneNumber);
		_.set(formData, 'code', data?.code);
		this.setState({formData,})
	}

	handleSubmit = () => {
		const {formData} = this.state;
		this.props.postNewPassword(formData);
	}

	render() {
		const {formData} = this.state;
		const {passwordChangedErr, passwordChanged, requestStatus} = this.props;
		if (passwordChanged?.status === true){
			return <Redirect to="/"/>
		}

		return (<div className="login__form">
			<h3>{ t.enterNewPassword }</h3>
			<Link className="back__to_login" title="Back to sign in page" to="/">
				<KeyboardBackspace/>
			</Link>
			<p style={ {color: "red"} }>
				{ passwordChangedErr.phoneNumber ? ErrorEnum[passwordChangedErr.phoneNumber] ?
					ErrorEnum[passwordChangedErr.phoneNumber] : passwordChangedErr.phoneNumber : null }
			</p>
			<br/>
			<label className="login__label">
				<h6>{ t.newPassword }</h6>
				<InputPassword
					autoComplete="on"
					value={ formData.password ? formData.password : '' }
					errors={ passwordChangedErr.password ? passwordChangedErr.password : null }
					onChange={ (event) => this.handleChange('password', event.target.value) }
				/>
			</label>
			<label className="login__label">
				<h6>{ t.repeatPassword }</h6>
				<InputPassword
					autoComplete="on"
					value={ formData.repeatPassword ? formData.repeatPassword : '' }
					errors={ passwordChangedErr.password ? passwordChangedErr.password :
						formData.repeatPassword && formData.repeatPassword !== formData.password ? t.passwordNotSame : null }
					onChange={ (event) => this.handleChange('repeatPassword', event.target.value) }
				/>
			</label>
			<br/>
			<button onClick={ () => this.handleSubmit() } className="form__submit"
			        style={ {background: !formData.repeatPassword || formData.repeatPassword !== formData.password ? "gray" : ""} }
			        disabled={ requestStatus === 'request' || !formData.repeatPassword || formData.repeatPassword !== formData.password }>
				<FontAwesomeIcon icon={ faCheck }/>&ensp;
				{ requestStatus === 'request' ? t.pleaseWait : t.submit }
			</button>
		</div>);
	}
}

const mapStateToProps = (state) => ({
	passwordChangedErr: state.users.passwordChangedErr,
	passwordChanged: state.users.passwordChanged,
	requestStatus: state.users.requestStatus,
});

const mapDispatchToProps = {
	postNewPassword,
}

const NewPasswordContainer = connect(
	mapStateToProps,
	mapDispatchToProps,
)(NewPassword)

export default NewPasswordContainer;
