import React, { Component } from 'react';
import { connect } from "react-redux";
import { deleteToken, getBranches } from "../store/actions/partnior/users";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import Avatars from "./utils/Avatars";
import _ from "lodash";
import ModalButton from "./modals/modal";
import { withRouter } from "react-router-dom";
import t from "../helpers/transletor";

class UserHeader extends Component {
	constructor(props) {
		super(props);
		this.state = {
			partnerId: this.props.match.params.id,
			branchId: this.props.match.params.bId,
		}
	}

	componentDidMount() {
		const {partnerId} = this.state;
		if (partnerId){
			this.props.getBranches(partnerId)
		}
	}

	render() {
		const {title, myAccount, profileStatus} = this.props;
		const avatar = "/images/avatars/avatar.jpg";

		return (<div className="user__header_content">
			<>{ title }</>
			<div className="user__header_right">
				{ profileStatus === 'success' ? <div className='dfc'>
					<Avatars
						src={ myAccount?.userPartners?.image || avatar } alt="avatar"
						onError={ ev => {
							ev.target.src = avatar
						} }/>
					<div>
						<h4>{ myAccount?.roles?.name } { myAccount?.id }</h4>
						<p title={ myAccount?.firstName + ' ' + myAccount?.lastName }>
							{ _.truncate(myAccount?.firstName, {
								'length': 14, 'separator': ' '
							}) } { _.truncate(myAccount?.lastName, {
							'length': 14, 'separator': ' '
						}) }
						</p>
					</div>
				</div> : null }
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
		</div>);
	}
}

const mapStateToProps = (state) => ({
	myAccount: state.users.myAccount,
	profileStatus: state.users.profileStatus,
})

const mapDispatchToProps = {
	deleteToken,
	getBranches,
}

const UserHeaderContainer = connect(
	mapStateToProps,
	mapDispatchToProps,
)(UserHeader)

export default withRouter(UserHeaderContainer);
