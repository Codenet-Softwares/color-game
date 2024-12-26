import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import AnnounceServices from "../../Services/AnnounceServices";
import { useAuth } from "../../Utils/Auth";
import { toast } from "react-toastify";
import { customErrorHandler } from "../../Utils/helper";
const UpdateAnnouncement = ({
  show,
  setShow,
  announceId,
  gamename,
  announce,
}) => {
  console.log("announce data=========> line 6", announceId, gamename, announce);
  const [typeOfAnnouncement, setTypeOfAnnouncement] = useState("");
  const [announcement, setAnnouncement] = useState("");
  console.log("=========> announcement data line 9", announcement);
  const auth = useAuth();

  useEffect(() => {
    setTypeOfAnnouncement(gamename); // Set the default value for typeOfAnnouncement when gamename changes
    setAnnouncement(announce);
  }, [gamename, announce]);

  const handleClose = () => setShow(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      typeOfAnnouncement: typeOfAnnouncement,
      announcement: announcement,
    };

    AnnounceServices.UpdateAnnounce(data, auth.user, announceId)
      .then((res) => {
        console.log("Response for update announcement:", res);
        // setAnnouncement(res.data);
        toast.success(res.data.message);
        handleClose();
      })
      .catch((err) => {
        toast.error(customErrorHandler(err));
      });
  };
  return (
    <Modal show={show} onHide={handleClose} aria-labelledby="ModalHeader">
      <Modal.Header closeButton>
        <Modal.Title id="ModalHeader">Update Announcement</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="typeOfAnnouncement">
            <Form.Label>Type of Announcement</Form.Label>
            <Form.Control value={typeOfAnnouncement} readOnly />
          </Form.Group>

          <Form.Group controlId="announcement">
            <Form.Label>Update Announcement</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="update announcement"
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateAnnouncement;
