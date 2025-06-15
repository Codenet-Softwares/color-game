import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { customErrorHandler } from "../../Utils/helper";
import { useAuth } from "../../Utils/Auth";
import AccountServices from "../../Services/AccountServices";

const WinningEditRequest = ({
  isOpen,
  onClose,
  data,
  marketId,
  runnerId,
  subAdminHistory,
  setSubAdminHistory,
}) => {
  const auth = useAuth();
  const [editedValue, setEditedValue] = useState("");
  const [originalValue, setOriginalValue] = useState("");

  useEffect(() => {
    if (isOpen && data) {
      setEditedValue(data);
      setOriginalValue(data);
    }
  }, [isOpen, data]);

  const handleSubmit = (marketId) => {
    // Validation
    if (!editedValue.trim()) {
      toast.warn("Runner name cannot be empty.");
      return;
    }

    if (editedValue.trim() === originalValue.trim()) {
      toast.warn("You haven't made any changes.");
      return;
    }

    auth.showLoader();
    AccountServices.EditRunnerRequest(
      { marketId: marketId, runnerName: editedValue.trim(), runnerId: runnerId },
      auth.user
    )
      .then((response) => {
        toast.success(response?.data?.message);
        setSubAdminHistory((prev) => ({
          ...prev,
          isRefresh: !subAdminHistory.isRefresh,
        }));
        onClose();
      })
      .catch((error) => {
        toast.error(customErrorHandler(error));
      })
      .finally(() => {
        auth.hideLoader();
      });
  };

  if (!isOpen) return null;

  return (
    <div
      className={`modal fade ${isOpen ? "show d-block" : ""}`}
      tabIndex="-1"
      role="dialog"
      style={{ backdropFilter: "blur(0.7px)" }}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-md"
        role="document"
      >
        <div className="modal-content border-0 shadow-lg rounded">
          <div className="modal-header bg-dark text-white d-flex justify-content-center position-relative">
            <div className="w-100 text-center">
              <h5 className="modal-title fw-bold">EDIT RUNNER REQUEST</h5>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white position-absolute end-0 me-3"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body p-4 bg-light">
            <div className="mb-3">
              <label htmlFor="runnerName" className="form-label text-black">
                Runner Name
              </label>
              <input
                type="text"
                id="runnerName"
                className="form-control"
                value={editedValue}
                onChange={(e) => setEditedValue(e.target.value)}
                placeholder="Enter new runner name"
              />
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-success"
                onClick={() => handleSubmit(marketId)}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinningEditRequest;
