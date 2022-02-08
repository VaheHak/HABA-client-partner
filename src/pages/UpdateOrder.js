import React, { Component } from 'react';
import _ from "lodash";
import { LocalOffer, LocationOn, Person, Phone, ShoppingCart, Sms } from "@material-ui/icons";
import Input from "../../src/components/form/Input";
import { Button } from "@mui/material";
import { connect } from "react-redux";
import Wrapper from "../../src/components/Wrapper";
import { withRouter } from "react-router-dom";
import ErrorEnum from "../../src/helpers/ErrorHandler";
import PhoneInput from "../../src/components/form/PhoneInput";
import { deleteDeliveryData, deleteOrder, getDeliveryOrder, updateOrder } from "../store/actions/partnior/delivery";
import { validateInput } from "../helpers/InputValidation";
import { getBranches } from "../store/actions/partnior/users";
import t from "../helpers/transletor";
import UserHeader from "../components/UserHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faClipboardList, faStore } from "@fortawesome/free-solid-svg-icons";
import DriverMap from "../components/map/DriverMap";
import ModalButton from "../components/modals/modal";

class UpdateOrder extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: this.props.match.params.oId,
			shop: false,
			branchId: this.props.match.params.bId,
			partnerId: this.props.match.params.id,
			branch: {},
			storeDetails: [{}],
			sc: '',
			formData: {},
		};
	}

	componentDidMount() {
		const {id, branchId} = this.state;
		this.props.getDeliveryOrder(id);
		const {branches} = this.props;
		const branch = _.find(branches, ['id', +branchId]);
		this.setState({branch})
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const id = this.props.match.params.oId;
		const {updateOrder, order, branches} = this.props;
		if (+prevState.id !== +id){
			this.setState({id});
		}
		if (prevProps.updateOrder !== updateOrder){
			return updateOrder;
		}
		if (prevProps.order !== order && !_.isEmpty(order?.orderShops)){
			this.setState({storeDetails: order?.orderShops || [{}]});
		}
		if (prevProps.branches !== branches){
			const {branchId} = this.state;
			const branch = _.find(branches, ['id', +branchId]);
			this.setState({branch})
		}
	}

	addDetail = () => {
		const {storeDetails} = this.state;
		storeDetails.push({});
		this.setState({storeDetails, sc: storeDetails.length > 1 ? +storeDetails.length - 1 : 0})
	}
	handleChangeDetails = (path, ev, k) => {
		const {storeDetails, formData} = this.state;
		_.set(storeDetails[k], path, ev);
		_.set(formData, "storeDetails", storeDetails);
		this.setState({storeDetails, formData})
	}

	handleChange = (path, ev) => {
		const {formData} = this.state;
		_.set(formData, path, ev);
		this.setState({formData});
		if (!_.isEmpty(this.props.updateOrderErr)){
			this.props.deleteDeliveryData();
		}
	}

	handleSubmit = (id) => {
		const {formData} = this.state;
		_.set(formData, 'id', id);
		this.setState({formData});
		this.props.updateOrder(formData).then(async (d) => {
			if (d.payload.data.status === true){
				await this.props.getDeliveryOrder(id);
				this.setState({formData: {}});
			}
		});
	}

	render() {
		const {updateOrderErr, order, orderStatus, updateStatus, onlineDrivers, coordsList} = this.props;
		const {formData, shop, branch, storeDetails, sc, partnerId, branchId} = this.state;
		const b = _.find(branch?.driverPartnerBranches, ['id', +order?.driverId]);
		const avatar = "/images/avatars/avatar.jpg";
		const c = _.find(coordsList || [], ["driverId", +order?.driverId]);

		return (<Wrapper showFooter={ false }>
			<UserHeader title={ <h3 className="users__title">Update Order</h3> }/>
			<div className="container">
				<div className="users__content">
					{ orderStatus === "success" && !_.isEmpty(order) ? <div className="dfj">
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
											errors={ updateOrderErr[`storeDetails.${ k }.name`] ? updateOrderErr[`storeDetails.${ k }.name`] : null }
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
											errors={ updateOrderErr[`storeDetails.${ k }.address`] ? updateOrderErr[`storeDetails.${ k }.address`] : null }
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
											errors={ updateOrderErr[`storeDetails.${ k }.list`] ? updateOrderErr[`storeDetails.${ k }.list`] : null }
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
											defaultValue={ order?.customerName || '' }
											className="w100"
											errors={ updateOrderErr.customerName ? updateOrderErr.customerName : null }
											placeholder={ "Name" }
											title={ formData.customerName }
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
											defaultValue={ order?.deliveryAddress || '' }
											className="w100"
											errors={ updateOrderErr.deliveryAddress ? updateOrderErr.deliveryAddress : null }
											placeholder={ "Address" }
											title={ formData.deliveryAddress }
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
											defaultValue={ order?.customerPhoneNumber || "" }
											errors={ updateOrderErr.customerPhoneNumber ? ErrorEnum[updateOrderErr.customerPhoneNumber] ? ErrorEnum[updateOrderErr.customerPhoneNumber] : updateOrderErr.customerPhoneNumber : null }
											title={ formData.customerPhoneNumber ? formData.customerPhoneNumber : null }
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
											defaultValue={ order?.deliveryPrice || '' }
											className="w100"
											errors={ updateOrderErr.deliveryPrice ? updateOrderErr.deliveryPrice : null }
											placeholder={ "Delivery Price" }
											title={ formData.deliveryPrice }
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
											defaultValue={ order?.description || '' }
											className="w100"
											errors={ updateOrderErr.description ? updateOrderErr.description : null }
											placeholder={ "Comment" }
											title={ formData.description }
											onChange={ (event) => this.handleChange('description', event.target.value) }
										/>
									</label>
								</div>
							</> }
							<br/>
							<br/>
							<div className="update_client_button">
								<div className="dfj">
									<Button title={ t.cancel } className="add__user" variant="contained"
									        onClick={ () => this.props.history.goBack() }>
										{ t.cancel }
									</Button>&ensp;&ensp;
									<ModalButton
										title={ t.deleteOrder }
										label={ t.deleteOrder }
										className={ "add__user" }
										cl={ 'log_out' }
										text={ t.areYouSureYouWantToDeleteThisOrder }
										button={ t.deleteOrder }
										enter={ t.yes }
										onClick={ () => this.props.deleteOrder(order?.id)
											.then(() => this.props.history.push(`/${ partnerId }/${ branchId }/orderList`)) }
									/>
									<Button onClick={ () => this.handleSubmit(order?.id) } variant={ "contained" } title={ t.save }
									        className={ _.isEmpty(formData) || updateStatus === "request" ? "" : "add__user" }
									        disabled={ _.isEmpty(formData) || updateStatus === "request" }
									>
										{ updateStatus === 'request' ? t.wait : t.save }
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
					</div> : <><br/><p className="center">{ orderStatus === "request" ? 'loading...' : t.noSuchOrder }</p></> }
				</div>
			</div>
		</Wrapper>);
	}
}

const mapStateToProps = (state) => ({
	order: state.delivery.order,
	orderStatus: state.delivery.orderStatus,
	updateOrder: state.delivery.updateOrder,
	updateStatus: state.delivery.updateStatus,
	updateOrderErr: state.delivery.updateOrderErr,
	branches: state.users.branches,
	onlineDrivers: state.driver.onlineDrivers,
	myAccount: state.users.myAccount,
	coordsList: state.driver.coordsList,
})

const mapDispatchToProps = {
	getBranches, getDeliveryOrder, deleteOrder, updateOrder, deleteDeliveryData,
}

const UpdateOrderContainer = connect(mapStateToProps, mapDispatchToProps,)(UpdateOrder)

export default withRouter(UpdateOrderContainer);
