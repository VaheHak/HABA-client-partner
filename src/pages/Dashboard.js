import React, { Component } from 'react';
import Wrapper from "../components/Wrapper";
import '../assets/css/pages/dashboard.css'
import { connect } from "react-redux";
import Charts from "../components/chart/Chart";
import CargoCharts from "../components/chart/CargoChart";
import _ from "lodash";
import moment from "moment";
import UserHeader from "../components/UserHeader";
import { getStatistic } from "../store/actions/partnior/statistics";
import t from "../helpers/transletor";
import { withRouter } from "react-router-dom";

class Dashboard extends Component {
	static defaultProps = {
		today: new Date(),
	}

	constructor(props) {
		super(props);
		const {today} = this.props;
		this.state = {
			formData: {
				toStartDate: today.toISOString(),
				deliveryToStartDate: today.toISOString(),
			},
			branchId: this.props.match.params.bId,
		}
	}

	componentDidMount() {
		const {branchId} = this.state;
		if (branchId){
			this.props.getStatistic(branchId);
		}
	}

	handleChange = (path, ev) => {
		const {formData, branchId} = this.state;
		_.set(formData, path, ev);
		this.setState({formData});
		this.props.getStatistic(branchId, formData.toStartDate, formData.fromStartDate, formData.deliveryToStartDate, formData.deliveryFromStartDate,)
	}

	render() {
		const {statistics} = this.props;
		const {formData} = this.state;

		return (<Wrapper showFooter={ false }>
			<UserHeader title={ <h3 className="users__title">{ t.dashboard }</h3> }/>
			<div className="container">
				<div className="users__content">
					<menu className="dashboard">
						<div className="details_content">
							<div className="details_item">
								<b className="details__item_title">Orders</b>
								<div>
									<h3>{ statistics.orders }</h3>
									<i>Total Count</i>
								</div>
							</div>
							<div className="details_item">
								<b className="details__item_title">Orders</b>
								<div>
									<h3>${ statistics.orderPrice }</h3>
									<i>Total Price</i>
								</div>
							</div>
							<div className="details_item">
								<b className="details__item_title">Delivery</b>
								<div>
									<h3>${ statistics.deliveryPrice }</h3>
									<i>Total Price</i>
								</div>
							</div>
						</div>
						<div className="details_content">
							<div className="details_row">
								<div className="users_count">
									<p>Total Drivers</p>
									<h3>{ statistics.drivers }</h3>
								</div>
							</div>
							<div className="details_row">
								<div className="users_count">
									<p>Total Clients</p>
									<h3>{ statistics.clients }</h3>
								</div>
							</div>
						</div>
						<div className="details_content">
							<div className="dashboard_charts">
								<div className="dfc">
									<p>
										{ moment(_.minBy(statistics.allOrders, 'date')?.date).format('MMMM DD') }&ensp;-&ensp;
										{ moment(_.maxBy(statistics.allOrders, 'date')?.date).format('MMMM DD') }
									</p>
									<div className="dashboard_select-date">
										<input type="date"
										       value={ formData.deliveryFromStartDate ? formData.deliveryFromStartDate : '' }
										       className="dashboard__filter_input"
										       max={ new Date().toISOString().substring(0, 10) }
										       onChange={ (event) => this.handleChange('deliveryFromStartDate', event.target.value) }
										/>
									</div>
								</div>
								<br/>
								<CargoCharts data={ statistics.allOrders }/>
							</div>
							<div className="dashboard_charts">
								<div className="dfc">
									<p>
										{ moment(_.minBy(statistics.allPrices, 'createdAt')?.createdAt).format('MMMM DD') }&ensp;-&ensp;
										{ moment(_.maxBy(statistics.allPrices, 'createdAt')?.createdAt).format('MMMM DD') }
									</p>
									<div className="dashboard_select-date">
										<input type="date"
										       value={ formData.fromStartDate ? formData.fromStartDate : '' }
										       className="dashboard__filter_input"
										       max={ new Date().toISOString().substring(0, 10) }
										       onChange={ (event) => this.handleChange('fromStartDate', event.target.value) }
										/>
									</div>
								</div>
								<br/>
								<Charts data={ statistics.allPrices }/>
							</div>
						</div>
					</menu>
					<br/>
				</div>
			</div>
		</Wrapper>);
	}
}

const mapStateToProps = (state) => ({
	statistics: state.statistics.statistics,
})

const mapDispatchToProps = {
	getStatistic
}

const DashboardContainer = connect(mapStateToProps, mapDispatchToProps,)(Dashboard)

export default withRouter(DashboardContainer);
