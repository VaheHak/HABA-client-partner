import React, { Component } from 'react';
import Wrapper from "../../src/components/Wrapper";
import UserHeader from "../../src/components/UserHeader";
import _ from "lodash";
import '../../src/assets/css/pages/delivery.css'
import { Link, NavLink, withRouter } from "react-router-dom";
import {
	AccessTime, Event, Home, LocalOffer, Restaurant, Search, Speed, Star
} from "@material-ui/icons";
import { getDeliveryOrders } from "../store/actions/partnior/delivery";
import { connect } from "react-redux";
import { Pagination, PaginationItem } from "@mui/material";
import t from "../helpers/transletor";
import moment from "moment";

class DeliveryOrders extends Component {
	constructor(props) {
		super(props);
		this.state = {
			formData: {},
			branchId: this.props.match.params.bId,
			status: [{id: 0, name: "Created"}, {id: 1, name: "Pending"}, {id: 2, name: "Took"}, {id: 3, name: "Done"}],
		}
	}

	componentDidMount() {
		const {branchId} = this.state;
		const s = new URLSearchParams(this.props.location.search);
		if (branchId){
			this.props.getDeliveryOrders(branchId, s.get('page') ? s.get('page') : 1, void 0, void 0, void 0, 3);
		}
	}

	handleSelectFilter = (path, event) => {
		const {formData, branchId} = this.state;
		_.set(formData, path, event);
		this.setState({formData});
		this.props.getDeliveryOrders(branchId, 1, formData.endDate, formData.startDate, formData.address, 3);
	}

	render() {
		const {orders, orderStatus, branches} = this.props;
		const {formData, branchId} = this.state;
		const avatar = "/images/avatars/avatar.jpg";
		const branch = _.find(branches, ['id', +branchId]);

		return (<Wrapper>
			<UserHeader title={ <h3 className="users__title">{ t.deliveryOrders }</h3> }/>
			<div className="container">
				<div className="users__content">
					<div className="users__filter_area">
						<div className="search_input">
							<Search fontSize="small" className="search_icon"/>
							<input type="search" placeholder='Search'/>
						</div>
					</div>
					<div className="order_history">
						{ orderStatus === 'request' ? <p className="center">Loading...</p> : _.isEmpty(orders.array) ?
							<p className="center">No Orders</p> : _.map(orders.array || [], (i) => (
								<div key={ i?.id } className="order_history_row">
									<NavLink to={ `/${ i?.partnerId }/${ i?.partnerBranchId }/orders/${ i?.id }` }
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
										<img src={ i?.deliveryServiceDriver?.avatar || avatar } alt="avatar" onError={ ev => {
											ev.target.src = avatar
										} } className="order_driver_image"/>&ensp;
										<span>
													<p>{ i?.deliveryServiceDriver?.driverUser?.firstName || '-' }</p>
													<p>{ i?.deliveryServiceDriver?.driverUser?.lastName || '-' }</p>
												</span>
										<div className="driver_rate">
											<Star fontSize="small"/>{ i?.deliveryServiceDriver?.rating || 0 }
										</div>
									</div>
								</div>)) }
					</div>
					<br/>
					<br/>
					<div className="center">
						<Pagination
							count={ +orders?.totalPages || 1 } variant="outlined" page={ +orders?.currentPage || 1 }
							shape="rounded" showFirstButton showLastButton style={ {margin: "0 auto"} }
							onChange={ (event, page) => {
								this.props.getDeliveryOrders(branchId, page, formData.endDate, formData.startDate, formData.address, 3);
								this.handleChange('page', page);
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
					<br/>
				</div>
			</div>
		</Wrapper>);
	}
}

const mapStateToProps = (state) => ({
	orders: state.delivery.orders, orderStatus: state.delivery.orderStatus, branches: state.users.branches,

})

const mapDispatchToProps = {
	getDeliveryOrders,
}

const DeliveryOrdersContainer = connect(mapStateToProps, mapDispatchToProps,)(DeliveryOrders)

export default withRouter(DeliveryOrdersContainer);
