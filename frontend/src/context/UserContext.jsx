import React, { useState, useEffect, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [auth_token, setAuth_token] = useState(() => localStorage.getItem("access_token") ? localStorage.getItem("access_token") : null);
console.log("Debug it", auth_token )
  const register_user = (name, email, password) => {
    fetch('http://127.0.0.1:5000/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.message === 'User registered successfully') {
          toast.success(res.message);
          navigate("/login");
        } else {
          toast.error(res.message);
        }
      })
      .catch((error) => {
        toast.error('Something went wrong!');
      });
  };

  const login_user = (email, password) => {
    fetch('http://127.0.0.1:5000/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.access_token) {
          setAuth_token(res.access_token);
          localStorage.setItem("access_token", res.access_token);
          toast.success("Logged in Successfully!");
          navigate("/");
        } else {
          toast.error(res.message || "An error occurred");
        }
      });
  };

  const logout = () => {
    fetch('http://127.0.0.1:5000/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth_token}`,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.message === 'Successfully logged out') {
          localStorage.removeItem("access_token");
          setCurrentUser(null);
          setAuth_token(null);
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
      });
  };

  useEffect(() => {
    if (auth_token) {
      fetch('http://127.0.0.1:5000/current_user', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth_token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          if (data.user && data.user.email) {
            setCurrentUser(data.user);
            console.log(data)
          } else {
            localStorage.removeItem("access_token");
            setCurrentUser(null);
            setAuth_token(null);
            navigate("/login");
          }
        });
    }
  }, [auth_token]);

  const contextData = {
    currentUser,
    setCurrentUser,
    register_user,
    login_user,
    logout,
    auth_token,
  };

  return (
    <UserContext.Provider value={contextData}>
      {children}
    </UserContext.Provider>
  );
};
