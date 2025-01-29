import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import GameService from "../../Services/GameService";
import { useAuth } from "../../Utils/Auth";
import { toast } from "react-toastify";
import UserService from "../../Services/UserService";

const AddBalance = ({ data, show, setShow }) => {
  const [amount, setAmount] = useState(0);
  const auth = useAuth();
  const handleClose = () => {
    setShow(false);
    setAmount(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount > 0) {
      const apiData = {
        balance: amount,
        adminId: auth.user.adminId,
        userId: data.id,
      };

      UserService.AddUserBalance(auth.user, apiData)
        .then((res) => {
          toast.success(res.data.message);
          handleClose();
        })
        .catch((err) => {
          toast.error(err.response.data.message);
        });
    } else {
      toast.error("Amount Can not be Negative or Zero");
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Add Balance</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          type="number"
          class="form-control"
          aria-describedby="emailHelp"
          placeholder="Enter Amount Here"
          onChange={(event) => setAmount(event.target.value)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Send
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddBalance;
