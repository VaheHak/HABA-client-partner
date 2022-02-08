import React, { Component } from 'react';
import Wrapper from "../../src/components/Wrapper";
import UserHeader from "../../src/components/UserHeader";
import _ from "lodash";
import '../../src/assets/css/pages/orders.css'
import { NavLink, withRouter } from "react-router-dom";
import { AccessTime, Event, Home, Restaurant, Search, Phone, Speed, LocalOffer } from "@material-ui/icons";
import {
	getCreatedOrders, getDoneOrders, getPendingOrders, getTookOrders
} from "../store/actions/partnior/delivery";
import { connect } from "react-redux";
import { Button } from "@mui/material";
import t from "../helpers/transletor";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";

class OrderList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			formData: {}, branchId: this.props.match.params.bId, partnerId: this.props.match.params.id,
		}
	}

	componentDidMount() {
		const {branchId} = this.state;
		if (branchId){
			this.props.getCreatedOrders(branchId, 1, void 0, void 0, void 0, 0);
			this.props.getPendingOrders(branchId, 1, void 0, void 0, void 0, 1);
			this.props.getTookOrders(branchId, 1, void 0, void 0, void 0, 2);
			this.props.getDoneOrders(branchId, 1, void 0, void 0, void 0, 3);
		}
	}

	handleSelectFilter = (path, event) => {
		const {formData, branchId} = this.state;
		_.set(formData, path, event);
		this.setState({formData});
		this.props.getCreatedOrders(branchId, 1, formData.endDate, formData.startDate, formData.address, 0, formData.driver);
		this.props.getPendingOrders(branchId, 1, formData.endDate, formData.startDate, formData.address, 1, formData.driver);
		this.props.getTookOrders(branchId, 1, formData.endDate, formData.startDate, formData.address, 2, formData.driver);
		this.props.getDoneOrders(branchId, 1, formData.endDate, formData.startDate, formData.address, 3, formData.driver);
	}

	changePage = (ev, data, status) => {
		const {formData, branchId} = this.state;
		if (ev.target.scrollHeight - ev.target.scrollTop <= +ev.target.clientHeight + 150){
			if (+data?.currentPage < +data?.totalPages){
				const page = data?.currentPage ? data.currentPage + 1 : 1;
				_.set(formData, "page", page);
				+status === 0 ? this.props.getCreatedOrders(branchId, formData.page, formData.endDate, formData.startDate, formData.address, status, formData.driver) : +status === 1 ? this.props.getPendingOrders(branchId, formData.page, formData.endDate, formData.startDate, formData.address, status, formData.driver) : +status === 2 ? this.props.getTookOrders(branchId, formData.page, formData.endDate, formData.startDate, formData.address, status, formData.driver) : this.props.getDoneOrders(branchId, formData.page, formData.endDate, formData.startDate, formData.address, status, formData.driver);
				this.setState({formData});
			}
		}
	}


	render() {
		const {
			created,
			pending,
			took,
			done,
			createdData,
			pendingData,
			tookData,
			doneData,
			createdStatus,
			pendingStatus,
			tookStatus,
			doneStatus,
			branches
		} = this.props;
		const {branchId, partnerId} = this.state;
		const avatar = "/images/avatars/avatar.jpg";
		const branch = _.find(branches, ['id', +branchId]);

		return (<Wrapper>
			<UserHeader title={ <h3 className="users__title">{ t.orders }</h3> }/>
			<div className="container">
				<div className="orders__content">
					<div className="users__filter_area">
						<div className="search_input">
							<Search fontSize="small" className="search_icon"/>
							<input type="search" placeholder='Search'/>
						</div>
						<NavLink to={ `/${ partnerId }/${ branchId }/orderList/choose_driver` }>
							<Button variant="contained" sx={ {background: 'black', color: 'white', textTransform: 'unset'} }>
								+ { t.makeOrder }
							</Button>
						</NavLink>
					</div>
					<div className="dfj w100">
						<div className="order_list_item">
							<div className="order_list_title"><h4>{ t.create }</h4><span>{ createdData?.totalItems || 0 }</span></div>
							<div className="order_list_row" ref={ (r) => this.scroll = r }
							     onScroll={ (ev) => this.changePage(ev, createdData, 0) }>
								{ createdStatus === 'request' && _.isEmpty(created) ?
									<p className="center">Loading...</p> : _.isEmpty(created) ? <div className="noData_row">
										<FontAwesomeIcon icon={ faFolderOpen } className="noData"/><br/>
										<p>No Data</p>
									</div> : _.map(created || [], (i) => (i ? <div key={ i?.id } className="order_block_row"><NavLink
										to={ `/${ i?.partnerId }/${ i?.partnerBranchId }/orderList/update_orders/${ i?.id }` }
										className="order_block" key={ i?.id }>
										<div className="order_block_title">
											<div className="dfa">
												<div className="order_block_icon">
													<Restaurant color="primary"/>
												</div>
												<div>
													<p>Pick up order</p>
													<h4>{ branch?.address }</h4>
												</div>
											</div>
											<h5 title={ i?.id } className="dfa">
												&ensp;#{ _.truncate(i?.id, {
												'length': 14, 'separator': ' '
											}) }
											</h5>
										</div>
										<br/>
										<div className="dfa">
											<div className="order_block_icon">
												<Home color="primary"/>
											</div>
											<div>
												<p>{ t.deliveryAddress }</p>
												<h4>{ i?.deliveryAddress || '-' }</h4>
											</div>
										</div>
										<br/>
										<div className="order_dates">
											<div className="dfc">
												<Event fontSize="small"/>&ensp;{ i.createdAt ? moment(i.createdAt).format('L') : 'No date' }
											</div>
											<div className="dfc">
												<AccessTime
													fontSize="small"/>&ensp;{ i.createdAt ? moment(i.createdAt).format('LT') : 'No time' }
											</div>
										</div>
									</NavLink>
										<div className="order_driver_block">
											<img src={ i?.deliveryServiceDriver?.avatar || avatar } alt="avatar" onError={ ev => {
												ev.target.src = avatar
											} } className="order_driver_image"/>&ensp;
											<span>
													<p>{ i?.deliveryServiceDriver?.driverUser?.firstName || '-' }</p>
													<p>{ i?.deliveryServiceDriver?.driverUser?.lastName || '-' }</p>
												</span>
											<a href={ `tel:${ i?.deliveryServiceDriver?.driverUser?.phoneNumber }` }
											   className="driver_call">
												<Phone fontSize="small"/>
											</a>
										</div>
									</div> : null)) }
							</div>
						</div>
						<div className="order_list_item">
							<div className="order_list_title"><h4>{ t.pending }</h4><span>{ pendingData?.totalItems || 0 }</span>
							</div>
							<div className="order_list_row" ref={ (r) => this.scroll = r }
							     onScroll={ (ev) => this.changePage(ev, pendingData, 1) }>
								{ pendingStatus === 'request' && _.isEmpty(pending) ?
									<p className="center">Loading...</p> : _.isEmpty(pending) ? <div className="noData_row">
										<FontAwesomeIcon icon={ faFolderOpen } className="noData"/><br/>
										<p>No Data</p>
									</div> : _.map(pending || [], (i) => (i ? <div key={ i?.id } className="order_block_row"><NavLink
										to={ `/${ i?.partnerId }/${ i?.partnerBranchId }/orderList/update_orders/${ i?.id }` }
										className="order_block" key={ i?.id }>
										<div className="order_block_title">
											<div className="dfa">
												<div className="order_block_icon">
													<Restaurant color="primary"/>
												</div>
												<div>
													<p>Pick up order</p>
													<h4>{ branch?.address }</h4>
												</div>
											</div>
											<h5 title={ i?.id } className="dfa">
												&ensp;#{ _.truncate(i?.id, {
												'length': 14, 'separator': ' '
											}) }
											</h5>
										</div>
										<br/>
										<div className="dfa">
											<div className="order_block_icon">
												<Home color="primary"/>
											</div>
											<div>
												<p>{ t.deliveryAddress }</p>
												<h4>{ i?.deliveryAddress || '-' }</h4>
											</div>
										</div>
										<br/>
										<div className="order_dates">
											<div className="dfc">
												<Event
													fontSize="small"/>&ensp;{ i.pendingDate ? moment(i.pendingDate).format('L') : 'No date' }
											</div>
											<div className="dfc">
												<AccessTime
													fontSize="small"/>&ensp;{ i.pendingDate ? moment(i.pendingDate).format('LT') : 'No time' }
											</div>
										</div>
									</NavLink>
										<div className="order_driver_block">
											<img src={ avatar } alt="avatar" onError={ ev => {
												ev.target.src = avatar
											} } className="order_driver_image"/>&ensp;
											<span>
													<p>{ i?.deliveryServiceDriver?.driverUser?.firstName || '-' }</p>
													<p>{ i?.deliveryServiceDriver?.driverUser?.lastName || '-' }</p>
												</span>
											<a href={ `tel:${ i?.deliveryServiceDriver?.driverUser?.phoneNumber }` }
											   className="driver_call">
												<Phone fontSize="small"/>
											</a>
										</div>
									</div> : null)) }
							</div>
						</div>
						<div className="order_list_item">
							<div className="order_list_title"><h4>{ t.took }</h4><span>{ tookData?.totalItems || 0 }</span></div>
							<div className="order_list_row" ref={ (r) => this.scroll = r }
							     onScroll={ (ev) => this.changePage(ev, tookData, 2) }>
								{ tookStatus === 'request' && _.isEmpty(took) ? <p className="center">Loading...</p> : _.isEmpty(took) ?
									<div className="noData_row">
										<FontAwesomeIcon icon={ faFolderOpen } className="noData"/><br/>
										<p>No Data</p>
									</div> : _.map(took || [], (i) => (i ? <div key={ i?.id } className="order_block_row"><NavLink
										to={ `/${ i?.partnerId }/${ i?.partnerBranchId }/orderList/update_orders/${ i?.id }` }
										className="order_block" key={ i?.id }>
										<div className="order_block_title">
											<div className="dfa">
												<div className="order_block_icon">
													<Restaurant color="primary"/>
												</div>
												<div>
													<p>Pick up order</p>
													<h4>{ branch?.address }</h4>
												</div>
											</div>
											<h5 title={ i?.id } className="dfa">
												&ensp;#{ _.truncate(i?.id, {
												'length': 14, 'separator': ' '
											}) }
											</h5>
										</div>
										<br/>
										<div className="dfa">
											<div className="order_block_icon">
												<Home color="primary"/>
											</div>
											<div>
												<p>{ t.deliveryAddress }</p>
												<h4>{ i?.deliveryAddress || '-' }</h4>
											</div>
										</div>
										<br/>
										<div className="order_dates">
											<div className="dfc">
												<Event
													fontSize="small"/>&ensp;{ i.tookDate ? moment(i.tookDate).format('L') : 'No date' }
											</div>
											<div className="dfc">
												<AccessTime
													fontSize="small"/>&ensp;{ i.tookDate ? moment(i.tookDate).format('LT') : 'No time' }
											</div>
										</div>
									</NavLink>
										<div className="order_driver_block">
											<img src={ avatar } alt="avatar" onError={ ev => {
												ev.target.src = avatar
											} } className="order_driver_image"/>&ensp;
											<span>
													<p>{ i?.deliveryServiceDriver?.driverUser?.firstName || '-' }</p>
													<p>{ i?.deliveryServiceDriver?.driverUser?.lastName || '-' }</p>
												</span>
											<a href={ `tel:${ i?.deliveryServiceDriver?.driverUser?.phoneNumber }` }
											   className="driver_call">
												<Phone fontSize="small"/>
											</a>
										</div>
									</div> : null)) }
							</div>
						</div>
						<div className="order_list_item">
							<div className="order_list_title"><h4>{ t.done }</h4><span>{ doneData?.totalItems || 0 }</span></div>
							<div className="order_list_row" ref={ (r) => this.scroll = r }
							     onScroll={ (ev) => this.changePage(ev, doneData, 3) }>
								{ doneStatus === 'request' && _.isEmpty(done) ? <p className="center">Loading...</p> : _.isEmpty(done) ?
									<div className="noData_row">
										<FontAwesomeIcon icon={ faFolderOpen } className="noData"/><br/>
										<p>No Data</p>
									</div> : _.map(done || [], (i) => (i ? <div key={ i?.id } className="order_block_row">
										<NavLink to={ `/${ i?.partnerId }/${ i?.partnerBranchId }/orderList/update_orders/${ i?.id }` }
										         className="order_block" key={ i?.id }>
											<div className="order_block_title">
												<div className="dfa">
													<div className="order_block_icon">
														<Restaurant color="primary"/>
													</div>
													<div>
														<p>Pick up order</p>
														<h4>{ branch?.address }</h4>
													</div>
												</div>
												<h5 title={ i?.id } className="dfa">
													&ensp;#{ _.truncate(i?.id, {
													'length': 14, 'separator': ' '
												}) }
												</h5>
											</div>
											<br/>
											<div className="dfa">
												<div className="order_block_icon">
													<Home color="primary"/>
												</div>
												<div>
													<p>{ t.deliveryAddress }</p>
													<h4>{ i?.deliveryAddress || '-' }</h4>
												</div>
											</div>
											<br/>
										</NavLink>
										<div className="order_history_block">
											<div className="order_history_dates">
												<div className="dfa">
													<Event
														fontSize="small"/>&ensp;{ i.doneDate ? moment(i.doneDate).format('L') : 'No date' }
												</div>
												<div className="dfa">
													<AccessTime
														fontSize="small"/>&ensp;{ i.doneDate ? moment(i.doneDate).format('LT') : 'No time' }
												</div>
											</div>
											<div className="order_history_dates">
												<div className="dfa">
													<Speed
														fontSize="small"/>&ensp;{ i.km ? i.km : '-' } km
												</div>
												<div className="dfa">
													<LocalOffer
														fontSize="small"/>&ensp;{ i.deliveryPrice ? i.deliveryPrice : '-' } $
												</div>
											</div>
										</div>
										<div className="order_driver_block">
											<img src={ avatar } alt="avatar" onError={ ev => {
												ev.target.src = avatar
											} } className="order_driver_image"/>&ensp;
											<span>
													<p>{ i?.deliveryServiceDriver?.driverUser?.firstName || '-' }</p>
													<p>{ i?.deliveryServiceDriver?.driverUser?.lastName || '-' }</p>
												</span>
											<a href={ `tel:${ i?.deliveryServiceDriver?.driverUser?.phoneNumber }` }
											   className="driver_call">
												<Phone fontSize="small"/>
											</a>
										</div>
									</div> : null)) }
							</div>
						</div>
					</div>
				</div>
			</div>
		</Wrapper>);
	}
}

const mapStateToProps = (state) => ({
	created: state.delivery.created,
	pending: state.delivery.pending,
	took: state.delivery.took,
	done: state.delivery.done,
	createdData: state.delivery.createdData,
	pendingData: state.delivery.pendingData,
	tookData: state.delivery.tookData,
	doneData: state.delivery.doneData,
	createdStatus: state.delivery.createdStatus,
	pendingStatus: state.delivery.pendingStatus,
	tookStatus: state.delivery.tookStatus,
	doneStatus: state.delivery.doneStatus,
	branches: state.users.branches,
})

const mapDispatchToProps = {
	getCreatedOrders, getPendingOrders, getTookOrders, getDoneOrders,
}

const OrderListContainer = connect(mapStateToProps, mapDispatchToProps,)(OrderList)

export default withRouter(OrderListContainer);
