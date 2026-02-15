import React, { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import renderActiveShape from "./HomePageCart/renderActiveShape";
import { border } from "@mui/system";

const COLORS = ["#F5B849", "#6B2CD1", "#23B7E5", "#26BF94"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const activeData = payload[0];
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          padding: "5px",
          color: activeData.fill,
        }}
      >
        <p>{`${activeData.name}: ${activeData.value}%`}</p>
      </div>
    );
  }

  return null;
};

const PieChartPage = ({
  newCannelList,
  innerRadius,
  outerRadius,
  width,
  height,
  color = COLORS,
}) => {
  const [activeIndex, setActiveIndex] = useState(-1); // Initialize activeIndex to -1

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(-1); // Reset activeIndex to -1 when leaving the pie chart
  };

  function convertToPercentages(arr) {
    const total = arr.reduce((acc, item) => acc + item.value, 0);
    const result = arr.map(item => ({
      name: item.name,
      value: parseFloat(((item.value / total) * 100).toFixed(2)),
    }));
    return result;
  }

  // Usage example
  const transformedData = convertToPercentages(newCannelList);

  return (
    <ResponsiveContainer width={width || "100%"} height={height || 400}>
      <PieChart width={width || 600} height={height || 400}>
        <Pie
          data={transformedData}
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          innerRadius={innerRadius || 40}
          outerRadius={outerRadius || 100}
          fill="#8884d8"
          paddingAngle={1}
          dataKey="value"
          onMouseEnter={onPieEnter}
          onMouseLeave={onPieLeave} // Add onMouseLeave event handler
        >
          {transformedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={color[index % color.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartPage;
