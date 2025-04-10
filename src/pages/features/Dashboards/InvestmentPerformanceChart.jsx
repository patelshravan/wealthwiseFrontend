import React from "react";
import Chart from "react-apexcharts";
import { Card } from "react-bootstrap";

const InvestmentPerformanceChart = ({ data = {} }) => {
  const { gainOrLoss = 0, returnPercentage = 0 } = data;

  const series = [
    {
      name: "Amount (₹)",
      data: [
        {
          x: "Invested",
          y:
            gainOrLoss >= 0
              ? data.gainOrLoss + data.totalInvested
              : data.totalInvested,
        },
        {
          x: "Current Value",
          y: data.gainOrLoss + data.totalInvested,
        },
      ],
    },
  ];

  const options = {
    chart: {
      type: "bar",
      height: 300,
    },
    plotOptions: {
      bar: {
        distributed: true,
        borderRadius: 4,
        horizontal: false,
        columnWidth: "45%",
      },
    },
    colors: ["#0d6efd", "#198754"],
    dataLabels: {
      enabled: true,
      formatter: (val) => `₹${val.toLocaleString("en-IN")}`,
    },
    tooltip: {
      y: {
        formatter: (val) => `₹${val.toLocaleString("en-IN")}`,
      },
    },
    xaxis: {
      labels: { style: { fontSize: "14px" } },
    },
  };

  return (
    <Card className="mt-4 shadow-sm p-3">
      <h6 className="mb-3">Investment Performance</h6>
      <Chart options={options} series={series} type="bar" height={300} />
    </Card>
  );
};

export default InvestmentPerformanceChart;
