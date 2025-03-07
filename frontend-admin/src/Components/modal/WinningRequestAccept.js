import React from "react";
import AccountServices from "../../Services/AccountServices";
import { useAuth } from "../../Utils/Auth";
import { toast } from "react-toastify";
import { customErrorHandler } from "../../Utils/helper";

const WinningRequestAccept = ({ isOpen, onClose, data, marketId, setViewWinningRequest, viewWinningRequest }) => {
  const auth = useAuth()
  if (!isOpen) return null;

  const runnerNames = data.map((item) => item.runnerName);
  const isMatch = runnerNames.every((name) => name === runnerNames[0]);

  const handleSubmit = (marketId, action) => {
    AccountServices.viewWinningRequestAccept(
      { marketId: marketId, action: action },
      auth.user
    ).then((response) => {
      toast.success(response?.data?.message)
      setViewWinningRequest((prev) => ({
        ...prev,
        isRefresh: !viewWinningRequest.isRefresh
      }));
      onClose();
    }).catch((error) => {
      toast.error(customErrorHandler(error));
    });
  };


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

          <div className="modal-body p-4 bg-light">
            <div className="row">
              <div className="col-md-6">
                {data && data.length > 0 ? (
                  <>
                    <h6 className="text-center fw-bold text-black">First Request</h6>
                    <div className="table-responsive">
                      <table className="table table-bordered table-striped text-center">
                        <thead className="bg-primary text-white">
                          <tr>
                            {/* <th>#</th> */}
                            <th>Declared By</th>
                            <th>Runner Name</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data
                            .slice(0, Math.ceil(data.length / 2))
                            .map((item, index) => (
                              <tr key={index}>
                                {/* <td>{index + 1}</td> */}
                                <td>{item?.declaredBy}</td>
                                <td className="fw-bold text-danger">
                                  {item?.runnerName}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <p className="text-center text-muted">No data available.</p>
                )}
              </div>

              <div className="col-md-6">
                {data && data.length === 2 ? (<>
                  <h6 className="text-center fw-bold text-black">Second Request</h6>
                  <div className="table-responsive">
                    <table className="table table-bordered table-striped text-center">
                      <thead className="bg-secondary text-white">
                        <tr>
                          {/* <th>#</th> */}
                          <th>Declared By</th>
                          <th>Runner Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data
                          .slice(Math.ceil(data.length / 2))
                          .map((item, index) => (
                            <tr key={index}>
                              {/* <td>{index + 1 + Math.ceil(data.length / 2)}</td> */}
                              <td>{item?.declaredBy}</td>
                              <td className="fw-bold text-danger">
                                {item?.runnerName}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </>
                ) : (
                  <p className="text-center text-muted fw-bold mt-5">No data available.</p>
                )}
              </div>
            </div>
            {data.length > 1 && (
              <>
                <div className={`text-center fw-bold mt-3 text-${isMatch ? 'success' : 'danger'}`}>
                  {isMatch ? "Match" : "Unmatch"}
                </div>

                <div className="d-flex justify-content-center gap-3 mt-4">
                  <button className="btn btn-success fw-bold px-4" disabled={!isMatch} onClick={() => handleSubmit(marketId, "approve")}>Approve</button>
                  <button className="btn btn-danger fw-bold px-4"  onClick={() => handleSubmit(marketId, "reject")}>Reject</button>
                </div>
              </>
            )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinningRequestAccept;
