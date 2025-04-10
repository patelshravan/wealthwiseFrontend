import React, { useEffect, useState } from "react";
import { Card, Spinner, Row, Col, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import { getDashboardStats } from "../../../services/dashboard.service";
import MonthlyExpenseChart from "./MonthlyExpenseChart";
import SmartSuggestions from "./SmartSuggestions";
import MonthlySavingsChart from "./MonthlySavingsChart";
import ExpenseCategoryChart from "./ExpenseCategoryChart";
import InvestmentPerformanceChart from "./InvestmentPerformanceChart";
import RecentActivity from "./RecentActivity";

const cardStyle = {
  minHeight: "100px",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  padding: "16px",
};

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await getDashboardStats(token);
      setStats(res.data);
    } catch (err) {
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "60vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container fluid className="px-md-4">
      <h5 className="mb-3 fw-semibold">Dashboard Overview</h5>
      <Row className="g-3">
        <Col xs={12} sm={6} md={4} lg={3}>
          <Card
            style={cardStyle}
            className="border-start border-3 border-primary text-center"
          >
            <div className="small text-muted">Total Expenses</div>
            <div className="fw-bold fs-5 text-primary">
              ₹ {stats.totalExpenses.toLocaleString("en-IN")}
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={4} lg={3}>
          <Card
            style={cardStyle}
            className="border-start border-3 border-success text-center"
          >
            <div className="small text-muted">Total Invested</div>
            <div className="fw-bold fs-5 text-success">
              ₹ {stats.totalInvested.toLocaleString("en-IN")}
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={4} lg={3}>
          <Card
            style={cardStyle}
            className="border-start border-3 border-warning text-center"
          >
            <div className="small text-muted">Current Investment Value</div>
            <div className="fw-bold fs-5 text-warning">
              ₹ {stats.totalCurrentValue.toLocaleString("en-IN")}
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={4} lg={3}>
          <Card
            style={cardStyle}
            className="border-start border-3 border-danger text-center"
          >
            <div className="small text-muted">Total Premium</div>
            <div className="fw-bold fs-5 text-danger">
              ₹ {stats.totalPremium.toLocaleString("en-IN")}
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={6} lg={3}>
          <Card
            style={cardStyle}
            className="border-start border-3 border-info text-center"
          >
            <div className="small text-muted">Total Savings</div>
            <div className="fw-bold fs-5 text-info">
              ₹ {stats.totalSavings.toLocaleString("en-IN")}
            </div>
          </Card>
        </Col>
      </Row>
      {stats.smartSuggestions?.length > 0 && (
        <Row className="mt-4">
          <Col xs={12}>
            <SmartSuggestions suggestions={stats.smartSuggestions} />
          </Col>
        </Row>
      )}
      {stats.trends?.expenses?.length > 0 && (
        <Row className="mt-4">
          <Col xs={12}>
            <MonthlyExpenseChart data={stats.trends.expenses} />
          </Col>
        </Row>
      )}
      {stats.trends?.savings?.length > 0 && (
        <Row className="mt-4">
          <Col xs={12}>
            <MonthlySavingsChart data={stats.trends.savings} />
          </Col>
        </Row>
      )}
      {stats.categoryBreakdown?.length > 0 && stats.investmentPerformance && (
        <Row className="mt-4">
          <Col xs={12} md={6}>
            <ExpenseCategoryChart data={stats.categoryBreakdown} />
          </Col>
          <Col xs={12} md={6}>
            <InvestmentPerformanceChart
              data={{
                gainOrLoss: stats.investmentPerformance.gainOrLoss,
                returnPercentage: stats.investmentPerformance.returnPercentage,
                totalInvested: stats.totalInvested,
              }}
            />
          </Col>
        </Row>
      )}
      {stats.recentActivity && (
        <Row className="mt-4">
          <Col xs={12}>
            <RecentActivity data={stats.recentActivity} />
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default DashboardPage;
