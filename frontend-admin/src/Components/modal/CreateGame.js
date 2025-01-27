import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import GameService from "../../Services/GameService";
import { useAuth } from "../../Utils/Auth";
import { toast } from "react-toastify";
import { customErrorHandler } from "../../Utils/helper";

const CreateGame = ({ show, setShow }) => {
  const [gameName, setGameName] = useState("");
  const [Description, setDescription] = useState("");
  const [blink, setBlink] = useState(false);
  const auth = useAuth();
  const handleClose = () => setShow(false);
  console.log("====>> line15", auth);

  const handleBlinkToggle = () => {
    setBlink(!blink);
  };

  // const handleSubmit = (e) => {
  //     e.preventDefault();
  //     const data = {
  //         gameName: gameName,
  //         description: Description,
  //         isBlink: blink
  //     };

  //     GameService.gameNameCreate(data, auth.user)
  //         .then((res) => {
  //             toast.success(res.data.message);
  //             setShow(false);
  //         })
  //         .catch((err) => {
  //             toast.error(customErrorHandler(err));
  //         });
  // };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Show the loader when submitting the form
    auth.showLoader();
    const data = {
      gameName: gameName,
      description: Description,
      isBlink: blink,
    };

    GameService.gameNameCreate(data, auth.user)
      .then((res) => {
        toast.success(res.data.message);
        setShow(false);
      })
      .catch((err) => {
        toast.error(customErrorHandler(err));
      })
      .finally(() => {
        // Hide the loader after the request is complete (success or error)
        auth.hideLoader();
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
        <Modal.Title>Create Game</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text w-100" id="basic-addon1">
              Game Name:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
          </div>
          <input
            type="text"
            className="form-control"
            placeholder="Type Here...."
            aria-label="Username"
            aria-describedby="basic-addon1"
            onChange={(e) => setGameName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label for="exampleFormControlTextarea1">Description:</label>
          <textarea
            className="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="blinkButton" className="pe-3 pt-4">
            Blink:
          </label>
          <Button
            id="blinkButton"
            variant={blink ? "primary" : "secondary"}
            onClick={handleBlinkToggle}
          >
            {blink ? "Blink is ON" : "Blink is OFF"}
          </Button>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateGame;
