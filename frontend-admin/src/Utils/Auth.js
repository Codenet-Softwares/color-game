import React, { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import './loader.css'; // Import the loader CSS

const Loader = () => (
  <div className="loader">
  <div className="rotating-cube">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</div>



);

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const showLoader = () => setIsLoading(true);
  const hideLoader = () => setIsLoading(false);

  const login = () => {
    try {
      console.log("logging in...");
      const userString = sessionStorage.getItem("user");
      if (!userString) return;

      let userObject = {};
      userObject = jwtDecode(userString);
      if (!userObject) return;

      userObject.token = userString;
      setUser(userObject);
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("role");
    setUser(null);
  };

  const handleUnauthorized = (error) => {
    if (error.response && error.response.status === 423) {
      logout();
    }
  };

  return (
    <>
      {/* Conditionally render loader */}
      {isLoading && <Loader />}

      <AuthContext.Provider
        value={{
          user: user,
          login: login,
          logout: logout,
          handleUnauthorized: handleUnauthorized,
          isLoading,
          showLoader,
          hideLoader,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
