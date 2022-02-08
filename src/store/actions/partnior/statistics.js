import { define } from "../../../helpers/redux-request";
import Api from "../../../Api";

export const GET_STATISTICS = define('GET_STATISTICS');

export function getStatistic(branchId, toStartDate, fromStartDate, deliveryToStartDate, deliveryFromStartDate) {
	return GET_STATISTICS.request(() => Api.getStatistics(branchId, toStartDate, fromStartDate, deliveryToStartDate, deliveryFromStartDate)).takeLatest();
}
