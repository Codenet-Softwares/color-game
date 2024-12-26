import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import GameService from "../../Services/GameService";
import { useAuth } from "../../Utils/Auth";
import { toast } from "react-toastify";

const CreateRate = ({ show, setShow, runnerName }) => {
  const [back, setBack] = useState("");
  const [lay, setLay] = useState("");
  const auth = useAuth();
  const handleClose = () => setShow(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      back: Number(back),
      lay: Number(lay),
    };

    GameService.rateCreate(data, runnerName, auth.user)
      .then((res) => {
        toast.success(res.data.message);
        handleClose();
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };
  return (
    <Modal
      show={show}
      onHide={handleClose}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Create Rate</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text w-100" id="basic-addon1">
              Back Amount:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
          </div>
          <input
            type="text"
            className="form-control"
            placeholder="Type Here...."
            aria-label="Username"
            aria-describedby="basic-addon1"
            onChange={(e) => setBack(e.target.value)}
          />
        </div>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text w-100" id="basic-addon1">
              Lay Amount:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
          </div>
          <input
            type="text"
            className="form-control"
            placeholder="Type Here...."
            aria-label="Username"
            aria-describedby="basic-addon1"
            onChange={(e) => setLay(e.target.value)}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Create Rate
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateRate;
