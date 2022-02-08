import React, { Component } from 'react';
import _ from "lodash";
import { postLoginRequest } from "../store/actions/partnior/users";
import { connect } from "react-redux";
import "../assets/css/pages/login.css";
import WrapperLogout from "../components/WrapperLogout";
import ErrorEnum from "../helpers/ErrorHandler";
import PhoneInput from "../components/form/PhoneInput";
import InputPassword from "../components/form/InputPassword";
import { Link } from "react-router-dom";
import t from "../helpers/transletor";

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			formData: {},
		}
	}

	handleChange = (path, ev) => {
		const {formData} = this.state;
		_.set(formData, path, ev);
		this.setState({
			formData,
		})
	}

	handleSubmit = () => {
		const {formData} = this.state;
		this.props.postLoginRequest(formData);
	}


	render() {
		const {formData} = this.state;
		const {errors} = this.props;

		return (
			<WrapperLogout>
				<div className="login__container" style={ {background: `url('/images/bg/loginBg.png')`} }>
					<div className="container">
						<div className="login__content">
							<img className="login__logo" src="/images/logos/haba.png" alt="haba"/>
							<div className="login__form">
								<h3>{ t.signIn }</h3>
								<div className="login__form_content">
									<div className="login__label_row">
										<label className="login__label">
											<p>{ t.phoneNumber }</p>
											<PhoneInput
												className="login__input"
												autoComplete="on"
												value={ formData.phoneNumber ? formData.phoneNumber : "" }
												errors={ errors.phoneNumber ? ErrorEnum[errors.phoneNumber]
													? ErrorEnum[errors.phoneNumber] : errors.phoneNumber : null }
												title={ formData.phoneNumber ? formData.phoneNumber : null }
												onChange={ (event) => this.handleChange('phoneNumber', event && !event.toString().includes('+') ? `+${ event }` : event) }
											/>
										</label>
										<br/>
										<label className="login__label">
											<p>{ t.password }</p>
											<InputPassword
												autoComplete="on"
												value={ formData.password ? formData.password : '' }
												onChange={ (event) => this.handleChange('password', event.target.value) }
											/>
										</label>
									</div>
									<button className="form__submit" onClick={ () => this.handleSubmit() }>
										{ t.signIn }
									</button>
									<br/>
									<p className="input__error">
										{ errors.message ? 'Wrong number or password. Please try again' : null }
									</p>
								</div>
								<Link to="/forgot_password">{ t.forgotPassword }</Link>
							</div>
						</div>
					</div>
				</div>
			</WrapperLogout>
		);
	}
}

const mapStateToProps = (state) => ({
	errors: state.users.errors,
	checkErrors: state.users.checkErrors,
	loginData: state.users.loginData,
	checkStatus: state.users.checkStatus,
});
const mapDispatchToProps = {
	postLoginRequest,
}

const LoginContainer = connect(
	mapStateToProps,
	mapDispatchToProps,
)(Login)

export default LoginContainer;
