import { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { login, userWallet } from "../../utils/apiService";
import { useAppContext } from "../../contextApi/context";
import strings from "../../utils/constant/stringConstant";
import { useFormik } from "formik";
import LoginSchema from "../../schema/loginSchema";
import "./loginModal.css";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
function Login({ showLogin, setShowLogin, setShowResetModal, showResetModal }) {
  const [loginCred, setLoginCred] = useState(setInitialValues());
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { dispatch, store } = useAppContext();

  useEffect(() => {
    if (!showLogin) {
      resetForm();
    }
  }, [showLogin]);

  function setInitialValues() {
    return {
      userName: "",
      password: "",
    };
  }

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    resetForm,
  } = useFormik({
    initialValues: loginCred,
    validationSchema: LoginSchema,
    onSubmit: (values, action) => {
      loginHandler(values);
      resetForm();
    },
    enableReinitialize: true,
  });

  async function loginHandler(values) {
    dispatch({
      type: strings.isLoading,
      payload: true,
    });
    const response = await login(values, true);
    if (response) {
      setShowLogin(!showLogin);
      if (response.data.isReset) {
        dispatch({
          type: strings.LOG_IN,
          payload: { ...response.data },
        });
        navigate("/passwordReset", { state: values });
      } else {
        dispatch({
          type: strings.LOG_IN,
          payload: { isLogin: true, ...response.data },
        });
      }
    }
    dispatch({
      type: strings.isLoading,
      payload: false,
    });
  }

  function header() {
    return (
      <h4
        className="d-flex justify-content-center text-uppercase fw-bold login_heading">Login 👇🏾</h4>
    );
  }

  function ModalBody() {
    return (
      <div className="py-3 rounded">
        <div className="d-flex justify-content-center position-relative">
          <input
            type="text"
            className="form-control w-75 border-1 border-dark"
            placeholder="Enter Username"
            name="userName"
            value={values.userName}
            onChange={handleChange}
          />
          <span
            className="position-absolute small error_msg"
          >
            {errors.userName && touched.userName ? (
              <p className="text-danger fw-bold">{errors.userName}</p>
            ) : null}
          </span>
        </div>
        
        <br />
        <div className="d-flex justify-content-center position-relative ">
          <input
            type={showPassword ? "text" : "password"}
            className="form-control w-75 border-1 border-dark"
            placeholder="Enter Password"
            name="password"
            value={values.password}
            onChange={handleChange}
          />

          <span
            className="position-absolute  password_show"           
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
            <span className="position-absolute small error_msg"
            >
            {errors.password && touched.password ? (
              <p className="text-danger fw-bold">{errors.password}</p>
            ) : null}
            </span>
          
        </div>
      </div>
    );
  }

  function footer() {
    return (
      <div className="d-flex flex-column w-100 ">
        <Button
          className="text-uppercase fw-bold sign_button"
          variant="secondary"
          onClick={handleSubmit}
        >
          Sign in
        </Button>
        {/* <Button
      variant="link"
      onClick={() => navigate('/passwordReset')}
      style={{ textDecoration: 'none', color: '#1AA0D1' }}
    >
      Reset Password
    </Button> */}
      </div>
    );
  }

  return (
    <Modal show={showLogin} onHide={setShowLogin} centered>
      {header && (
        <Modal.Header className="custom-header" closeButton>
          <Modal.Title className="m-auto">{header()}</Modal.Title>
        </Modal.Header>
      )}

      {ModalBody && <Modal.Body className="bg-light">{ModalBody()}</Modal.Body>}

      {footer && <Modal.Footer className="m-auto">{footer()}</Modal.Footer>}
    </Modal>
  );
}

export default Login;
