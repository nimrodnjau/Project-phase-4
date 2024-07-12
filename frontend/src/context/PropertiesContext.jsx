import React, { useState, useEffect } from 'react';
import { createContext } from 'react';

export const PropertyContext = createContext();

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchProperties();
  }, []);


  //Fetching all properties
  const fetchProperties = () => {
    fetch('http://127.0.0.1:5000/real_estate')
      .then((response) => response.json())
      .then((res) => {
        setProperties(res);
      })
      .catch((error) => {
        console.error('Error fetching properties:', error);
      });
  };


  //Adding a property
  const addProperty = (propertyData) => {
    fetch(`http://127.0.0.1:5000/real_estate`, {
      method: 'POST',
      body: JSON.stringify(propertyData),
      headers: {
        'Content-type': 'application/json',
        // 'Authorization': `Bearer ${auth_token}`
      }
    })
    .then((response) => response.json())
    .then((res) => {
      if (res.success) {
        toast.success(res.success);
        fetchProperties(); // Refresh properties list
      } else if (res.error) {
        toast.error(res.error);
      }
    })
    .catch((error) => {
      console.error('Error adding property:', error);
    });
  };


  
  const editProperty = (propertyId, updatedData) => {
    fetch(`http://127.0.0.1:5000/real_estate/${propertyId}`, {
      method: 'PUT',
      body: JSON.stringify(updatedData),
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${auth_token}`
      }
    })
    .then((response) => response.json())
    .then((res) => {
      if (res.success) {
        toast.success(res.success);
        fetchProperties(); // Refresh properties list
      } else if (res.error) {
        toast.error(res.error);
      }
    })
    .catch((error) => {
      console.error('Error editing property:', error);
    });
  };



  //Deleting a property
  const deleteProperty = (propertyId) => {
    fetch(`http://127.0.0.1:5000/real_estate/${propertyId}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${auth_token}`
      }
    })
    .then((response) => response.json())
    .then((res) => {
      if (res.success) {
        toast.success(res.success);
        fetchProperties(); // Refresh properties list
      } else if (res.error) {
        toast.error(res.error);
      }
    })
    .catch((error) => {
      console.error('Error deleting property:', error);
    });
  };

  const contextData = {
    properties,
    addProperty,
    editProperty,
    deleteProperty
  };

  return (
    <PropertyContext.Provider value={contextData}>
      {children}
    </PropertyContext.Provider>
  );
};