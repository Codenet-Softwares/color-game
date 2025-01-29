import React, { useState, useEffect } from "react";
import { Modal, Button, ListGroup } from "react-bootstrap"; // Import necessary Bootstrap components

const LatestAnnouncementModal = ({ show, handleClose, latestAnnouncements }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Latest Announcements</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          {/* {latestAnnouncements.map((announcement, index) => (
            <ListGroup.Item key={index}>
              <strong>{announcement.gameName}:</strong> {announcement.announcement}
            </ListGroup.Item>
          ))} */}
          {latestAnnouncements}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LatestAnnouncementModal;
