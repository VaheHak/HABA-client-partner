import React, { Component } from 'react';
import { Redirect } from "react-router-dom";

class MobileWrapper extends Component {

	render() {
		if (window.screen.width > 1024){
			return <Redirect to="/"/>
		}
		return (
			<div>
				{ this.props.children }
			</div>
		);
	}
}

export default MobileWrapper;
