import { combineReducers } from "redux";
import users from './partner/users';
import delivery from './partner/delivery';
import driver from './partner/driver';
import clients from './partner/clients';
import statistics from './partner/statistics';

export default combineReducers({
  users,
  delivery,
  driver,
  clients,
  statistics,
})
