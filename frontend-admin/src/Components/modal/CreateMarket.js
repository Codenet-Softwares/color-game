import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import GameService from "../../Services/GameService";
import { useAuth } from "../../Utils/Auth";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { customErrorHandler } from "../../Utils/helper";

const CreateMarket = ({ show, setShow, id }) => {
  const [marketName, setMarketName] = useState("");
  const [participant, setParticipant] = useState("");
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(
    new Date(new Date().getTime() + 60000)
  );

  const auth = useAuth();
  const handleClose = () => {
    resetForm(); // Reset form when closing modal
    setShow(false);
  };

  const resetForm = () => {
    setMarketName("");
    setParticipant("");
    setStartDateTime(new Date());
    setEndDateTime(new Date(new Date().getTime() + 60000));
  };

  const now = new Date();
  now.setSeconds(0);
  now.setMilliseconds(0);
console.log("now",now)
  const handleStartDateChange = (date) => {
    if (date) {
      setStartDateTime(date);

      // Automatically set end time to 1 minute after start time
      const newEndDateTime = new Date(date);
      newEndDateTime.setMinutes(newEndDateTime.getMinutes() + 1);
      setEndDateTime(newEndDateTime);
    }
  };

  const handleEndDateChange = (date) => {
    if (date && date >= startDateTime) {
      setEndDateTime(date);
    } else {
      toast.error("End time must be after the start time.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!startDateTime || !endDateTime) {
      toast.error("Start and end times are required.");
      return;
    }

    const formattedStartTime = startDateTime;
    const formattedEndTime = endDateTime;
    const data = {
      marketName: marketName,
      participants: participant,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    };

    GameService.marketNameCreate(data, id, auth.user)
      .then((res) => {
        toast.success(res.data.message);
        resetForm();
        setShow(false);
      })
      .catch((err) => {
        toast.error(customErrorHandler(err));
        // if (startDateTime < new Date() || endDateTime <= startDateTime) {
        //   toast.error("Start and end times must be in the future and the end time must be after the start time.");
        // }
      });
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const getMinTime = (date) => {
    return isToday(date) ? now : new Date(0, 0, 0, 0, 0);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton style={{  backgroundImage: "linear-gradient(90deg, #020024 0%, #090979 35%, #00d4ff 100%)"}}>
        <Modal.Title className="text-white">Create Market</Modal.Title>
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
          <DatePicker
            selected={startDateTime}
            onChange={handleStartDateChange}
            showTimeSelect
            timeFormat="HH:mm"
            dateFormat="yyyy-MM-dd HH:mm"
            minDate={now}
            minTime={getMinTime(startDateTime)}
            maxTime={new Date(0, 0, 0, 23, 59)}
            className="form-control"
          />
        </div>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text w-100">End Date & Time:</span>
          </div>
          <DatePicker
            selected={endDateTime}
            onChange={handleEndDateChange}
            showTimeSelect
            timeFormat="HH:mm"
            dateFormat="yyyy-MM-dd HH:mm"
            minDate={startDateTime}
            minTime={getMinTime(endDateTime)}
            maxTime={new Date(0, 0, 0, 23, 59)}
            className="form-control"
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
