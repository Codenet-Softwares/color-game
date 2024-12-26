import React, { createContext, useContext, useState } from 'react';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);

  const login = () => {
    try {
      console.log('logging in...');
      const userString = sessionStorage.getItem('user');
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
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('role');
    setUser(null);
  };

  const handleUnauthorized = (error) => {
    if (error.response && error.response.status === 423) {
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user: user, login: login, logout: logout, handleUnauthorized: handleUnauthorized }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
