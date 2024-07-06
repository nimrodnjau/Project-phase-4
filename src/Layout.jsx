import React from 'react'
import { Outlet, Link } from "react-router-dom";
import Navbar from './components/Navbar';
import Main from './components/Main';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
export default function Layout() {
  return (
    <>
     

  <Navbar />
 
  {/* <Footer/> */}
  <ToastContainer
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="dark"

/>
{/* Same as */}
<ToastContainer />
  <Outlet />
    </>
  )
}