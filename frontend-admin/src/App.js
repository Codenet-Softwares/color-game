import { AuthProvider } from "./Utils/Auth";
import React from "react";
import { ToastContainer } from "react-toastify";
import AppRoutes from "./Routes/AppRoutes";
import "react-toastify/dist/ReactToastify.css";




function App() {
  return (
    <React.Fragment>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </React.Fragment>
  );
}

export default App;
