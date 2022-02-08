import React, { Component } from 'react';
import MobileWrapper from "../components/MobileWrapper";
import { Link } from "react-router-dom";
import { GetApp } from "@material-ui/icons";

const {REACT_APP_MOBILE_APP_URL} = process.env;

class MobileApp extends Component {

	render() {

		return (
			<MobileWrapper>
				<div className="login__container" style={ {background: `url('/images/bg/loginBg.png')`} }>
					<div className="container">
						<div className="login__content">
							<img className="login__logo" src="/images/logos/haba.png" alt="haba"/>
							<div className="mobile__form">
								<h3 className="center">Download Mobile App</h3>
								<Link to={ REACT_APP_MOBILE_APP_URL } className="mobile__link">
									<GetApp/>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</MobileWrapper>
		);
	}
}

export default MobileApp;
