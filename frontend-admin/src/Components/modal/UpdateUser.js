import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import UserService from "../../Services/UserService";
import { useAuth } from "../../Utils/Auth";
import { toast } from "react-toastify";

const UpdateUser = ({ show, setShow, userData, userId }) => {
  console.log("==========> user data through props", userData);
const auth = useAuth()
  const [user, setUser] = useState(userData);

  const handleClose = () => {
    setShow(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      phoneNumber: user.phoneNumber,
      password: user.password,
    };

    UserService.userUpdate(data, auth.user, userId)
    .then((res) => {
        console.log('=========> response',res)
        toast.success(res.data.message);
        // window.location.reload();
        setShow(false);
        
      })
      .catch((err) => {
      toast.error(err.response.data.message);
      });
 
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  console.log('=======> updated user', user)
  return (
    <Modal
    show={show}
    onHide={handleClose}
    aria-labelledby="contained-modal-title-vcenter"
    centered
  >
    <Modal.Header closeButton>
      <Modal.Title>Edit User for {userData.firstName} {userData.lastName}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <div className="form-group">
        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          className="form-control mb-2"
          id="firstName"
          name="firstName"
          value={user.firstName}
          onChange={handleChange}
          placeholder={userData.firstName}
        />
      </div>
      <div className="form-group">
        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          className="form-control mb-2"
          id="lastName"
          name="lastName"
          value={user.lastName}
          onChange={handleChange}
          placeholder={userData.lastName}
        />
      </div>
      <div className="form-group">
        <label htmlFor="userName">Username:</label>
        <input
          type="text"
          className="form-control mb-2"
          id="userName"
          name="userName"
          value={user.userName}
          onChange={handleChange}
          placeholder={userData.userName}
        />
      </div>
      <div className="form-group">
        <label htmlFor="phoneNumber">Phone Number:</label>
        <input
          type="text"
          className="form-control mb-2"
          id="phoneNumber"
          name="phoneNumber"
          value={user.phoneNumber}
          onChange={handleChange}
          placeholder={userData.phoneNumber}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          className="form-control"
          id="password"
          name="password"
          value={user.password}
          onChange={handleChange}
          placeholder="Update Password"
        />
      </div>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Close
      </Button>
      <Button variant="primary" onClick={handleSubmit}>
        Update User
      </Button>
    </Modal.Footer>
  </Modal>
  
  );
};

export default UpdateUser;
