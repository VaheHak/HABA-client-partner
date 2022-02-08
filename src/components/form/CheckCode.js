import React, { Component } from 'react';
import _ from "lodash";
import Input from "./Input";
import { InputAdornment } from "@mui/material";
import { KeyboardBackspace, Sms } from "@material-ui/icons";
import { backToForgot, postCheckCode } from "../../store/actions/partnior/users";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import ErrorEnum from "../../helpers/ErrorHandler";
import NewPassword from "./NewPassword";
import t from "../../helpers/transletor";

class CheckCode extends Component {
	constructor(props) {
		super(props);
		this.state = {
			checkData: {},
		}
	}

	handleCheck = (path, ev) => {
		const {checkData} = this.state;
		const {phone} = this.props;
		_.set(checkData, path, ev);
		_.set(checkData, 'phoneNumber', phone);
		this.setState({checkData,})
	}

	handleCheckSubmit = () => {
		const {checkData} = this.state;
		this.props.postCheckCode(checkData);
	}

	backTo = () => {
		this.setState({checkData: {}});
		this.props.backToForgot();
	}

	render() {
		const {checkData} = this.state;
		const {checkCodeErr, checkCode, requestStatus} = this.props;

		return (
			checkCode?.status === true ? <NewPassword data={ checkData }/> :
				<div className="login__form">
					<h3>{ t.enterDigitCode }</h3>
					<div className="back__to_login" title={ t.back } onClick={ () => this.backTo() }>
						<KeyboardBackspace/>
					</div>
					<p style={ {color: "red"} }>{ checkCodeErr.phoneNumber ? ErrorEnum[checkCodeErr.phoneNumber]
							? ErrorEnum[checkCodeErr.phoneNumber] : checkCodeErr.phoneNumber
						: null }</p>
					<br/>
					<Input
						className={ "login__input" }
						label={ checkCodeErr.code ? "Digit code error" : t.digitCode }
						type={ "text" }
						mask={ '9999' }
						maskChar={ '*' }
						errors={ checkCodeErr.code ? checkCodeErr.code : checkCode.status === false ?
							ErrorEnum[checkCode.message] ? ErrorEnum[checkCode.message] : checkCode.message : null }
						InputProps={ {
							startAdornment: (
								<InputAdornment position="start">
									<Sms/>
								</InputAdornment>
							),
						} }
						placeholder={ "Digit code" }
						title={ checkData.code ? checkData.code : null }
						onChange={ (event) => this.handleCheck('code', event.target.value) }
					/><br/>
					<button className="form__submit" onClick={ () => this.handleCheckSubmit() }
					        disabled={ requestStatus === 'request' }>
						<FontAwesomeIcon icon={ faCheck }/>&ensp;
						{ requestStatus === 'request' ? t.pleaseWait : t.check }
					</button>
				</div>
		);
	}
}

const mapStateToProps = (state) => ({
	checkCodeErr: state.users.checkCodeErr,
	checkCode: state.users.checkCode,
	requestStatus: state.users.requestStatus,
});

const mapDispatchToProps = {
	postCheckCode,
	backToForgot
}

const CheckCodeContainer = connect(
	mapStateToProps,
	mapDispatchToProps,
)(CheckCode)

export default CheckCodeContainer;
