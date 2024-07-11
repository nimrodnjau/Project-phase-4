import React, { useState, useEffect, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [auth_token, setAuth_token] = useState(() => localStorage.getItem("access_token") ? localStorage.getItem("access_token") : null);

  const register_user = (name, email, password) => {
    fetch('http://127.0.0.1:5000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'User registered successfully') {
          toast.success('Registered successfully! Please log in.');
          navigate('/login');
        } else {
          toast.error(data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        toast.error('An error occurred while registering.');
      });
  };

  const login_user = (email, password) => {
    fetch('http://127.0.0.1:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'User logged in successfully') {
          setAuth_token(data.token);
          localStorage.setItem('access_token', data.token);
          setCurrentUser({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            is_admin: data.user.is_admin,
          });
          toast.success('Logged in successfully!');
          navigate('/dashboard');
        } else {
          toast.error(data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        toast.error('An error occurred while logging in.');
      });
  };

  const logout_user = () => {
    setAuth_token(null);
    setCurrentUser(null);
    localStorage.removeItem('access_token');
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const update_user = (name, email, password) => {
    fetch(`http://127.0.0.1:5000/update/${currentUser.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth_token}`
      },
      body: JSON.stringify({ name, email, password })
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'User updated successfully') {
          setCurrentUser({
            ...currentUser,
            name,
            email,
          });
          toast.success('Profile updated successfully!');
        } else {
          toast.error(data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        toast.error('An error occurred while updating the profile.');
      });
  };

  useEffect(() => {
    if (auth_token) {
      fetch('http://127.0.0.1:5000/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth_token}`
        }
      })
        .then(response => response.json())
        .then(data => {
          setCurrentUser({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            is_admin: data.user.is_admin,
          });
        })
        .catch(error => {
          console.error('Error:', error);
          setAuth_token(null);
          localStorage.removeItem('access_token');
        });
    }
  }, [auth_token]);

  return (
    <UserContext.Provider value={{ currentUser, register_user, login_user, logout_user, update_user }}>
      {children}
    </UserContext.Provider>
  );
};
