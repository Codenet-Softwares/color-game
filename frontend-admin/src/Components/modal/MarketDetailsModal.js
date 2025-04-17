import React from "react";
import { Modal, Button } from "react-bootstrap";

const MarketDetailsModal = ({
  show,
  setShow,
  marketDetails,
  participants,
  isActive,
  startTime,
  endTime,
  marketName 
}) => {
  console.log("line 5", marketDetails);
  const convertToUTC = (time) => {
    if (!time) return "N/A"; 
    const date = new Date(time);
    // Use toISOString() and format the string to exclude the 'GMT' part
    return date.toISOString().replace('T', ' ').replace('Z', '');
  };
  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Market Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {marketDetails && (
          <div>
            <p>
              <strong>Market Name:</strong> {marketName }
            </p>
            <p>
              <strong>Status:</strong> {isActive ? "Inactive" : "Active"}
            </p>
            <p>
              <strong>Participants:</strong> {participants}
            </p>
            <p>
              <strong>Start Time :</strong> {convertToUTC(startTime)}
            </p>
            <p>
              <strong>End Time :</strong> {convertToUTC(endTime)}
            </p>
            {/* Add more fields as needed */}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShow(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MarketDetailsModal;
