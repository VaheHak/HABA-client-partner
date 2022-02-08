import React, { Component } from 'react';
import Wrapper from "../../src/components/Wrapper";
import UserHeader from "../../src/components/UserHeader";
import _ from "lodash";
import '../../src/assets/css/pages/historyDetails.css'
import { withRouter } from "react-router-dom";
import {
	LocalOffer, LocationOn, Person, Phone, ShoppingCart, Sms,
} from "@material-ui/icons";
import { connect } from "react-redux";
import { Button } from "@mui/material";
import t from "../helpers/transletor";
import DriverMap from "../components/map/DriverMap";
import Input from "../components/form/Input";
import PhoneInput from "../components/form/PhoneInput";
import ErrorEnum from "../helpers/ErrorHandler";
import { faBox, faClipboardList, faStore } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { validateInput } from "../helpers/InputValidation";
import { createOrder } from "../store/actions/partnior/delivery";

class AddOrder extends Component {
	constructor(props) {
		super(props);
		this.state = {
			createFormData: {},
			shop: false,
			branchId: this.props.match.params.bId,
			partnerId: this.props.match.params.id,
			driverId: this.props.match.params.dId,
			branch: {},
			storeDetails: [{}],
			sc: '',
		}
	}

	componentDidMount() {
		const {branches} = this.props;
		const {branchId} = this.state;
		const branch = _.find(branches, ['id', +branchId]);
		this.setState({branch})
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevState.createFormData !== this.state.createFormData){
			return this.state.createFormData;
		}
		if (prevProps.createOrder !== this.props.createOrder){
			return this.props.createOrder;
		}
		if (prevProps.branches !== this.props.branches){
			const {branchId} = this.state;
			const branch = _.find(this.props.branches, ['id', +branchId]);
			this.setState({branch})
		}
	}

	handleChange = (path, ev) => {
		const {createFormData} = this.state;
		_.set(createFormData, path, ev);
		this.setState({createFormData})
	}

	addDetail = () => {
		const {storeDetails} = this.state;
		storeDetails.push({});
		this.setState({storeDetails, sc: storeDetails.length > 1 ? +storeDetails.length - 1 : 0})
	}
	handleChangeDetails = (path, ev, k) => {
		const {storeDetails, createFormData} = this.state;
		_.set(storeDetails[k], path, ev);
		_.set(createFormData, "storeDetails", storeDetails);
		this.setState({storeDetails, createFormData})
	}

	handleSubmit = () => {
		const {createFormData, partnerId, branchId, driverId} = this.state;
		_.set(createFormData, 'partner', partnerId);
		_.set(createFormData, 'partnerBranchId', branchId);
		_.set(createFormData, 'driver', driverId);
		this.setState({createFormData});
		this.props.createOrder(createFormData).then((d) => {
			if (d.payload.data.status === true){
				this.setState({createFormData: {}});
			}
		})
	}

	render() {
		const {createOrderErr, createStatus, onlineDrivers, coordsList} = this.props;
		const {createFormData, shop, branch, storeDetails, sc, driverId} = this.state;
		const b = _.find(branch?.driverPartnerBranches, ['id', +driverId]);
		const avatar = "/images/avatars/avatar.jpg";
		const c = _.find(coordsList || [], ["driverId", +driverId]);

		return (<Wrapper>
			<UserHeader title={ <h3 className="users__title">{ t.makeOrder }</h3> }/>
			<div className="container">
				<div className="users__content">
					<div className="dfj">
						<div className="clients_left">
							<div className="dfc w100">
								<div className='add_order_box' onClick={ () => this.setState({shop: false}) }>
									<div style={ {background: shop ? '#212121' : '#0076FF'} } className="addOrder_box_icon">
										<FontAwesomeIcon icon={ faBox }/>
									</div>
									<h4>{ t.deliveryOrder }</h4>
								</div>
								<div className='add_order_box' onClick={ () => {
									this.handleChange('buyForMe', true);
									this.setState({shop: true});
								} }>
									<div style={ {background: shop ? '#0076FF' : '#212121'} } className="addOrder_box_icon2">
										<ShoppingCart/>
									</div>
									<h4>{ t.shoppingOrder }</h4>
								</div>
							</div>
							<br/>
							{ shop ? _.map(storeDetails, (v, k) => +sc === +k ? (<div key={ k }>
								<div className="dfc">
									{ +storeDetails.length <= 1 ? <h4>{ t.shoppingOrderDetails }</h4> :
										<Button variant="contained" onClick={ () => this.addDetail() }
										        sx={ {background: 'black', color: 'white', textTransform: 'unset'} }>
											+ { t.addShop }
										</Button> }
									{ +storeDetails.length > 1 ? <div className="select_shop">
										{ _.map(storeDetails, (i, j) => (
											<div className="select_shop_icon" style={ {color: +sc === +j ? '#212121' : 'gray'} } key={ j }
											     onClick={ () => this.setState({sc: j}) }>
												{ +j + 1 }&ensp;<FontAwesomeIcon icon={ faStore }/>
											</div>)) }
									</div> : <div className="add_shop_button" onClick={ () => this.addDetail() }>+</div> }
								</div>
								<br/>
								<div className="dfj">
									<div className="add_client_icon">
										<FontAwesomeIcon icon={ faStore }/>
									</div>
									<label className='add_client_label'>
										<h5>&ensp;{ t.shopName }</h5><br/>
										<Input
											size='small'
											type={ "text" }
											value={ v.name ? v.name : '' }
											className="w100"
											errors={ createOrderErr[`storeDetails.${ k }.name`] ? createOrderErr[`storeDetails.${ k }.name`] : null }
											placeholder={ "Name" }
											title={ v.name }
											onChange={ (event) => this.handleChangeDetails('name', event.target.value, k) }
										/>
									</label>
								</div>
								<br/>
								<div className="dfj">
									<div className="add_client_icon">
										<LocationOn/>
									</div>
									<label className='add_client_label'>
										<h5>&ensp;{ t.shopAddress }</h5><br/>
										<Input
											size='small'
											type={ "text" }
											value={ v.address ? v.address : '' }
											className="w100"
											errors={ createOrderErr[`storeDetails.${ k }.address`] ? createOrderErr[`storeDetails.${ k }.address`] : null }
											placeholder={ "Address" }
											title={ v.address }
											onChange={ (event) => this.handleChangeDetails('address', event.target.value, k) }
										/>
									</label>
								</div>
								<br/>
								<div className="dfj">
									<div className="add_client_icon">
										<FontAwesomeIcon icon={ faClipboardList }/>
									</div>
									<label className='add_client_label'>
										<h5>&ensp;{ t.shoppingList }</h5><br/>
										<Input
											size='small'
											type={ "text" }
											value={ v.list ? v.list : '' }
											className="w100"
											multiline
											minRows={ 4 }
											maxRows={ 7 }
											errors={ createOrderErr[`storeDetails.${ k }.list`] ? createOrderErr[`storeDetails.${ k }.list`] : null }
											placeholder={ "List" }
											title={ v.list }
											onChange={ (event) => this.handleChangeDetails('list', event.target.value, k) }
										/>
									</label>
								</div>
							</div>) : null) : <>
								<h4>{ t.deliveryOrderDetails }</h4>
								<br/>
								<div className="dfj">
									<div className="add_client_icon">
										<Person/>
									</div>
									<label className='add_client_label'>
										<h5>&ensp;{ t.clientName }</h5><br/>
										<Input
											size='small'
											type={ "text" }
											value={ createFormData.customerName ? createFormData.customerName : '' }
											className="w100"
											errors={ createOrderErr.customerName ? createOrderErr.customerName : null }
											placeholder={ "Name" }
											title={ createFormData.customerName }
											onChange={ (event) => this.handleChange('customerName', event.target.value) }
										/>
									</label>
								</div>
								<br/>
								<div className="dfj">
									<div className="add_client_icon">
										<LocationOn/>
									</div>
									<label className='add_client_label'>
										<h5>&ensp;{ t.address }</h5><br/>
										<Input
											size='small'
											type={ "text" }
											value={ createFormData.deliveryAddress ? createFormData.deliveryAddress : '' }
											className="w100"
											errors={ createOrderErr.deliveryAddress ? createOrderErr.deliveryAddress : null }
											placeholder={ "Address" }
											title={ createFormData.deliveryAddress }
											onChange={ (event) => this.handleChange('deliveryAddress', event.target.value) }
										/>
									</label>
								</div>
								<br/>
								<div className="dfj">
									<div className="add_client_icon">
										<Phone/>
									</div>
									<label className='add_client_label'>
										<h5>&ensp;{ t.phoneNumber }</h5><br/>
										<PhoneInput
											className="w100"
											value={ createFormData.customerPhoneNumber ? createFormData.customerPhoneNumber : "" }
											errors={ createOrderErr.customerPhoneNumber ? ErrorEnum[createOrderErr.customerPhoneNumber] ? ErrorEnum[createOrderErr.customerPhoneNumber] : createOrderErr.customerPhoneNumber : null }
											title={ createFormData.customerPhoneNumber ? createFormData.customerPhoneNumber : null }
											onChange={ (event) => this.handleChange('customerPhoneNumber', event && !event.toString().includes('+') ? `+${ event }` : event) }
										/>
									</label>
								</div>
								<br/>
								<div className="dfj">
									<div className="add_client_icon">
										<LocalOffer/>
									</div>
									<label className='add_client_label'>
										<h5>&ensp;{ t.deliveryPrice }</h5><br/>
										<Input
											size='small'
											type={ "number" }
											value={ createFormData.deliveryPrice ? createFormData.deliveryPrice : '' }
											className="w100"
											errors={ createOrderErr.deliveryPrice ? createOrderErr.deliveryPrice : null }
											placeholder={ "Delivery Price" }
											title={ createFormData.deliveryPrice }
											onChange={ (event) => this.handleChange('deliveryPrice', validateInput(event.target.value)) }
										/>
									</label>
								</div>
								<br/>
								<div className="dfj">
									<div className="add_client_icon">
										<Sms/>
									</div>
									<label className='add_client_label'>
										<h5>&ensp;{ t.comment }</h5><br/>
										<Input
											size='small'
											type={ "text" }
											value={ createFormData.description ? createFormData.description : '' }
											className="w100"
											errors={ createOrderErr.description ? createOrderErr.description : null }
											placeholder={ "Comment" }
											title={ createFormData.description }
											onChange={ (event) => this.handleChange('description', event.target.value) }
										/>
									</label>
								</div>
							</> }
							<br/>
							<br/>
							<div className="add_client_button">
								<div className="dfj">
									<Button title={ t.cancel } className="add__user" variant="contained"
									        onClick={ () => this.props.history.goBack() }>
										{ t.cancel }
									</Button>
									<Button onClick={ this.handleSubmit } className={ createStatus === 'request' ? "" : "add__user" }
									        disabled={ createStatus === 'request' }
									        variant="contained" title={ t.submit }>
										{ createStatus === 'request' ? t.wait : t.submit }
									</Button>
								</div>
							</div>
						</div>
						<div className="clients_right">
							<div className={ `order_driver_item` }>
								<div className="active_drivers_avatar">
									<img
										src={ b?.avatar || avatar } alt="avatar"
										onError={ ev => {
											ev.target.src = avatar
										} }/>
									{ onlineDrivers.includes(+b?.driverUser?.id) ? <div className='on'/> : <div className='off'/> }
								</div>
								<div className="order_drivers_info">
									<p>{ t.driver }</p>
									<h5>{ b?.driverUser?.firstName || '-' } { b?.driverUser?.lastName || '-' }</h5>
									<p>{ _.upperFirst(b?.driverCars?.color) } { b?.driverCars?.make } { b?.driverCars?.model } { b?.driverCars?.number }</p>
								</div>
								<a href={ `tel:${ b?.driverUser?.phoneNumber }` }
								   className="driver_call">
									<Phone fontSize="small"/>
								</a>
							</div>
							<DriverMap
								name={ b ? b?.driverUser : {} }
								coords={ !_.isEmpty(c?.coords) ? c?.coords : b?.coords }
								state={ !_.isEmpty(c?.coords) ? c?.coords : b?.coords }
							/>
						</div>
					</div>
				</div>
			</div>
		</Wrapper>);
	}
}

const mapStateToProps = (state) => ({
	createOrder: state.delivery.createOrder,
	createOrderErr: state.delivery.createOrderErr,
	createStatus: state.delivery.createStatus,
	branches: state.users.branches,
	onlineDrivers: state.driver.onlineDrivers,
	myAccount: state.users.myAccount,
	coordsList: state.driver.coordsList,
})

const mapDispatchToProps = {
	createOrder,
}

const AddOrderContainer = connect(mapStateToProps, mapDispatchToProps,)(AddOrder)

export default withRouter(AddOrderContainer);
