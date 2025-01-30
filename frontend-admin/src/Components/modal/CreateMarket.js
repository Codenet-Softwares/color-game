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
  const [endDatevalue, setEndDateValue] = useState(new Date());
  const today = new Date();
  const auth = useAuth();

  const handleClose = () => {
    resetForm(); // Reset form when closing modal
    setShow(false);
  };

  const resetForm = () => {
    setMarketName("");
    setParticipant("");
    SetStartDateValue(new Date());
    setEndDateValue(new Date());
  };

  const disablePastDates = (current) => {
    return current.isAfter(today);
  };

  const disablePastTimes = (current) => {
    const now = moment();
    if (current.isSame(now, "day")) {
      return current.isAfter(now);
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

    if (!marketName || !participant) {
      toast.error("Market Name and Participants are required.", { autoClose: 2000 });
      return;
    }

    if (!startDatevalue || !endDatevalue) {
      toast.error("Start and end times are required.", { autoClose: 2000 });
      return;
    }

    // Adjust start and end times by adding 5 hours 30 minutes
    const adjustedStartTime = adjustTime(startDatevalue);
    const adjustedEndTime = adjustTime(endDatevalue);

    // Compare the adjusted times to ensure end time is not smaller than start time
    if (moment(adjustedEndTime).isBefore(adjustedStartTime)) {
      toast.error("End time must be after the start time.", { autoClose: 2000 });
      return;
    }

    const data = {
      marketName,
      participants: participant,
      startTime: adjustedStartTime,
      endTime: adjustedEndTime,
    };

    GameService.marketNameCreate(data, id, auth.user)
      .then((res) => {
        toast.success(res.data.message, { autoClose: 2000 });
        resetForm();
        setShow(false);
      })
      .catch((err) => {
        toast.error(customErrorHandler(err), { autoClose: 2000 });
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
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text w-100">No. Of Participants:</span>
          </div>
          <input
            type="number"
            className="form-control"
            placeholder="Type Here..."
            value={participant}
            onChange={(e) => setParticipant(e.target.value)}
          />
        </div>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text w-100">Start Date & Time:</span>
          </div>
          <Datetime
            value={startDatevalue}
            onChange={handleStartDatevalue}
            dateFormat="DD-MM-YYYY"
            timeFormat="HH:mm"
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
            timeFormat="HH:mm"
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
