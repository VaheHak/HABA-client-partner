import React, { Component } from 'react';
import Wrapper from "../../src/components/Wrapper";
import UserHeader from "../../src/components/UserHeader";
import _ from "lodash";
import '../../src/assets/css/pages/drivers.css'
import { Link, NavLink, withRouter } from "react-router-dom";
import { Search, Phone, Email, DoubleArrow } from "@material-ui/icons";
import { getDrivers, } from "../store/actions/partnior/driver";
import { connect } from "react-redux";
import { Button, Pagination, PaginationItem } from "@mui/material";
import t from "../helpers/transletor";
import ModalButton from "../components/modals/modal";

class Drivers extends Component {
	constructor(props) {
		super(props);
		this.state = {
			partnerId: this.props.match.params.id, branchId: this.props.match.params.bId,
		}
	}

	componentDidMount() {
		const {branchId, partnerId} = this.state;
		if (branchId && partnerId){
			this.props.getDrivers(1, partnerId, branchId);
		}
	}

	render() {
		const {drivers, driversStatus, onlineDrivers, myAccount} = this.props;
		const {partnerId, branchId} = this.state;
		const avatar = "/images/avatars/avatar.jpg";

		return (<Wrapper>
			<UserHeader title={ <h3 className="users__title">{ t.drivers }</h3> }/>
			<div className="container">
				<div className="orders__content">
					<div className="users__filter_area">
						<div className="search_input">
							<Search fontSize="small" className="search_icon"/>
							<input type="search" placeholder='Search'/>
						</div>
						{ myAccount?.userPartners && myAccount?.userPartners?.subscribe !== true ? <ModalButton
							title={ t.addDriver }
							label={ t.addDriver }
							div={ <Button variant="contained" sx={ {background: 'black', color: 'white', textTransform: 'unset'} }>
								+ { t.addDriver }
							</Button> }
							enter={ t.cancel }
							onClick={ () => console.log() }
							input={ <div className="users__filter_row">
								<div className="subscribe_content">
									<h3>Subscribe to be able to add a driver</h3>
									<div className="subscribe_item">
										<div className="subscribe_price">
											<h3>$9.99</h3>
											<p>$9.99/a month</p>
										</div>
										<div className="dfc">
											<h4>1 month</h4>&ensp;
											<DoubleArrow/>
										</div>
									</div>
									<div className="subscribe_item">
										<div className="subscribe_price">
											<h3>$29.99</h3>
											<p>$9.99/a month</p>
										</div>
										<div className="dfc">
											<h4>3 months</h4>&ensp;
											<DoubleArrow/>
										</div>
									</div>
									<div className="subscribe_item">
										<div className="subscribe_price">
											<h3>$69.99</h3>
											<p>$5.83/a month</p>
										</div>
										<div className="dfc">
											<h4>1 year</h4>&ensp;
											<DoubleArrow/>
										</div>
									</div>
								</div>
							</div> }
						/> : <NavLink to={ `/${ partnerId }/${ branchId }/drivers/add` }>
							<Button variant="contained" sx={ {background: 'black', color: 'white', textTransform: 'unset'} }>
								+ { t.addDriver }
							</Button>
						</NavLink> }
					</div>
					<div className="order_history">
						{ driversStatus === 'request' ? <p className="center">Loading...</p> : _.isEmpty(drivers.array) ?
							<p className="center">No Drivers</p> : _.map(drivers.array || [], (d) => (
								<NavLink to={ `/${ partnerId }/${ branchId }/drivers` } className="driver_block" key={ d?.id }>
									<div className={ `active_driver_item` }>
										<div className="active_drivers_avatar">
											<img
												src={ d?.avatar || avatar } alt="avatar"
												onError={ ev => {
													ev.target.src = avatar
												} }/>
											{ onlineDrivers.includes(+d?.driverUser?.id) ? <div className='on'/> : <div className='off'/> }
										</div>
										<div className="active_driver_info">
											<h4>{ d?.driverUser?.firstName || '-' } { d?.driverUser?.lastName || '-' }</h4>
											<br/>
											<p>{ _.upperFirst(d?.driverCars?.color) } { d?.driverCars?.make } { d?.driverCars?.model } { d?.driverCars?.number }</p>
										</div>
									</div>
									<br/>
									<div className="driver_contact_item">
										<div className="driver_contact_icon">
											<Phone fontSize="small"/>
										</div>
										<p>{ d?.driverUser?.phoneNumber || '-' }</p>
									</div>
									<div className="driver_contact_item">
										<div className="driver_contact_icon">
											<Email fontSize="small"/>
										</div>
										<p>{ d?.driverUser?.email || '-' }</p>
									</div>
								</NavLink>)) }
					</div>
					<br/>
					<div className="center">
						<Pagination
							count={ +drivers?.totalPages || 1 } variant="outlined" page={ +drivers?.currentPage || 1 }
							shape="rounded" showFirstButton showLastButton style={ {margin: "0 auto"} }
							onChange={ (event, page) => {
								this.props.getDrivers(page, partnerId, branchId);
							} }
							renderItem={ (item) => (<PaginationItem
								type={ "start-ellipsis" }
								component={ Link }
								selected
								to={ `?page=${ item.page }` }
								{ ...item }
							/>) }
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
	driversStatus: state.driver.driversStatus,
	myAccount: state.users.myAccount,
})

const mapDispatchToProps = {
	getDrivers
}

const DriversContainer = connect(mapStateToProps, mapDispatchToProps,)(Drivers)

export default withRouter(DriversContainer);
