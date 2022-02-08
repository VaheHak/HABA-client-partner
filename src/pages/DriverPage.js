import React, { Component } from 'react';
import Wrapper from "../components/Wrapper";
import { connect } from "react-redux";
import _ from "lodash";
import { Link, Redirect, withRouter } from "react-router-dom";
import DriverMap from "../components/map/DriverMap";
import { getDrivers, sendMessage } from "../store/actions/partnior/driver";
import UserHeader from "../components/UserHeader";
import { ArrowBackIos, LocalOffer, Phone, Email, Star, Speed, Sms } from "@material-ui/icons";
import { Button, Tooltip } from "@mui/material";
import t from "../helpers/transletor";
import ModalButton from "../components/modals/modal";
import Input from "../components/form/Input";

class DriverPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			partnerId: this.props.match.params.id,
			branchId: this.props.match.params.bId,
			driverId: this.props.match.params.dId,
			createFormData: {},
		};
	}

	componentDidMount() {
		const {partnerId, branchId} = this.state;
		this.props.getDrivers(1, partnerId, branchId);
	}

	handleChange = (path, ev) => {
		const {createFormData} = this.state;
		_.set(createFormData, path, ev);
		this.setState({createFormData})
	}
	handleSubmit = () => {
		const {createFormData} = this.state;
		this.setState({createFormData});
		this.props.sendMessage(createFormData).then((d) => {
			if (d.payload.data.status === true){
				this.setState({createFormData: {}});
			}
		})
	}

	render() {
		const {drivers, coordsList, onlineDrivers, messageErr, myAccount} = this.props;
		const {driverId, createFormData, partnerId, branchId} = this.state;
		const avatar = "/images/avatars/avatar.jpg"
		const d = _.find(drivers?.array || [], ["id", +driverId]);
		const c = _.find(coordsList || [], ["driverId", +driverId]);
		if (myAccount?.userPartners && myAccount?.userPartners?.subscribe !== true){
			return <Redirect to={ `/${ partnerId }/${ branchId }/subscribe` }/>
		}

		return (<Wrapper showFooter={ false }>
			<UserHeader title={ <div className="active_drivers_filter">
				<Tooltip title={ t.back } arrow>
					<Button sx={ {background: '#212121', color: 'white', minWidth: '10px', padding: '5px 8px'} }
					        variant="contained" onClick={ () => this.props.history.goBack() }>
						<ArrowBackIos/>
					</Button>
				</Tooltip>
				<h3 className="users__title">{ t.driverDetails }</h3>
			</div> }/>
			<div className="container">
				<div className="w100 dfj">
					<div className="active_drivers_left">
						<div className="active_drivers_list">
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
									<h5>{ d?.driverUser?.firstName || '-' } { d?.driverUser?.lastName || '-' }</h5>
									<div className="driver_rate">
										<Star fontSize="small"/>{ d?.rating || 0 }
									</div>
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
							<div className="driver_contact_item">
								<div className="driver_contact_icon">
									<Speed fontSize="small"/>
								</div>
								<p>{ d?.dailyDistance || '- ' }km</p>
							</div>
							<div className="driver_contact_item">
								<div className="driver_contact_icon">
									<LocalOffer fontSize="small"/>
								</div>
								<p>${ d?.dailyPrice || ' -' }</p>
							</div>
						</div>
					</div>
					<div className="active_drivers_right">
						<DriverMap
							name={ d ? d?.driverUser : {} }
							coords={ !_.isEmpty(c?.coords) ? c?.coords : d?.coords }
							state={ !_.isEmpty(c?.coords) ? c?.coords : d?.coords }
						/>
						<div className="driver_map_contact">
							<ModalButton
								title={ "Send Message" }
								label={ "Message" }
								div={ <img src="/images/icons/sms.svg" alt="contact"/> }
								cl={ 'log_out' }
								enter={ 'Send' }
								c={ true }
								onClick={ () => this.handleSubmit() }
								input={ <div className="users__filter_row">
									<div className="dfj">
										<Sms/>&ensp;
										<Input
											size='small'
											type={ "text" }
											value={ createFormData.message ? createFormData.message : '' }
											className="w100"
											multiline
											minRows={ 4 }
											maxRows={ 7 }
											errors={ messageErr.message ? messageErr.message : null }
											placeholder={ "Message" }
											title={ createFormData.message }
											onChange={ (event) => {
												this.handleChange('message', event.target.value);
												this.handleChange('email', d?.driverUser?.email);
											} }
										/>
									</div>
								</div> }
							/>
							<a href={ `tel:${ d?.driverUser?.phoneNumber }` } title={ "Call" }>
								<img src="/images/icons/tel.svg" alt="contact"/>
							</a>
							<Link href="#">
								<img src="/images/icons/send.svg" alt="send"/>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</Wrapper>);
	}
}

const mapStateToProps = (state) => ({
	drivers: state.driver.drivers, onlineDrivers: state.driver.onlineDrivers,
	coordsList: state.driver.coordsList,
	messageErr: state.driver.messageErr,
	myAccount: state.users.myAccount,
})

const mapDispatchToProps = {
	getDrivers,
	sendMessage,
}

const DriverPageContainer = connect(mapStateToProps, mapDispatchToProps,)(DriverPage)

export default withRouter(DriverPageContainer);
