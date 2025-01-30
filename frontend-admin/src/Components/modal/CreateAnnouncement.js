import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { useAuth } from "../../Utils/Auth";
import AnnounceServices from "../../Services/AnnounceServices";
import { toast } from "react-toastify";
import { customErrorHandler } from "../../Utils/helper";

const CreateAnnouncement = ({
  show,
  setShow,
  gamename,
  onAnnouncementCreate,
}) => {
  const [typeOfAnnouncement, setTypeOfAnnouncement] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const auth = useAuth();

  useEffect(() => {
    if (show) {
      setTypeOfAnnouncement(gamename);
      setAnnouncement("");
    }
  }, [show, gamename]);

  const handleClose = () => setShow(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      typeOfAnnouncement: typeOfAnnouncement,
      announcement: announcement,
    };

    AnnounceServices.announceCreate(data, auth.user)
      .then((res) => {
        const announcementData = res.data;
        onAnnouncementCreate(announcementData);
        toast.success(res.data.message);

        handleClose();
      })
      .catch((err) => {
        toast.error(customErrorHandler(err));
      });
  };

  return (
    <>

    </>
    // <Modal show={show} onHide={handleClose} aria-labelledby="ModalHeader">
    //   <Modal.Header closeButton>
    //     <Modal.Title id="ModalHeader">Create Announcement</Modal.Title>
    //   </Modal.Header>
    //   <Modal.Body>
    //     <Form>
    //       <Form.Group controlId="typeOfAnnouncement">
    //         <Form.Label>Type of Announcement</Form.Label>
    //         <Form.Control value={typeOfAnnouncement} readOnly />
    //       </Form.Group>

    //       <Form.Group controlId="announcement">
    //         <Form.Label>Create Announcement</Form.Label>
    //         <Form.Control
    //           as="textarea"
    //           rows={3}
    //           placeholder="Enter Announcement"
    //           value={announcement}
    //           onChange={(e) => setAnnouncement(e.target.value)}
    //         />
    //       </Form.Group>
    //     </Form>
    //   </Modal.Body>
    //   <Modal.Footer>
    //     <Button variant="secondary" onClick={handleClose}>
    //       Cancel
    //     </Button>
    //     <Button variant="primary" onClick={handleSubmit}>
    //       Save
    //     </Button>
    //   </Modal.Footer>
    // </Modal>
  );
};

export default CreateAnnouncement;
