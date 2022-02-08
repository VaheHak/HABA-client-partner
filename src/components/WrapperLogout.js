import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Results from "./utils/Results";
import Account from "../helpers/Account";
import t from "../helpers/transletor";

class WrapperLogout extends Component {

  render() {
    const {token} = this.props;
    if (window.screen.width <= 1024){
      return <Redirect to="/mobile_app"/>
    }
    if (token){
      return <Redirect to="/choose_branch"/>
    }
    const l = Account.getLang();
    t.setLanguage(l ? l : 'en');

    return (
      <div>
        { this.props.children }
        <Results/>
      </div>
    );
  }

}

const mapStateToProps = (state) => ({
  token: state.users.token,
});

const mapDispatchToProps = {}

const WrapperLogoutContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(WrapperLogout)

export default WrapperLogoutContainer;
