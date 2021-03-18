import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { StoreContext } from "../../../index";
import {
  CartesianGrid,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

/**
 * This function will assign a new color for a given index
 * This function is assumed to be called in a loop
 * Once preset colors are exhausted it will generate a random one
 *
 * @param {number} idx - the index of the call
 * @returns {string} - a hex code of color
 */
const makeChartColor = (idx) => {
  const colors = [
    "#042278",
    "#a87fff",
    "#d60542",
    "#3267d4",
    "#8c94ac",
    "#31ddc1",
    "#319b9d",
    "#d34363",
    "#bb1330",
    "#571b47",
  ];

  if (idx + 1 <= colors.length) {
    return colors[idx];
  } else {
    return "#000000".replace(/0/g, function () {
      return (~~(Math.random() * 16)).toString(16);
    });
  }
};

const DDot = (props) => {
  return (
    <svg height={props.height} width={props.width}>
      <circle
        cx={props.cx}
        cy={props.cy}
        r={props.r}
        stroke={props.payload.isActual ? "green" : props.stroke}
        strokeWidth={props.payload.isActual ? 2 : props.strokeWidth}
        fill={props.payload.isActual ? "green " : props.fill}
      />
    </svg>
  );
};

export const DemandChart = observer(() => {
  const { demandStore } = useContext(StoreContext);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart width={600} height={300}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" type="category" allowDuplicatedCategory={false} />
        <YAxis dataKey="y" />
        <Tooltip />
        <Legend />
        {demandStore.demandChartData
          ? Object.keys(
              demandStore.demandChartData[demandStore.demandAgg]
            ).map((sku, idx) => (
              <Line
                type="monotone"
                dataKey="y"
                data={demandStore.demandChartData[demandStore.demandAgg][sku]}
                dot={<DDot />}
                name={sku}
                key={sku}
                stroke={makeChartColor(idx)}
                animationDuration={300}
              />
            ))
          : null}
      </LineChart>
    </ResponsiveContainer>
  );
});
