import React, { useEffect, useState } from "react";
import { Card, Spinner, Row, Col, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import { getDashboardStats } from "../../services/dashboard.service";

const cardStyle = {
  minHeight: "130px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
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
      <h4 className="mb-4 fw-bold">Dashboard Overview</h4>
      <Row className="g-4">
        <Col xs={12} sm={6} lg={4}>
          <Card
            style={cardStyle}
            className="border-start border-4 border-primary p-3 text-center"
          >
            <h6 className="text-muted">Total Expenses</h6>
            <h2 className="text-primary fw-semibold">
              ₹ {stats.totalExpenses}
            </h2>
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={4}>
          <Card
            style={cardStyle}
            className="border-start border-4 border-success p-3 text-center"
          >
            <h6 className="text-muted">Total Invested</h6>
            <h2 className="text-success fw-semibold">
              ₹ {stats.totalInvested}
            </h2>
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={4}>
          <Card
            style={cardStyle}
            className="border-start border-4 border-warning p-3 text-center"
          >
            <h6 className="text-muted">Current Investment Value</h6>
            <h2 className="text-warning fw-semibold">
              ₹ {stats.totalCurrentValue}
            </h2>
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={6}>
          <Card
            style={cardStyle}
            className="border-start border-4 border-danger p-3 text-center"
          >
            <h6 className="text-muted">Total Premium</h6>
            <h2 className="text-danger fw-semibold">₹ {stats.totalPremium}</h2>
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={6}>
          <Card
            style={cardStyle}
            className="border-start border-4 border-info p-3 text-center"
          >
            <h6 className="text-muted">Total Savings</h6>
            <h2 className="text-info fw-semibold">₹ {stats.totalSavings}</h2>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardPage;
