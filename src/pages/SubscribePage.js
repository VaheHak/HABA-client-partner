import React, { Component } from 'react';
import Wrapper from "../components/Wrapper";
import { withRouter } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import t from "../helpers/transletor";
import Subscribe from "../components/modals/Subscribe";
import "../assets/css/components/subscribe.css";
import { DoubleArrow } from "@material-ui/icons";

class SubscribePage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			partnerId: this.props.match.params.id, branchId: this.props.match.params.bId,
		};
	}

	render() {
		const {partnerId, branchId} = this.state;

		return (<Wrapper showFooter={ false }>
			<UserHeader title={ <h3 className="users__title">{ 'Subscribe' }</h3> }/>
			<div className="container">
				<Subscribe
					label={ 'Subscribe' }
					enter={ t.cancel }
					onClick={ () => this.props.history.push(`/${ partnerId }/${ branchId }/orderList`) }
					cancelClick={ () => this.props.history.push(`/${ partnerId }/${ branchId }/orderList`) }
					input={ <div className="users__filter_row">
						<div className="subscribe_content">
							<h3>Subscribe to be able see online drivers</h3>
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
				/>
			</div>
		</Wrapper>);
	}
}

export default withRouter(SubscribePage);
