import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { useAuth } from "../../Utils/Auth";
import AccountServices from "../../Services/AccountServices";
import { toast } from "react-toastify";
import {
  useParams,
  useLocation,
  Link,
  useSearchParams,
} from "react-router-dom";
import { customErrorHandler } from "../../Utils/helper";
const RunnerModal = ({ show, setShow, marketId, numberOfParticipants }) => {

  const [runnername, setRunnerName] = useState(
    Array(numberOfParticipants).fill({ runnerName: "", back:0, lay: 0 })
  );
  const auth = useAuth();
  useEffect(() => {
    setRunnerName(
      Array(numberOfParticipants).fill({ runnerName: "", back: 0, lay: 0 })
    );
  }, [numberOfParticipants]);

  // const {  marketId } = useParams();
  console.log('===========> marekrt id from runner modal', runnername)

  const handleClose = () => {
    setShow(false);
    setRunnerName(Array(numberOfParticipants).fill({ name: "", back: "", lay: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if all names are filled and back/lay rates are greater than 0
    const hasInvalidData = runnername.some(runner =>
     runner.runnerName.trim() === "" || runner.back <= 0 || runner.lay <= 0
    );

    if (hasInvalidData) {
      // Show an error message if validation fails
      toast.error("Please ensure all runner names are filled and rates are greater than 0.");
      return; // Stop the function execution here
    }

    const data = {
      runners: runnername,
      marketid: marketId,
    };

    AccountServices.RunnerCreate(data, marketId, auth.user)
      .then((res) => {
        toast.success(res.data.message);
        handleClose();
      })
      .catch((err) => {
        toast.error(customErrorHandler(err));
      });
  };


  const handleRunnerNameChange = (index, field, value) => {
    setRunnerName((prevRunnerNames) =>
      prevRunnerNames.map((runner, i) =>
        i === index ? { ...runner, [field]: value } : runner
      )
    );
  };

  return (
    <Modal show={show} onHide={handleClose} aria-labelledby="ModalHeader">
      <Modal.Header closeButton>
        <Modal.Title id="ModalHeader">Runner & Rate Create</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {[...Array(numberOfParticipants)].map((_, index) => (
            <div className="d-flex" key={index}>
              <input
                type="text"
                className="form-control mb-3"
                placeholder={`Runner ${index + 1}`}
                value={runnername[index]?.runnerName || ""}
                onChange={(e) => handleRunnerNameChange(index, "runnerName", e.target.value)}
              />
              <input
                type="number"
                className="form-control mb-3 mx-1"
                aria-describedby="basic-addon1"
                placeholder={`Back Rate ${index + 1}`}
                value={runnername[index]?.back || ""}
                onChange={(e) => handleRunnerNameChange(index, "back", e.target.value)}
              />
              <input
                type="number"
                className="form-control mb-3 mx-1"
                aria-describedby="basic-addon1"
                placeholder={`Lay Rate ${index + 1}`}
                value={runnername[index]?.lay || ""}
                onChange={(e) => handleRunnerNameChange(index, "lay", e.target.value)}
              />
            </div>
          ))}

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

export default RunnerModal;
