import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import GameService from "../../Services/GameService";
import { useAuth } from "../../Utils/Auth";
import { toast } from "react-toastify";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
import { customErrorHandler } from "../../Utils/helper";

const CreateMarket = ({ show, setShow, id }) => {
  const [marketName, setMarketName] = useState("");
  const [participant, setParticipant] = useState("");
  const [startDatevalue, SetStartDateValue] = useState(new Date());
  const [endDatevalue, setEndDateValue] = useState(
    moment().add(1, "minute").toDate()
  );
  const [errors, setErrors] = useState({}); // State for validation errors


  const today = new Date();
  const auth = useAuth();

  const handleClose = () => {
    resetForm(); // Reset form when closing modal
    setShow(false);
  };
  const resetForm = () => {
    setMarketName("");
    setParticipant(""); // Reset participant correctly
    SetStartDateValue(new Date());
    setEndDateValue(moment().add(1, "minute").toDate());
    setErrors({});
  };

  const validateForm = () => {
    let newErrors = {};

    if (!marketName.trim()) newErrors.marketName = "Market Name is required.";
    if (participant === "" || participant === null || participant <= 0) {
      newErrors.participant =
        "Number of Participants is required and must be greater than 0.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const disablePastDates = (current) => {
    return current.isSameOrAfter(moment(), "day");
  };

  const disablePastTimes = (current) => {
    const now = moment();
    if (current.isSame(now, "day")) {
      return current.isSameOrAfter(now, "minute"); // Allow current time and future
    }
    return true;
  };
  

  const adjustTime = (date) => {
    return moment(new Date(date))
      .add(5, "hours")
      .add(30, "minutes")
      .seconds(0)
      .milliseconds(0)
      .toISOString();
  };

  const handleStartDatevalue = (e) => {
    SetStartDateValue(e);
  };

  const handleEndDatevalue = (e) => {
    setEndDateValue(e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return; // If validation fails, don't submit

    auth.showLoader();

    const data = {
      marketName,
      participants: participant,
      startTime: adjustTime(startDatevalue),
      endTime: adjustTime(endDatevalue),
    };

    GameService.marketNameCreate(data, id, auth.user)
      .then((res) => {
        toast.success(res.data.message, { autoClose: 2000 });
        handleClose(); // Reset form & close modal on success
      })
      .catch((err) => {
        toast.error(customErrorHandler(err), { autoClose: 2000 });
      })
      .finally(() => {
        auth.hideLoader();
      });
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create Market</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text w-100">Market Name:</span>
          </div>
          <input
            type="text"
            className="form-control"
            placeholder="Type Here..."
            value={marketName}
            onChange={(e) => setMarketName(e.target.value)}
          />
        </div>
        {errors.marketName && (
          <small className="text-danger">{errors.marketName}</small>
        )}
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text w-100">No. Of Participants:</span>
          </div>
          <input
            type="number"
            className="form-control"
            placeholder="Type Here..."
            value={participant}
            onChange={(e) =>
              setParticipant(e.target.value ? parseInt(e.target.value, 10) : "")
            }
          />
        </div>
        {errors.participant && (
          <small className="text-danger">{errors.participant}</small>
        )}
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text w-100">Start Date & Time:</span>
          </div>
          <Datetime
            value={startDatevalue}
            onChange={handleStartDatevalue}
            dateFormat="DD-MM-YYYY"
            timeFormat="hh:mm A"
            isValidDate={disablePastDates}
            isValidTime={disablePastTimes}
          />
        </div>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text w-100">End Date & Time:</span>
          </div>
          <Datetime
            value={endDatevalue}
            onChange={handleEndDatevalue}
            dateFormat="DD-MM-YYYY"
            timeFormat="hh:mm A"
            isValidDate={disablePastDates}
            isValidTime={disablePastTimes}
          />
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

export default CreateMarket;
