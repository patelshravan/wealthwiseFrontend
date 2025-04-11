import React from "react";
import { Card, ListGroup } from "react-bootstrap";

const SmartSuggestions = ({ suggestions = [] }) => {
  if (suggestions.length === 0) return null;

  return (
    <Card className="mt-4 shadow-sm">
      <Card.Body>
        <ListGroup variant="flush">
          {suggestions.map((tip, index) => (
            <ListGroup.Item key={index} className="small">
              {tip}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default SmartSuggestions;
