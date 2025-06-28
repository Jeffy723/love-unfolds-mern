// File: components/MomentCard.js (Note the name change for clarity)

import React from 'react';
import { Card, Button, Col } from 'react-bootstrap';

function MomentCard({ moment, onDelete }) {
  // This code is already correct and will work once the backend sends the right data.
  return (
    <Col md={4} className="mb-4">
      <Card className="shadow-sm h-100">
        {moment.selectedFile && (
          <Card.Img variant="top" src={moment.selectedFile} style={{ height: '200px', objectFit: 'cover' }} />
        )}
        <Card.Body className="d-flex flex-column">
          <Card.Title>{moment.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{moment.creator}</Card.Subtitle>
          <Card.Text>{moment.message}</Card.Text>
          <div className="mt-auto">
            <Card.Text>
              <small className="text-muted">Tags: {moment.tags.join(', ')}</small>
            </Card.Text>
            <Button variant="danger" onClick={() => onDelete(moment._id)}>Delete</Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default MomentCard;