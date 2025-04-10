import React from "react";
import { Card, Table, Tabs, Tab } from "react-bootstrap";

const RecentActivity = ({ data }) => {
  if (!data) return null;

  const renderTable = (items, type) => (
    <Table striped bordered hover responsive size="sm" className="mb-0">
      <thead className="table-light">
        <tr>
          {type === "policies" ? (
            <>
              <th>Policy Name</th>
              <th>Premium</th>
              <th>Due Date</th>
            </>
          ) : (
            <>
              <th>Amount</th>
              <th>Note / Category</th>
              <th>Date</th>
            </>
          )}
        </tr>
      </thead>
      <tbody>
        {items.length === 0 ? (
          <tr>
            <td colSpan={3} className="text-muted text-center">
              No records found.
            </td>
          </tr>
        ) : (
          items.map((item, idx) => (
            <tr key={idx}>
              {type === "policies" ? (
                <>
                  <td>{item.policyName}</td>
                  <td>₹{item.premiumAmount.toLocaleString("en-IN")}</td>
                  <td>
                    {new Date(item.dueDate || item.createdAt).toDateString()}
                  </td>
                </>
              ) : (
                <>
                  <td>₹{item.amount?.toLocaleString("en-IN") || 0}</td>
                  <td>{item.note || item.category || "--"}</td>
                  <td>
                    {new Date(
                      item.date ||
                        item.startDate ||
                        item.dueDate ||
                        item.createdAt
                    ).toDateString()}
                  </td>
                </>
              )}
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );

  return (
    <Card className="mt-4 shadow-sm">
      <Card.Body>
        <Card.Title className="h6 mb-3">Recent Activity 📋</Card.Title>
        <Tabs defaultActiveKey="expenses" className="mb-3" fill>
          <Tab eventKey="expenses" title="Expenses">
            {renderTable(data.expenses, "expenses")}
          </Tab>
          <Tab eventKey="savings" title="Savings">
            {renderTable(data.savings, "savings")}
          </Tab>
          <Tab eventKey="investments" title="Investments">
            {renderTable(data.investments, "investments")}
          </Tab>
          <Tab eventKey="policies" title="LIC Policies">
            {renderTable(data.policies, "policies")}
          </Tab>
        </Tabs>
      </Card.Body>
    </Card>
  );
};

export default RecentActivity;
