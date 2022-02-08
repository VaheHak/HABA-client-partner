import React, { Component } from 'react';
import Wrapper from "../../src/components/Wrapper";
import UserHeader from "../../src/components/UserHeader";
import { withRouter } from "react-router-dom";
import t from "../helpers/transletor";
import Account from "../helpers/Account";
import en from "../assets/flags/en.svg";
import ru from "../assets/flags/ru.svg";
import am from "../assets/flags/am.svg";

class Settings extends Component {

	changeLang = (l) => {
		this.setState({l});
		Account.setLang(l);
		window.location.reload();
	}

	render() {

		return (<Wrapper>
			<UserHeader title={ <h3 className="users__title">{ t.settings }</h3> }/>
			<div className="container">
				<div className="orders__content">
					<div className="translate">
						<img src={ en } alt="en" className="lang" onClick={ () => this.changeLang('en') }/>
						<img src={ ru } alt="ru" className="lang" onClick={ () => this.changeLang('ru') }/>
						<img src={ am } alt="am" className="lang" onClick={ () => this.changeLang('am') }/>
					</div>
				</div>
			</div>
		</Wrapper>);
	}
}

export default withRouter(Settings);
