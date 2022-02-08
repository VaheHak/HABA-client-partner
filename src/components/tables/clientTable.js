import React, { Component } from 'react';
import _ from "lodash";
import "../../assets/css/components/tables.css";
import { Link, withRouter } from "react-router-dom";
import t from "../../helpers/transletor";
import { DoubleArrow } from "@material-ui/icons";

class ClientTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			branchId: this.props.match.params.bId,
			partnerId: this.props.match.params.id,
		}
	}

	render() {
		const {data} = this.props;
		const {branchId, partnerId} = this.state;

		return (
			_.map(data, (v, k) => (v ?
				<table className="tableT" key={ k }>
					<tbody>
					<tr className="trT">
						<td className="tdT">{ v.id }</td>
						<td className="tdT">{ v.name || '-' }</td>
						<td className="tdT">{ v.address || '-' }</td>
						<td className="tdT">{ v.phoneNumber || '-' }</td>
						<td className="tdT">{ v.email || '-' }</td>
						<td className="tdT">
							<Link to={ `/${ partnerId }/${ branchId }/clients/${ v.id }` } title={ t.edit }>
								<DoubleArrow fontSize="small"/>
							</Link>
						</td>
					</tr>
					</tbody>
				</table>
				: null))
		);
	}
}

export default withRouter(ClientTable);
