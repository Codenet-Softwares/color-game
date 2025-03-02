import React from "react";

const WinningRequestAccept = ({ isOpen, onClose, data }) => {
  // Check if runner names match
  const runnerNames = data.map((item) => item.runnerName);
  const isMatch = runnerNames.every((name) => name === runnerNames[0]);

  return (
    <div
      className={`modal fade ${isOpen ? "show d-block" : ""}`}
      tabIndex="-1"
      role="dialog"
      style={{ backdropFilter: "blur(0.7px)" }}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        role="document"
      >
        <div className="modal-content border-0 shadow-lg rounded">
          {/* Header */}
          <div className="modal-header bg-dark text-white d-flex justify-content-center position-relative">
            <div className="w-100 text-center">
              <h5 className="modal-title fw-bold">VIEW REQUEST DETAILS</h5>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white position-absolute end-0 me-3"
              onClick={onClose}
            ></button>
          </div>

          {/* Modal Body  */}
          <div className="modal-body p-4 bg-light">
            <div className="row">
              <div className="col-md-6">
                <h6 className="text-center fw-bold">First Data</h6>
                {data && data.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-bordered table-striped text-center">
                      <thead className="bg-primary text-white">
                        <tr>
                          <th>#</th>
                          <th>Declared By</th>
                          <th>Runner Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data
                          .slice(0, Math.ceil(data.length / 2))
                          .map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item.declaredBy}</td>
                              <td className="fw-bold text-danger">
                                {item.runnerName}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-muted">No data available.</p>
                )}
              </div>

              <div className="col-md-6">
                <h6 className="text-center fw-bold">Second Data</h6>
                {data && data.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-bordered table-striped text-center">
                      <thead className="bg-secondary text-white">
                        <tr>
                          <th>#</th>
                          <th>Declared By</th>
                          <th>Runner Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data
                          .slice(Math.ceil(data.length / 2))
                          .map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1 + Math.ceil(data.length / 2)}</td>
                              <td>{item.declaredBy}</td>
                              <td className="fw-bold text-danger">
                                {item.runnerName}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-muted">No data available.</p>
                )}
              </div>
            </div>

            {/* Match Status */}
            <div className="text-center fw-bold mt-3 text-{isMatch ? 'success' : 'danger'}">
              {isMatch ? "Match" : "Unmatch"}
            </div>

            {/* Action Buttons */}
            <div className="d-flex justify-content-center gap-3 mt-4">
              <button className="btn btn-success fw-bold px-4">Accept</button>
              <button className="btn btn-danger fw-bold px-4">Reject</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinningRequestAccept;
