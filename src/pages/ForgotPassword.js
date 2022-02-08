import React, { Component } from 'react';
import _ from "lodash";
import { backToCheck, postForgotPassword } from "../store/actions/partnior/users";
import { connect } from "react-redux";
import WrapperLogout from "../components/WrapperLogout";
import ErrorEnum from "../helpers/ErrorHandler";
import PhoneInput from "../components/form/PhoneInput";
import { Link } from "react-router-dom";
import { KeyboardBackspace } from "@material-ui/icons";
import CheckCode from "../components/form/CheckCode";
import t from "../helpers/transletor";

class ForgotPassword extends Component {
	constructor(props) {
		super(props);
		this.state = {
			formData: {},
		}
	}

	componentDidMount() {
		this.props.backToCheck()
	}

	handleChange = (path, ev) => {
		const {formData} = this.state;
		_.set(formData, path, ev);
		this.setState({formData})
	}

	handleSubmit = () => {
		const {formData} = this.state;
		this.props.postForgotPassword(formData);
	}


	render() {
		const {formData} = this.state;
		const {forgotPasswordErr, forgotPassword, requestStatus} = this.props;

		return (
			<WrapperLogout>
				<div className="login__container" style={ {background: `url('/images/bg/loginBg.png')`} }>
					<div className="container">
						<div className="login__content">
							<img className="login__logo" src="/images/logos/haba.png" alt="haba"/>
							{ forgotPassword?.status === true ? <CheckCode phone={ formData?.phoneNumber }/> :
								<div className="login__form">
									<h3>{ t.forgotPassword }</h3>
									<Link className="back__to_login" title={ t.back } to="/">
										<KeyboardBackspace/>
									</Link>
									<p>{ t.accountSearch }</p>
									<div className="login__form_content">
										<div className="login__label_row">
											<label className="login__label">
												<h5>{ t.phoneNumber }</h5>
												<PhoneInput
													className="login__input"
													autoComplete="on"
													value={ formData.phoneNumber ? formData.phoneNumber : "" }
													errors={ forgotPasswordErr.phoneNumber ? ErrorEnum[forgotPasswordErr.phoneNumber]
														? ErrorEnum[forgotPasswordErr.phoneNumber] : forgotPasswordErr.phoneNumber : null }
													title={ formData.phoneNumber ? formData.phoneNumber : null }
													onChange={ (event) => this.handleChange('phoneNumber', event && !event.toString().includes('+') ? `+${ event }` : event) }
												/>
											</label>
										</div>
										<button className="form__submit" onClick={ () => this.handleSubmit() }
										        disabled={ requestStatus === 'request' }>
											{ requestStatus === 'request' ? t.pleaseWait : t.search }
										</button>
										<br/>
									</div>
								</div> }
						</div>
					</div>
				</div>
			</WrapperLogout>
		);
	}
}

const mapStateToProps = (state) => ({
	forgotPasswordErr: state.users.forgotPasswordErr,
	forgotPassword: state.users.forgotPassword,
	requestStatus: state.users.requestStatus,
});

const mapDispatchToProps = {
	postForgotPassword,
	backToCheck
}

const ForgotPasswordContainer = connect(
	mapStateToProps,
	mapDispatchToProps,
)(ForgotPassword)

export default ForgotPasswordContainer;
