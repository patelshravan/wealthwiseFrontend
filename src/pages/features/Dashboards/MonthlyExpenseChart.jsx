import React from "react";
import Chart from "react-apexcharts";
import { Card } from "react-bootstrap";

const MonthlyExpenseChart = ({ data = [] }) => {
  const categories = data.map((item) => {
    const date = new Date(item._id.year, item._id.month - 1);
    return date.toLocaleString("default", { month: "short", year: "2-digit" }); // Feb '25
  });

  const series = [
    {
      name: "Expenses",
      data: data.map((item) => item.total),
    },
  ];

  const options = {
    chart: {
      type: "line",
      height: 300,
      toolbar: { show: false },
    },
    stroke: { curve: "smooth", width: 3 },
    markers: { size: 5 },
    xaxis: {
      categories,
      labels: { style: { fontSize: "12px" } },
    },
    yaxis: {
      labels: {
        formatter: (val) => `₹${val.toLocaleString("en-IN")}`,
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `₹${val.toLocaleString("en-IN")}`,
      },
    },
  };

  return (
    <Card className="mt-4 shadow-sm p-3">
      <h6 className="mb-3">Monthly Expense Trend</h6>
      <Chart options={options} series={series} type="line" height={300} />
    </Card>
  );
};

export default MonthlyExpenseChart;
