import React, { ReactElement, useState, useMemo, useEffect } from "react";
import ButtonComponent from "./button-component";
import { getAccents } from "../dashboard-colors";
import usePolkabtcStats from "../../../common/hooks/use-polkabtc-stats";
import LineChartComponent from "./line-chart-component";
const ActiveStakedRelayers = (): ReactElement => {
    const statsApi = usePolkabtcStats();

    const [totalRelayersPerDay, setTotalRelayersPerDay] = useState(new Array<{ date: number; count: number }>());
    const fetchRelayersPerDay = useMemo(
        () => async () => {
            const res = await statsApi.getRecentDailyVaultCounts();
            setTotalRelayersPerDay(res.data);
        },
        [statsApi] // to silence the compiler
    );

    useEffect(() => {
        fetchRelayersPerDay();
    }, [fetchRelayersPerDay]);
    return (
        <div className="card">
            <div className="card-top-content">
                <div className="values-container">
                    <h1 style={{ color: `${getAccents("d_orange").colour}` }}>Active Staked Relayers</h1>
                    <h2>{totalRelayersPerDay[totalRelayersPerDay.length - 1]?.count}</h2>
                </div>
                <div className="button-container">
                    <ButtonComponent buttonName="view relayers" propsButtonColor="d_orange" />
                </div>
            </div>
            <LineChartComponent
                colour="d_orange"
                label="Total active relayers"
                yLabels={totalRelayersPerDay.map((dataPoint) => new Date(dataPoint.date).toLocaleDateString())}
                yAxisProps={{ beginAtZero: true, precision: 0 }}
                data={totalRelayersPerDay.map((dataPoint) => dataPoint.count)}
            />
        </div>
    );
};

export default ActiveStakedRelayers;
