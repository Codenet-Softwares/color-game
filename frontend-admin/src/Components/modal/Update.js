/* eslint-disable eqeqeq */
/* eslint-disable no-fallthrough */
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import GameService from "../../Services/GameService";
import { useAuth } from "../../Utils/Auth";
import { toast } from "react-toastify";
import { customErrorHandler } from "../../Utils/helper";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DateTime from "react-datetime";
import "react-datetime/css/react-datetime.css";

const Update = ({ show, setShow, data, Update }) => {
  console.log("data = >>>>", data);
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

  console.log("data1 = >>>>", newValue);

  useEffect(() => {
    setNewValue((prev) => ({
      ...prev,
      marketName: data.marketName,
      participants: data.participants,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
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

  const handleEndDateTimeChange = (date) => {
    setNewValue((prevState) => ({
      ...prevState,
      endTime: date,
    }));
    setEditedData((prev) => ({
      ...prev,
      endTime: date,
    }));
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
    console.log("=>>>>>", newValue);
    const updateKey = Update.toLowerCase();

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
        console.log(newValue);
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
        console.log(newValue);

        break;
      case "rate":
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
          });
        console.log(newValue);

      default:
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
              placeholder="Type here"
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
              <DateTime
                value={newValue.startTime}
                onChange={handleStartDateTimeChange}
                dateFormat="YYYY-MM-DD"
                timeFormat="HH:mm:ss"
                utc={true} // To handle UTC
              />
            </div>

            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text w-100">End Date & Time</span>
              </div>
              <DateTime
                value={newValue.endTime}
                onChange={handleEndDateTimeChange}
                dateFormat="YYYY-MM-DD"
                timeFormat="HH:mm:ss"
                utc={true} // To handle UTC
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
