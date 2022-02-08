import React, { Component } from 'react';
import { NavLink, withRouter } from "react-router-dom";
import "../assets/css/components/leftNavbar.css"
import t from "../helpers/transletor";

class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: this.props.match.params.id, bId: this.props.match.params.bId, l: 'en',
		}
	}

	render() {
		const {id, bId} = this.state;

		return (<header className='header'>
			<div className='left__navbar'>
				<div className="header__logo">
					<img src="/images/logos/haba.png" alt="haba-black"/>
				</div>
				<nav className="navbar__content">
					<NavLink to={ `/${ id }/${ bId }/home` } className="nav__link">
						<img src="/images/icons/map.svg" alt={ t.home }/>&ensp;{ t.home }
					</NavLink>
					<NavLink to={ `/${ id }/${ bId }/orderList` } className="nav__link">
						<img src="/images/icons/Orders.svg" alt={ t.orders }/>&ensp;{ t.orders }
					</NavLink>
					<NavLink to={ `/${ id }/${ bId }/drivers` } className="nav__link">
						<img src="/images/icons/Drivers-white.svg" alt={ t.drivers }/>&ensp;{ t.drivers }
					</NavLink>
					<NavLink to={ `/${ id }/${ bId }/clients` } className="nav__link">
						<img src="/images/icons/Users-white.svg" alt={ t.clients }/>&ensp;{ t.clients }
					</NavLink>
					<NavLink to={ `/${ id }/${ bId }/orders` } className="nav__link">
						<img src="/images/icons/History.svg" alt={ t.ordersHistory }/>&ensp;{ t.ordersHistory }
					</NavLink>
					<NavLink to={ `/${ id }/${ bId }/dashboard` } className="nav__link">
						<img src="/images/icons/Dashboard-white.svg" alt={ t.dashboard }/>&ensp;{ t.dashboard }
					</NavLink>
					<NavLink to={ `/${ id }/${ bId }/settings` } className="nav__link">
						<img src="/images/icons/Settings.svg" alt={ t.settings }/>&ensp;{ t.settings }
					</NavLink>
				</nav>
				<br/>
			</div>
		</header>);
	}
}

export default withRouter(Header);
