import React from "react";
import Chart from "react-apexcharts";
import { Card } from "react-bootstrap";

const ExpenseCategoryChart = ({ data = [] }) => {
  if (data.length === 0) return null;

  const labels = data.map((item) => item._id || "Uncategorized");
  const series = data.map((item) => item.total);

  const options = {
    chart: {
      type: "donut",
    },
    labels,
    legend: {
      position: "bottom",
    },
    tooltip: {
      y: {
        formatter: (val) => `₹${val.toLocaleString("en-IN")}`,
      },
    },
    dataLabels: {
      formatter: (val, opts) => `${val.toFixed(1)}%`,
    },
  };

  return (
    <Card className="mt-4 shadow-sm p-3">
      <h6 className="mb-3">Expense Category Breakdown</h6>
      <Chart options={options} series={series} type="donut" height={320} />
    </Card>
  );
};

export default ExpenseCategoryChart;
