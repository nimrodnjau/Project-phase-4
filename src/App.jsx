import react from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/Home';
import AllProperties from './pages/AllProperties';
import Contact from './pages/Contact';
import AddProperty from './pages/AddProperty';
import Listing from './components/Listing';
import Indvidualproperty from './pages/Individualproperty';
import { PropertyProvider } from './context/PropertiesContext';
import { UserProvider } from './context/UserContext';

import Login from './pages/Login';
import Register from './pages/Register';
import UpdateProperty from './pages/UpdateProperty';
import Profile from './pages/Profile';


function App() {
  

  return (
    <>
   
<BrowserRouter>
 <UserProvider>
      <PropertyProvider>
      
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/allproperties" element={<AllProperties />} />
            <Route path="/addproperty" element={<AddProperty />} />
            <Route path="/individualproperty/:id" element={<Indvidualproperty />} />
             <Route path="/contact" element={<Contact/>} />
             <Route path='/login' element={<Login/>}/>
             <Route path='/register' element = {<Register></Register>}/>
            <Route path="/profile" element={<Profile/>} />
            <Route path="/updateproperty/:id" element={<UpdateProperty/>}/>
            
          </Route>
        </Routes>
      
      </PropertyProvider>
      </UserProvider>
      </BrowserRouter>

  
     
    </>
  )
}

export default App
