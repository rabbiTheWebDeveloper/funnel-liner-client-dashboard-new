import React from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const data = [
  {
    name: 'January',
    Quantity: 4000,
    Amount: 900,
    amt: 2400,
  },
  {
    name: 'February',
    Quantity: 3000,
    Amount: 1398,
    amt: 2210,
  },
  {
    name: 'March',
    Quantity: 2000,
    Amount: 9800,
    amt: 2290,
  },
  {
    name: 'April',
    Quantity: 2780,
    Amount: 3908,
    amt: 2000,
  },
  {
    name: 'May',
    Quantity: 1890,
    Amount: 4800,
    amt: 2181,
  },
  {
    name: 'June',
    Quantity: 2390,
    Amount: 3800,
    amt: 2500,
  },
  {
    name: 'July',
    Quantity: 3490,
    Amount: 4300,
    amt: 2100,
  },
  {
    name: 'August',
    Quantity: 4000,
    Amount: 2400,
    amt: 2400,
  },
  {
    name: 'September',
    Quantity: 3000,
    Amount: 1398,
    amt: 2210,
  },
  {
    name: 'October',
    Quantity: 2000,
    Amount: 9800,
    amt: 2290,
  },
  {
    name: 'November',
    Quantity: 2780,
    Amount: 3908,
    amt: 2000,
  },
  {
    name: 'December',
    Quantity: 180,
    Amount: 400,
    amt: 2181,
  },
];


const ChartDesign = ({ data }) => {

  const CustomYAxisTick = (props) => {
    const { x, y, payload } = props;

    const formattedValue =
      payload.value >= 1000 ? `${payload.value / 1000}k` : payload.value;

    return (
      <text x={x} y={y} dy={16} textAnchor="end" fill="#666">
        {formattedValue}
      </text>
    );
  };

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <ResponsiveContainer>

        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
        >

          <CartesianGrid strokeDasharray="3 4" />
          <XAxis dataKey="name" tick={{
            fontFamily: 'Poppins',
            fontSize: '14px',
            color: 'var(--grey-40, #A2A3A5)',
            lineHeight: '5px',
            marginTop: '10px'
          
          }}
            margin={{ top: 50 }}   padding={{ left: 30, right: 30 , bottom: 30 }} />
          <YAxis
            tickFormatter={(value) => (value >= 1000 ? `${value / 1000}k` : value)}
            tick={CustomYAxisTick}
          />
          <Tooltip />
          <Legend />



          {/* <Line type="monotone" dataKey="product_qty" stroke="#7459D9" activeDot={{ r: 8 }} strokeWidth={4} /> */}
          <Line type="monotone" dataKey="Amount" stroke="#FB896B" activeDot={{ r: 8 }} strokeWidth={4} />
        </LineChart>
      </ResponsiveContainer>


    </div>
  );
};

export default ChartDesign;
