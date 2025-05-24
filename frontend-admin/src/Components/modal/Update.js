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

  useEffect(() => {
    setNewValue((prev) => ({
      ...prev,
      marketName: data.marketName,
      participants: data.participants,
      startTime: moment(data.startTime).subtract(330, "minutes"), // Adjust time correctly
      endTime: moment(data.endTime).subtract(330, "minutes"),
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
      startTime: moment(data.startTime).subtract(330, "minutes"), // Reset to previous value
      endTime: moment(data.endTime).subtract(330, "minutes"),
      runnerName: "",
      back: "",
      lay: "",
    }));
    setShow(false);
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

    if (!Update) {
      toast.error("Update type is required.");
      return;
    }

    const updateKey = Update.toLowerCase();

    switch (updateKey) {
      case "game":
        if (!data.gameId || !newValue.gameName) {
          toast.error("Game ID and Name are required.");
          return;
        }
        const gameApiData = {
          gameId: data.gameId,
          gameName: newValue.gameName,
          description: newValue.Description || "", // Ensure description is not undefined
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

        if (Object.keys(editedData).length === 0) {
          toast.error("No changes detected.");
          return;
        }

        const startTime = editedData.startTime || newValue.startTime;
        const endTime = editedData.endTime || newValue.endTime;

        if (!startTime || !endTime) {
          toast.error("Start time and End time are required.");
          return;
        }

        if (moment(endTime).isSameOrBefore(moment(startTime))) {
          toast.error("End time must be after the start time.", {
            autoClose: 2000,
          });
          return;
        }

        const marketApiData = {
          marketId: data.marketId,
          ...editedData,
          startTime: moment(startTime).add(330, "minutes").toISOString(),
          endTime: moment(endTime).add(330, "minutes").toISOString(),
        };

        GameService.marketUpdate(marketApiData, auth.user)
          .then((res) => {
            toast.success(res.data.message);
            setEditedData({});
            handleClose();
          })
          .catch((err) => {
            toast.error(customErrorHandler(err));
          });

        break;

      case "runner":
        if (!data.runnerId || !newValue.runnerName) {
          toast.error("Runner ID and Name are required.");
          return;
        }

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
        if (!data.runnerId || !editedData) {
          toast.error("Runner ID and Rate Data are required.");
          return;
        }

        const rateApiData = {
          runnerId: data.runnerId,
          ...editedData,
        };

        GameService.rateUpdate(rateApiData, auth.user)
          .then((res) => {
            toast.success(res.data.message);
            setEditedData({});
            handleClose();
          })
          .catch((err) => {
            toast.error(customErrorHandler(err));
          })
          .finally(() => {
            auth.hideLoader();
          });

        break;

      default:
        toast.error("Invalid update type.");
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
              className="form-control"
              placeholder="Type Here"
              name={
                Update === "Game"
                  ? "gameName"
                  : Update === "Market"
                  ? "marketName"
                  : Update === "Runner"
                  ? "runnerName"
                  : ""
              }
              value={
                Update === "Game"
                  ? newValue.gameName
                  : Update === "Market"
                  ? newValue.marketName
                  : Update === "Runner"
                  ? newValue.runnerName
                  : ""
              }
              onChange={handleNewValue}
            />
          </div>
        )}

        {Update === "Game" && (
          <div className="form-group">
            <label htmlFor="exampleFormControlTextarea1">
              New Description:
            </label>
            <textarea
              className="form-control"
              id="exampleFormControlTextarea1"
              name="description"
              rows="3"
              value={newValue.Description}
              onChange={handleNewValue}
            />
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
