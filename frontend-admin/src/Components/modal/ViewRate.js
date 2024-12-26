import React, { useEffect, useState } from "react";
import { Modal, Row, Col } from "react-bootstrap";


const ViewRate = ({ show, onHide, rates, runnerName}) => {

  console.log('========> rates',rates)
  const ratesArray = Array.isArray(rates) ? rates : [];



 
 

  return (
    <Modal show={show} onHide={onHide} aria-labelledby="contained-modal-title-vcenter"
    centered>
      <Modal.Header closeButton>
        <Modal.Title>View Rates</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-between align-items-center">
        <div>Runner Name: {runnerName}</div>
          {/* Provision at the extreme top left */}
        </div>
        <Row>
          <Col>
            <div>Back</div>
            {ratesArray.map((rate, index) => (
              <div key={index}>{rate.Back}</div>
            ))}
          </Col>
          <Col>
            <div>Lay</div>
            {ratesArray.map((rate, index) => (
              <div key={index}>{rate.Lay}</div>
            ))}
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default ViewRate;
