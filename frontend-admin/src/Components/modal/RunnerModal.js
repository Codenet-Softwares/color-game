import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { useAuth } from "../../Utils/Auth";
import AccountServices from "../../Services/AccountServices";
import { toast } from "react-toastify";
import { customErrorHandler } from "../../Utils/helper";

const RunnerModal = ({ show, setShow, marketId, numberOfParticipants }) => {
  const [runnername, setRunnerName] = useState(
    Array(numberOfParticipants).fill({ runnerName: "", back: 0, lay: 0 })
  );
  const auth = useAuth();

  useEffect(() => {
    setRunnerName(
      Array(numberOfParticipants).fill({ runnerName: "", back: 0, lay: 0 })
    );
  }, [numberOfParticipants]);

  const handleClose = () => {
    setShow(false);
    setRunnerName(Array(numberOfParticipants).fill({ runnerName: "", back: 0, lay: 0 }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const hasInvalidData = runnername.some(
      (runner) =>
        runner.runnerName.trim() === "" ||
        Number(runner.back) <= 0 ||
        Number(runner.lay) <= 0
    );

    if (hasInvalidData) {
      toast.error("Please ensure all runner names are filled and rates are greater than 0.");
      return;
    }

    const nameMap = new Map();
    const hasDuplicate = runnername.some((runner) => {
      const name = runner.runnerName.trim().toLowerCase();
      if (nameMap.has(name)) {
        return true; 
      }
      nameMap.set(name, true);
      return false;
    });

    if (hasDuplicate) {
      toast.error("Duplicate runner names are not allowed.");
      return;
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
    setRunnerName((prev) =>
      prev.map((runner, i) =>
        i === index ? { ...runner, [field]: value } : runner
      )
    );
  };

  const handleRunnerBlur = (index) => {
    const currentName = runnername[index]?.runnerName?.trim().toLowerCase();
    const isDuplicate = runnername.some(
      (runner, i) =>
        i !== index &&
        runner.runnerName?.trim().toLowerCase() === currentName
    );

    if (currentName && isDuplicate) {
      toast.error(`Runner name "${runnername[index].runnerName}" already exists!`);
    }
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
                onChange={(e) =>
                  handleRunnerNameChange(index, "runnerName", e.target.value)
                }
                onBlur={() => handleRunnerBlur(index)}
              />
              <input
                type="number"
                className="form-control mb-3 mx-1"
                placeholder={`Back Rate ${index + 1}`}
                value={runnername[index]?.back || ""}
                onChange={(e) =>
                  handleRunnerNameChange(index, "back", e.target.value)
                }
              />
              <input
                type="number"
                className="form-control mb-3 mx-1"
                placeholder={`Lay Rate ${index + 1}`}
                value={runnername[index]?.lay || ""}
                onChange={(e) =>
                  handleRunnerNameChange(index, "lay", e.target.value)
                }
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
