/* eslint-disable eqeqeq */
/* eslint-disable no-fallthrough */
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import GameService from "../../Services/GameService";
import { useAuth } from "../../Utils/Auth";
import { toast } from "react-toastify";
import { customErrorHandler } from "../../Utils/helper";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";

const today = new Date();
const Update = ({ show, setShow, data, Update }) => {
  const [newValue, setNewValue] = useState({
    gameName: "",
    Description: "",
    marketName: "",
    participants: "",
    timeSpan: "",
    startTime: "", // New state for start time
    endTime: "", // New state for end time
    runnerName: "",
    back: null,
    lay: null,
  });
  const [previousValues, setPreviousValues] = useState({ back: "", lay: "" }); // storing previous data for back and lay
  const [editedData, setEditedData] = useState({}); // Store edited data
  const [errors, setErrors] = useState({});


  useEffect(() => {
    const adjustTime = (date) => {
      const adjustedDate = new Date(date);
      adjustedDate.setMinutes(adjustedDate.getMinutes() - 330); // Subtract 330 minutes (5 hours 30 minutes)
      return adjustedDate;
    };

    setNewValue((prev) => ({
      ...prev,
      marketName: data.marketName,
      participants: data.participants,
      startTime: adjustTime(data.startTime),
      endTime: adjustTime(data.endTime),
    }));
  }, [data]);


  const auth = useAuth();

  const handleClose = () => {
    setNewValue((prevState) => ({
      ...prevState,
      gameName: "",
      Description: "",
      marketName: "",
      participants: "",
      timeSpan: "",
      startTime: "", // Reset start time
      endTime: "", // Reset end time
      runnerName: "",
      back: "",
      lay: "",
    }));
    setShow(false);
  };
  const validateForm = () => {
    let validationErrors = {};
  
    if (Update === "Game") {
      if (!newValue.gameName.trim()) {
        validationErrors.gameName = "Game Name is required.";
      }
      if (!newValue.Description.trim()) {
        validationErrors.Description = "Game Description is required.";
      }
    }
  
    if (Update === "Market") {
      if (!newValue.marketName.trim()) {
        validationErrors.marketName = "Market Name is required.";
      }
      if (!newValue.participants) {
        validationErrors.participants = "Participants are required.";
      }
    }
  
    if (Update === "Runner" && !newValue.runnerName.trim()) {
      validationErrors.runnerName = "Runner Name is required.";
    }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };
  
  
  const handleStartDateTimeChange = (date) => {
    setNewValue((prevState) => ({
      ...prevState,
      startTime: date,
    }));
    setEditedData((prev) => ({
      ...prev,
      startTime: date,
    }));
  };

  const handleStartDatevalue = (date) => {
    setNewValue((prevState) => ({
      ...prevState,
      startTime: date, // Update startTime
    }));
    setEditedData((prev) => ({
      ...prev,
      startTime: date,
    }));
  };

  const handleEndDatevalue = (date) => {
    setNewValue((prevState) => ({
      ...prevState,
      endTime: date, // Update endTime
    }));
    setEditedData((prev) => ({
      ...prev,
      endTime: date,
    }));
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

  const handleNewValue = (event) => {
    const { name, value } = event.target;
    const updateKey = Update.toLowerCase();


    switch (updateKey) {
      case "game":
        setNewValue((prevState) => ({
          ...prevState,
          gameName: name === "gameName" ? value : prevState.gameName,
          Description: name === "description" ? value : prevState.Description,
        }));
        break;
      case "market":
        setNewValue((prevState) => ({
          ...prevState,
          marketName: name === "marketName" ? value : prevState.marketName,
          participants:
            name === "participants" ? value : prevState.participants,
        }));
        setEditedData((prev) => ({
          ...prev,
          [name]: value,
        }));
        break;
      case "runner":
        setNewValue((prevState) => ({
          ...prevState,
          runnerName: name === "runnerName" ? value : prevState.runnerName,
        }));
        break;
      case "rate":
        setNewValue((prevState) => ({
          ...prevState,
          back: name === "back" ? value : prevState.back,
          lay: name === "lay" ? value : prevState.lay,
        }));
        setEditedData((prev) => ({
          ...prev,
          [name]: value,
        }));
        break;
      default:
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const updateKey = Update.toLowerCase();
  
    // Validate required fields before submitting
    if (updateKey === "game" && (!newValue.gameName || !newValue.Description)) {
      toast.error("Game Name and Description are required.");
      return;
    }
  
    if (updateKey === "market" && (!newValue.marketName || !newValue.participants)) {
      toast.error("Market Name and Participants are required.");
      return;
    }
  
    if (updateKey === "runner" && !newValue.runnerName) {
      toast.error("Runner Name is required.");
      return;
    }
  
    if (updateKey === "rate" && (!newValue.back || !newValue.lay)) {
      toast.error("Both Back and Lay rates are required.");
      return;
    }
  
    // Proceed with API request if validation passes
    switch (updateKey) {
      case "game":
        const gameApiData = {
          gameId: data.gameId,
          gameName: newValue.gameName,
          description: newValue.Description,
        };
        GameService.gameUpdate(gameApiData, auth.user)
          .then((res) => {
            toast.success(res.data.message);
            handleClose();
          })
          .catch((err) => {
            toast.error(customErrorHandler(err));
          });
        break;
  
      case "market":
        const marketApiData = {
          marketId: data.marketId,
          ...editedData,
          startTime: moment(editedData.startTime).toISOString(),
          endTime: moment(editedData.endTime).toISOString(),
        };
        GameService.marketUpdate(marketApiData, auth.user)
          .then((res) => {
            toast.success(res.data.message);
            handleClose();
          })
          .catch((err) => {
            toast.error(customErrorHandler(err));
          });
        break;
  
      case "runner":
        const runnerApiData = {
          runnerId: data.runnerId,
          runnerName: newValue.runnerName,
        };
        GameService.runnerUpdate(runnerApiData, auth.user)
          .then((res) => {
            toast.success(res.data.message);
            handleClose();
          })
          .catch((err) => {
            toast.error(customErrorHandler(err));
          });
        break;
  
      case "rate":
        const rateApiData = {
          runnerId: data.runnerId,
          ...editedData,
        };
        GameService.rateUpdate(rateApiData, auth.user)
          .then((res) => {
            toast.success(res.data.message);
            handleClose();
          })
          .catch((err) => {
            toast.error(customErrorHandler(err));
          });
        break;
  
      default:
        toast.error("Invalid Update Type");
    }
  };
  

  useEffect(() => {
    if (data && data.rates) {
      setPreviousValues({
        back: data.rates[0]?.Back || "",
        lay: data.rates[0]?.Lay || "",
      });
    }
  }, [data]);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {Update != "Rate" ? (
            <>
              {" "}
              Update {data?.gameName}
              {data?.marketName}
              {data?.runnerName}
            </>
          ) : (
            <>Update Rate</>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {Update !== "Rate" && (
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text w-100" id="basic-addon1">
                Give New Value Here &nbsp;&nbsp;&nbsp;
              </span>
            </div>
            <input
  type="text"
  className={`form-control ${errors.gameName ? "is-invalid" : ""}`}
  placeholder="Type here"
  name="gameName"
  value={newValue.gameName}
  onChange={handleNewValue}
/>
{errors.gameName && <div className="invalid-feedback">{errors.gameName}</div>}

          </div>
        )}

        {Update === "Game" && (
          <div className="form-group">
            <label htmlFor="exampleFormControlTextarea1">
              New Description:
            </label>
            <textarea
  className={`form-control ${errors.Description ? "is-invalid" : ""}`}
  id="exampleFormControlTextarea1"
  name="description"
  rows="3"
  value={newValue.Description}
  onChange={handleNewValue}
/>
{errors.Description && <div className="invalid-feedback">{errors.Description}</div>}

          </div>
        )}

        {Update === "Market" && (
          <>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text w-100" id="basic-addon1">
                  Number of Participants
                </span>
              </div>
              <input
                type="number"
                className="form-control"
                placeholder="Type Here...."
                aria-label="participants"
                name="participants"
                value={newValue.participants}
                onChange={handleNewValue}
              />
            </div>

            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text w-100">
                  Start Date & Time
                </span>
              </div>
              <Datetime
                value={newValue.startTime}
                onChange={handleStartDatevalue} // Update startTime
                dateFormat="DD-MM-YYYY"
                timeFormat="HH:mm"
                isValidDate={disablePastDates}
                isValidTime={disablePastTimes}
              />
            </div>

            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text w-100">End Date & Time</span>
              </div>
              <Datetime
                value={newValue.endTime}
                onChange={handleEndDatevalue} // Update endTime
                dateFormat="DD-MM-YYYY"
                timeFormat="HH:mm"
                isValidDate={disablePastDates}
                isValidTime={disablePastTimes}
              />
            </div>
          </>
        )}

        {Update === "Rate" && (
          <>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text w-100">Back Rate</span>
              </div>
              <input
                type="number"
                className="form-control"
                placeholder="Type Here...."
                name="back"
                value={newValue.back}
                onChange={handleNewValue}
              />
            </div>

            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text w-100">Lay Rate</span>
              </div>
              <input
                type="number"
                className="form-control"
                placeholder="Type Here...."
                name="lay"
                value={newValue.lay}
                onChange={handleNewValue}
              />
            </div>
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Update;
