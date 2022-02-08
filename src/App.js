import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import DeliveryOrders from "./pages/DeliveryOrders";
import ForgotPassword from "./pages/ForgotPassword";
import ChooseBranch from "./pages/ChooseBranch";
import AddOrder from "./pages/AddOrder";
import UpdateOrder from "./pages/UpdateOrder";
import OrderList from "./pages/OrderList";
import Home from "./pages/Home";
import DriverPage from "./pages/DriverPage";
import HistoryDetails from "./pages/HistoryDetails";
import Drivers from "./pages/Drivers";
import Clients from "./pages/Clients";
import AddClient from "./pages/AddClient";
import UpdateClient from "./pages/UpdateClient";
import ChooseDriver from "./pages/ChooseDriver";
import Settings from "./pages/Settings";
import AddDriver from "./pages/AddDriver";
import Dashboard from "./pages/Dashboard";
import SubscribePage from "./pages/SubscribePage";
import MobileApp from "./pages/MobileApp";

class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<Switch>
					<Route path="/" exact component={ Login }/>
					<Route path="/:id/:bId/home" exact component={ Home }/>
					<Route path="/:id/:bId/home/:dId" exact component={ DriverPage }/>
					<Route path="/:id/:bId/orders" exact component={ DeliveryOrders }/>
					<Route path="/:id/:bId/orders/:oId" exact component={ HistoryDetails }/>
					<Route path="/:id/:bId/orderList/choose_driver" exact component={ ChooseDriver }/>
					<Route path="/:id/:bId/orderList/add_order/:dId" exact component={ AddOrder }/>
					<Route path="/:id/:bId/orderList" exact component={ OrderList }/>
					<Route path="/:id/:bId/orderList/update_orders/:oId" exact component={ UpdateOrder }/>
					<Route path="/:id/:bId/drivers" exact component={ Drivers }/>
					<Route path="/:id/:bId/drivers/add" exact component={ AddDriver }/>
					<Route path="/:id/:bId/clients" exact component={ Clients }/>
					<Route path="/:id/:bId/clients/add" exact component={ AddClient }/>
					<Route path="/:id/:bId/clients/:cId" exact component={ UpdateClient }/>
					<Route path="/forgot_password" exact component={ ForgotPassword }/>
					<Route path="/choose_branch" exact component={ ChooseBranch }/>
					<Route path="/:id/:bId/settings" exact component={ Settings }/>
					<Route path="/:id/:bId/dashboard" exact component={ Dashboard }/>
					<Route path="/:id/:bId/subscribe" exact component={ SubscribePage }/>
					<Route path="/mobile_app" exact component={ MobileApp }/>

					<Route exact component={ NotFound }/>
				</Switch>
			</BrowserRouter>
		);
	}
}

export default App;
