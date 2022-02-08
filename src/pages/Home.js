import React, { Component } from 'react';
import Wrapper from "../components/Wrapper";
import { connect } from "react-redux";
import _ from "lodash";
import { NavLink, Redirect, withRouter } from "react-router-dom";
import "../assets/css/pages/activeDrivers.css"
import DriverMap from "../components/map/DriverMap";
import { getDrivers } from "../store/actions/partnior/driver";
import UserHeader from "../components/UserHeader";
import { DoubleArrow, Star } from "@material-ui/icons";

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			formData: {all: true},
			partnerId: this.props.match.params.id,
			branchId: this.props.match.params.bId,
		};
	}

	componentDidMount() {
		const {partnerId, branchId} = this.state;
		this.props.getDrivers(1, partnerId, branchId);
	}

	handleChange = (id, name) => {
		const {formData} = this.state;
		_.set(formData, "id", id);
		_.set(formData, "name", name);
		this.setState({formData});
	};

	handleFilter = (path, ev) => {
		let {formData, partnerId, branchId} = this.state;
		formData = {};
		_.set(formData, path, ev);
		this.props.getDrivers(1, partnerId, branchId, formData.active, formData.state)
		this.setState({formData});
	};

	changePage = () => {
		const {drivers} = this.props;
		const {formData, partnerId, branchId} = this.state;
		if (this.scroll.scrollHeight - this.scroll.scrollTop === this.scroll.clientHeight){
			if (+drivers?.currentPage < +drivers?.totalPages){
				const page = drivers?.currentPage ? drivers.currentPage + 1 : 1;
				_.set(formData, "page", page);
				this.props.getDrivers(formData.page, partnerId, branchId, formData.active, formData.state)
				this.setState({formData});
			}
		}
	}

	render() {
		const {drivers, coordsList, onlineDrivers, myAccount} = this.props;
		const {formData, partnerId, branchId} = this.state;
		const avatar = "/images/avatars/avatar.jpg"
		if (myAccount?.userPartners && myAccount?.userPartners?.subscribe !== true){
			return <Redirect to={ `/${ partnerId }/${ branchId }/subscribe` }/>
		}

		return (<Wrapper showFooter={ false }>
			<UserHeader title={ <div className="active_drivers_filter">
				<div className={ formData?.all ? "green" : '' }
				     onClick={ () => this.handleFilter("all", true) }>All
				</div>
				<div
					className={ `middle ${ formData?.state ? "green" : '' }` }
					onClick={ () => this.handleFilter("state", 1) }>Available
				</div>
				<div className={ formData?.active ? "green" : '' }
				     onClick={ () => this.handleFilter("active", 'on') }>Online
				</div>
			</div> }/>
			<div className="container">
				<div className="w100 dfj">
					<div className="active_drivers_left">
						<div className="active_drivers_list" ref={ (r) => this.scroll = r }
						     onScroll={ () => this.changePage() }>
							{ !_.isEmpty(drivers?.array) ? _.map(drivers?.array || [], (v, k) => (v ?
								<NavLink to={ `/${ partnerId }/${ branchId }/home/${ v?.id }` } key={ v?.id || k }
								         className={ `active_drivers_item ${ +v?.id === +formData?.id ? "sad" : "" }` }
								         onClick={ () => this.handleChange(v?.id, v?.driverUser) }>
									<div className="active_drivers_avatar">
										<img
											src={ v?.avatar || avatar } alt="avatar"
											onError={ ev => {
												ev.target.src = avatar
											} }/>
										{ onlineDrivers.includes(+v?.driverUser?.id) ? <div className='on'/> : <div className='off'/> }
									</div>
									<div className="active_drivers_info">
										<h5>{ v?.driverUser?.firstName || '-' } { v?.driverUser?.lastName || '-' }</h5>
										<div className="driver_rate">
											<Star fontSize="small"/>{ v?.rating || 0 }
										</div>
									</div>
									<DoubleArrow/>
								</NavLink> : null)) : 'No active drivers' }
						</div>
					</div>
					<div className="active_drivers_right">
						<DriverMap
							allDrivers={ drivers?.array ? drivers?.array : [] }
							coordsList={ coordsList }
						/>
					</div>
				</div>
			</div>
		</Wrapper>);
	}
}

const mapStateToProps = (state) => ({
	drivers: state.driver.drivers,
	onlineDrivers: state.driver.onlineDrivers,
	coordsList: state.driver.coordsList,
	myAccount: state.users.myAccount,
})

const mapDispatchToProps = {
	getDrivers,
}

const HomeContainer = connect(
	mapStateToProps,
	mapDispatchToProps,
)(Home)

export default withRouter(HomeContainer);
