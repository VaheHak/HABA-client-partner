import React, { Component } from 'react';
import Wrapper from "../../src/components/Wrapper";
import UserHeader from "../../src/components/UserHeader";
import _ from "lodash";
import '../../src/assets/css/pages/historyDetails.css'
import { withRouter } from "react-router-dom";
import {
	AccessTime, ArrowBackIos, Event, Home, LocalOffer, Restaurant, Speed, Star
} from "@material-ui/icons";
import { getDeliveryOrder } from "../store/actions/partnior/delivery";
import { connect } from "react-redux";
import { Button, Tooltip } from "@mui/material";
import t from "../helpers/transletor";
import moment from "moment";
import DriverMap from "../components/map/DriverMap";

class DeliveryOrders extends Component {
	constructor(props) {
		super(props);
		this.state = {
			branchId: this.props.match.params.bId, orderId: this.props.match.params.oId,
		}
	}

	componentDidMount() {
		const {orderId} = this.state;
		if (orderId){
			this.props.getDeliveryOrder(orderId);
		}
	}

	render() {
		const {order, branches, onlineDrivers} = this.props;
		const {branchId} = this.state;
		const avatar = "/images/avatars/avatar.jpg";
		const branch = _.find(branches, ['id', +branchId]);

		return (<Wrapper>
			<UserHeader title={ <div className="active_drivers_filter">
				<Tooltip title={ t.back } arrow>
					<Button sx={ {background: '#212121', color: 'white', minWidth: '10px', padding: '5px 8px'} }
					        variant="contained" onClick={ () => this.props.history.goBack() }>
						<ArrowBackIos/>
					</Button>
				</Tooltip>
				<h3 className="users__title">{ t.historyDetails }</h3>
			</div> }/>
			<div className="container">
				<div className="users__content dfj">
					<div className="history_left">
						<DriverMap
							name={ order ? order?.deliveryServiceDriver?.driverUser : {} }
							coords={ !_.isEmpty(order?.deliveryCoordinates) ? order?.deliveryCoordinates : [] }
							state={ !_.isEmpty(order?.deliveryCoordinates) ? order?.deliveryCoordinates : [] }
						/>
					</div>
					<div className="history_right">
						{ order ? <div className="history_content">
							<div>
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
								</div>
								<br/>
								<div className="dfa">
									<div className="order_block_icon">
										<Home color="primary"/>
									</div>
									<div>
										<p>{ t.deliveryAddress }</p>
										<h4>{ order?.deliveryAddress || '-' }</h4>
									</div>
								</div>
							</div>
							<div className="history_block_row">
								<div className="order_history_dates">
									<div className="dfa">
										<Event
											fontSize="small"/>&ensp;{ order.doneDate ? moment(order.doneDate).format('L') : 'No date' }
									</div>
									<br/>
									<div className="dfa">
										<LocalOffer
											fontSize="small"/>&ensp;{ order.deliveryPrice ? order.deliveryPrice : '-' } $
									</div>
									<br/>
									<div className="dfa">
										<Speed
											fontSize="small"/>&ensp;{ order.km ? order.km : '-' } km
									</div>
								</div>
								<div className="order_history_dates">
									<div className="dfa">
										<AccessTime
											fontSize="small"/>&ensp;{ order.pendingDate ? moment(order.pendingDate).format('LT') : 'No time' }
									</div>
									<br/>
									<div className="dfa">
										<AccessTime
											fontSize="small"/>&ensp;{ order.tookDate ? moment(order.tookDate).format('LT') : 'No time' }
									</div>
									<br/>
									<div className="dfa">
										<AccessTime
											fontSize="small"/>&ensp;{ order.doneDate ? moment(order.doneDate).format('LT') : 'No time' }
									</div>
								</div>
							</div>
							<div className={ `active_driver_item` }>
								<div className="active_drivers_avatar">
									<img
										src={ avatar } alt="avatar"
										onError={ ev => {
											ev.target.src = avatar
										} }/>
									{ onlineDrivers.includes(+order?.deliveryServiceDriver?.driverUser?.id) ? <div className='on'/> :
										<div className='off'/> }
								</div>
								<div className="active_driver_info">
									<h5>{ order?.deliveryServiceDriver?.driverUser?.firstName || '-' } { order?.deliveryServiceDriver?.driverUser?.lastName || '-' }</h5>
									<div className="driver_rate">
										<Star fontSize="small"/>{ order?.deliveryServiceDriver?.rating || 0 }
									</div>
								</div>
							</div>
							<div className="history_car_block">
								<div>
									<h5>{ _.upperFirst(order?.deliveryServiceDriver?.driverCars?.color) } { order?.deliveryServiceDriver?.driverCars?.make } { order?.deliveryServiceDriver?.driverCars?.model } </h5>
									<h5>{ order?.deliveryServiceDriver?.driverCars?.number }</h5>
								</div>
								<img src="/images/pic/car.png" alt="car"/>
							</div>
							<div className='history_star_block'>
								<Star style={ {color: +order?.deliveryServiceDriver?.rating >= 1 ? '#FFDB4A' : 'gray'} }/>
								<Star style={ {color: +order?.deliveryServiceDriver?.rating >= 2 ? '#FFDB4A' : 'gray'} }/>
								<Star style={ {color: +order?.deliveryServiceDriver?.rating >= 3 ? '#FFDB4A' : 'gray'} }/>
								<Star style={ {color: +order?.deliveryServiceDriver?.rating >= 4 ? '#FFDB4A' : 'gray'} }/>
								<Star style={ {color: +order?.deliveryServiceDriver?.rating === 5 ? '#FFDB4A' : 'gray'} }/>
							</div>
						</div> : <p className="center">No Order</p> }
					</div>
				</div>
			</div>
		</Wrapper>);
	}
}

const mapStateToProps = (state) => ({
	order: state.delivery.order,
	orderStatus: state.delivery.orderStatus,
	branches: state.users.branches,
	onlineDrivers: state.driver.onlineDrivers,
})

const mapDispatchToProps = {
	getDeliveryOrder,
}

const DeliveryOrdersContainer = connect(mapStateToProps, mapDispatchToProps,)(DeliveryOrders)

export default withRouter(DeliveryOrdersContainer);
