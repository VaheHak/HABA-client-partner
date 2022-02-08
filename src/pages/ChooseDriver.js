import React, { Component } from 'react';
import Wrapper from "../../src/components/Wrapper";
import UserHeader from "../../src/components/UserHeader";
import _ from "lodash";
import '../../src/assets/css/pages/historyDetails.css'
import { NavLink, withRouter } from "react-router-dom";
import { DoubleArrow, Star, } from "@material-ui/icons";
import { connect } from "react-redux";
import DriverMap from "../components/map/DriverMap";
import { getDrivers } from "../store/actions/partnior/driver";
import t from "../helpers/transletor";

class ChooseDriver extends Component {
	constructor(props) {
		super(props);
		this.state = {
			branchId: this.props.match.params.bId,
			partnerId: this.props.match.params.id,
			branch: {},
			formData: {},
		}
	}

	componentDidMount() {
		const {branches} = this.props;
		const {branchId, partnerId} = this.state;
		const branch = _.find(branches, ['id', +branchId]);
		this.setState({branch});
		this.props.getDrivers(1, partnerId, branchId);
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const {branches} = this.props;
		const {branchId} = this.state;
		if (prevProps.branches !== branches){
			const branch = _.find(branches, ['id', +branchId]);
			this.setState({branch})
		}
	}

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
		const {drivers, coordsList, onlineDrivers} = this.props;
		const {branch, partnerId, branchId} = this.state;
		const b = branch?.driverPartnerBranches;
		const avatar = "/images/avatars/avatar.jpg";

		return (<Wrapper>
			<UserHeader title={ <h3 className="users__title">{ t.makeOrder }</h3> }/>
			<div className="container">
				<div className="chooseDriver">
					<div className="chooseDriver_left">
						<div className="active_drivers_list" ref={ (r) => this.scroll = r }
						     onScroll={ () => this.changePage() }>
							{ !_.isEmpty(b) ? _.map(b || [], (v, k) => (v ?
								<NavLink to={ `/${ partnerId }/${ branchId }/orderList/add_order/${ v?.id }` } key={ v?.id || k }
								         className={ `active_drivers_item` }>
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
								</NavLink> : null)) : <p className="center">No active drivers</p> }
						</div>
					</div>
					<div className="w100 h100">
						<DriverMap
							allDrivers={ drivers?.array ? drivers?.array : [] }
							coordsList={ coordsList }/>
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
	branches: state.users.branches,
})

const mapDispatchToProps = {
	getDrivers,
}

const ChooseDriverContainer = connect(mapStateToProps, mapDispatchToProps,)(ChooseDriver)

export default withRouter(ChooseDriverContainer);
