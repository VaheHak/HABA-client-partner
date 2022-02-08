import React, { Component } from 'react';
import Wrapper from "../../src/components/Wrapper";
import UserHeader from "../../src/components/UserHeader";
import _ from "lodash";
import '../../src/assets/css/pages/clients.css'
import { Link, NavLink, withRouter } from "react-router-dom";
import { Search } from "@material-ui/icons";
import { getClients } from "../store/actions/partnior/clients";
import { connect } from "react-redux";
import { Button, Pagination, PaginationItem } from "@mui/material";
import t from "../helpers/transletor";
import ClientTable from "../components/tables/clientTable";

class Clients extends Component {
	constructor(props) {
		super(props);
		this.state = {
			partnerId: this.props.match.params.id, branchId: this.props.match.params.bId,
		}
	}

	componentDidMount() {
		const {branchId} = this.state;
		if (branchId){
			this.props.getClients(branchId, 1);
		}
	}

	render() {
		const {clients, clientsStatus} = this.props;
		const {partnerId, branchId} = this.state;

		return (<Wrapper>
			<UserHeader title={ <h3 className="users__title">{ t.clients }</h3> }/>
			<div className="container">
				<div className="orders__content">
					<div className="users__filter_area">
						<div className="search_input">
							<Search fontSize="small" className="search_icon"/>
							<input type="search" placeholder='Search'/>
						</div>
						<NavLink to={ `/${ partnerId }/${ branchId }/clients/add` }>
							<Button variant="contained" sx={ {background: 'black', color: 'white', textTransform: 'unset'} }>
								+ { t.addClient }
							</Button>
						</NavLink>
					</div>
					<div className="client_content">
						{ clientsStatus === 'request' ? <p className="center">Loading...</p> : _.isEmpty(clients.array) ?
							<p className="center">No Clients</p> : <ClientTable data={ clients?.array }/> }
					</div>
					<br/>
					<div className="center">
						<Pagination
							count={ +clients?.totalPages || 1 } variant="outlined" page={ +clients?.currentPage || 1 }
							shape="rounded" showFirstButton showLastButton style={ {margin: "0 auto"} }
							onChange={ (event, page) => {
								this.props.getClients(branchId, page);
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
				</div>
			</div>
		</Wrapper>);
	}
}

const mapStateToProps = (state) => ({
	clients: state.clients.clients, clientsStatus: state.clients.clientsStatus,
})

const mapDispatchToProps = {
	getClients
}

const ClientsContainer = connect(mapStateToProps, mapDispatchToProps,)(Clients)

export default withRouter(ClientsContainer);
