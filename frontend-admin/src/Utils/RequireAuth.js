import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import PropTypes from 'prop-types';
import { useAuth } from './Auth';

export const RequireAuth = ({ children }) => {
  const [user, setUser] = useState({});
  const auth = useAuth();
  const location = useLocation();

  const login = () => {
    const userString = sessionStorage.getItem('user');
    if (!userString) return;

    let userObject = {};
    userObject = jwtDecode(userString);
    if (!userObject) return;

    userObject.token = userString;
    setUser(userObject);
  };

  if (!auth.user) {
    login();
    if (Object.keys(user).length === 0) {
      return (
        <Navigate
          to='/'
          state={{ path: location.pathname + location.search }}
        />
      );
    } else {
      auth.user = user;
    }
  }

  return children;
};
RequireAuth.propTypes = { children: PropTypes.node.isRequired };
