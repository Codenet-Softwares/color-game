import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const DeleteBetHistory = () => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleDropdownChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleButtonClick = () => {
    alert(`You selected: ${selectedOption}`);
  };

  return (
    <div className="container mt-5">
      <div
        className="card shadow-lg p-3 mb-5 rounded"
        style={{ background: "#95D9E8" }}
      >
        <h1 className="text-center mb-4 fw-bold text-decoration-underline">Deleted Bets</h1>
        <div className="">
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="bet-options" className="form-label">
                  Select an Option:
                </label>
                <select
                  id="bet-options"
                  className="form-select"
                  value={selectedOption}
                  onChange={handleDropdownChange}
                >
                  <option value="">Select Game</option>
                  <option value="option1">Option 1</option>
                  <option value="option2">Option 2</option>
                  <option value="option3">Option 3</option>
                </select>
              </div>
            </div>
            <div className="col-md-2" style={{ marginTop: "31px" }}>
              <button
                className="btn btn-success w-100"
                onClick={handleButtonClick}
              >
                Get History
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="card shadow-lg p-3 mb-5 rounded">
        <div className="rounded" style={{ background: "#95D9E8" }}>
          <h5 className="text-center fw-bold p-2 mt-1 text-decoration-underline">Bet History</h5>
        </div>
      </div>
    </div>
  );
};

export default DeleteBetHistory;
