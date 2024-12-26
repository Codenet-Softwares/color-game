import { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { login, userWallet } from "../../utils/apiService";
import { useAppContext } from "../../contextApi/context";
import strings from "../../utils/constant/stringConstant";
import { useFormik } from "formik";
import LoginSchema from "../../schema/loginSchema";
import "./loginModal.css";
import { useNavigate } from "react-router-dom";

function Login({ showLogin, setShowLogin, setShowResetModal, showResetModal }) {
  console.log("setShowResetModal:", setShowResetModal);
  console.log("typeof setShowResetModal:", typeof setShowResetModal);
  const [loginCred, setLoginCred] = useState(setInitialValues());
  const navigate = useNavigate();

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
      console.log("values++===============>", values);
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
    console.log("res from login", response);
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
    return <h4 className="d-flex justify-content-center">Login</h4>;
  }

  function ModalBody() {
    return (
      <div className="py-3">
        <div className="d-flex justify-content-center position-relative">
          <input
            type="text"
            className="form-control w-75"
            placeholder="Enter Username"
            name="userName"
            style={{ border: "1px solid black" }}
            value={values.userName}
            onChange={handleChange}
          />
          <span
            className="position-absolute small"
            style={{ left: "60px", top: "36px" }}
          >
            {errors.userName && touched.userName ? (
              <p>{errors.userName}</p>
            ) : null}
          </span>
        </div>
        <br />
        <div className="d-flex justify-content-center position-relative ">
          <input
            type="password"
            className="form-control w-75"
            placeholder="Enter Password"
            name="password"
            // style={{ border: '1px solid black' }}
            value={values.password}
            onChange={handleChange}
          />

          <span
            className="position-absolute small"
            style={{ left: "60px", top: "36px" }}
          >
            {errors.password && touched.password ? (
              <p>{errors.password}</p>
            ) : null}
          </span>
        </div>
      </div>
    );
  }

  function footer() {
    return (
      <div className="d-flex flex-column w-100">
        <Button
          variant="secondary"
          onClick={handleSubmit}
          style={{
            backgroundImage: "linear-gradient(to top, #044469 4%, #1AA0D1 92%)",
          }}
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
