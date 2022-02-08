import React from "react";
import { Axis, Chart, LineAdvance, Tooltip } from "bizcharts";
import moment from "moment-timezone";

const cols = {
	count: {
		tickInterval: 3, alias: "Orders"
	},
};

const LineChart = React.memo(({data}) => {
	return (<Chart padding={ [10, 20, 60, 40] } scale={ cols } autoFit height={ 400 } data={ data }>
			<Axis name="count" label={ {formatter: val => val} }/>
			<Axis name="date" label={ {formatter: val => moment(val).tz('UTC').calendar()} }/>
			<Tooltip title={ (title) => moment(title).tz('UTC').format('llll') }/>
			<LineAdvance
				shape="smooth"
				point
				area
				position="date*count"
				color="#76CD4E"
			/>
		</Chart>);
});

function CargoCharts(props) {
	return (<div className="chart_content">
			<LineChart data={ props.data }/>
		</div>);
}

export default CargoCharts;
