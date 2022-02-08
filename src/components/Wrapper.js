import React, { Component } from 'react';
import Header from "./Header";
import Footer from "./Footer";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { getAccount } from "../store/actions/partnior/users";
import Results from "./utils/Results";
import { socketInit } from "../store/actions/socket";
import Account from "../helpers/Account";
import t from "../helpers/transletor";

class Wrapper extends Component {
	static defaultProps = {
		showFooter: false,
		showHeader: true,
	}

	componentDidMount() {
		const {token} = this.props;
		if (token){
			this.props.getAccount();
			this.props.socketInit(token);
		}
	}

	render() {
		const {showFooter, showHeader, token} = this.props;
		if (window.screen.width <= 1024){
			return <Redirect to="/mobile_app"/>
		}
		if (!token){
			return <Redirect to="/"/>
		}
		const l = Account.getLang();
		t.setLanguage(l ? l : 'en');

		return (<>
			{ showHeader ? <Header/> : null }
			<div className={ showHeader ? "content" : "" }>
				{ this.props.children }
			</div>
			<Results/>
			{ showFooter ? <Footer/> : null }
		</>);
	}

}

const mapStateToProps = (state) => ({
	token: state.users.token,
});

const mapDispatchToProps = {
	getAccount,
	socketInit,
}

const WrapperContainer = connect(
	mapStateToProps,
	mapDispatchToProps,
)(Wrapper)

export default WrapperContainer;
