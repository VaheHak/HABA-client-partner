import React, { Component } from 'react';
import _ from "lodash";
import { deleteToken, getBranches } from "../store/actions/partnior/users";
import { connect } from "react-redux";
import Wrapper from "../components/Wrapper";
import ModalButton from "../components/modals/modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import { DoubleArrow, Restaurant } from "@material-ui/icons";
import t from "../helpers/transletor";

class ChooseBranch extends Component {

	componentDidMount() {
		const {myAccount} = this.props;
		if (myAccount?.userPartners){
			this.props.getBranches(myAccount?.userPartners?.id);
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const {myAccount} = this.props;
		if (prevProps.myAccount !== myAccount && myAccount?.userPartners){
			this.props.getBranches(myAccount?.userPartners?.id);
		}
	}

	render() {
		const {branches, myAccount} = this.props;

		return (
			<Wrapper showHeader={ false }>
				<div className="login__container" style={ {background: `url('/images/bg/loginBg.png')`} }>
					<div className="container">
						<div className="login__content">
							<img className="login__logo" src="/images/logos/haba.png" alt="haba"/>
							<div className="login__form">
								<h3>{ t.chooseBranch }</h3>
								<div className="choose_branch_icon">
									<Restaurant fontSize="large" color="primary"/>
								</div>
								<h4>{ myAccount?.userPartners?.name }</h4>
								<div className="branches__form_content">
									{ _.isEmpty(branches) ? <p className="center h100">{ t.noBranch }</p> :
										<ul className="branches_content">
											{ _.map(branches || [], (v) => (
												<li key={ v?.id } className="center branch_item">
													<NavLink to={ `/${ myAccount?.userPartners?.id }/${ v?.id }/home` }>
														<p>{ v.id } { v.address || 'No address' }</p>
														<DoubleArrow/>
													</NavLink>
												</li>
											)) }
										</ul> }
								</div>
								<ModalButton
									title={ t.logout }
									label={ t.logout }
									className={ "logout" }
									cl={ "log_out" }
									text={ t.areYouSureYouWantToLogout }
									div={ <><FontAwesomeIcon icon={ faSignOutAlt }/>{ t.logout }</> }
									enter={ t.yes }
									onClick={ () => this.props.deleteToken() }
								/>
							</div>
						</div>
					</div>
				</div>
			</Wrapper>
		);
	}
}

const mapStateToProps = (state) => ({
	branches: state.users.branches,
	myAccount: state.users.myAccount,
});

const mapDispatchToProps = {
	getBranches,
	deleteToken,
}

const ChooseBranchContainer = connect(
	mapStateToProps,
	mapDispatchToProps,
)(ChooseBranch)

export default ChooseBranchContainer;
