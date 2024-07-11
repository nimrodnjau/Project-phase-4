import React, { useState ,useEffect} from 'react'
import { createContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiMiniArrowUpTray } from 'react-icons/hi2'
import { toast } from 'react-toastify'



export const UserContext = createContext()

export const UserProvider = ({children}) => {

     const navigate = useNavigate()
    const [currentUser, setCurrentUser] = useState("")
    const [onChange, setOnChange] = useState(false)


// All your functions and state variables will be available to all the children components that are wrapped in the UserProvider
   //    REGISTER USER
    const register_user = (name,email,password,is_organizer) => {
       
 fetch('http://localhost:3000/users', {
  method: 'POST',
  body: JSON.stringify({
    name : name,
    email : email,
    password : password,
    is_organizer : is_organizer

  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
})
  .then((response) => response.json())
  .then((res) =>{
    // navigate('/allproperties')
    if(res.success){
         toast.success(res.success)
    }
    else if(res.error){
      toast.error(res.error)
    }
    else {
      toast.error('Something went wrong !')
    }
   
  }
  );
    }


      //  useEffect(() => {
  //    fetch('http://localhost:3000/listings')
  //    .then((response) => response.json())
  //    .then((json) =>{
  //      setListings(json)
  //    } );
  //  },[])



    const contextData = {
        currentUser, 
        setCurrentUser,
        register_user
    }


    //    //    Login USER
    //    const login_user = (email, password) =>{
    //     fetch(`${server_url}/login`, {
    //         method: 'POST',
    //         body: JSON.stringify({
    //             email: email,
    //             password: password,
    //         }),
    //         headers: {
    //           'Content-type': 'application/json',
    //         },
    //       })
    //     .then((response) => response.json())
    //     .then((res) =>{
    //         // console.log(res)
    //      if(res.access_token)
    //         {
    //             setAuth_token(res.access_token)
    //             localStorage.setItem("access_token", res.access_token)

    //             toast.success("Logged in Successfully!")
    //             nav("/dashboard")
    //         }
    //         else if(res.error)
    //         {
    //             toast.error(res.error)
    //         }
    //         else {
    //             toast.error("An error occured")
    //         }

    //     });
    
    // }



    //    //    Update USER
    //    const update_user = (name, phone_number,is_organizer, password) =>{
    //     fetch(`${server_url}/users`, {
    //         method: 'PUT',
    //         body: JSON.stringify({
    //             name: name,
    //             password: password,
    //             phone_number: phone_number,
    //             is_organizer: is_organizer
    //         }),
    //         headers: {
    //           'Content-type': 'application/json',
    //           'Authorization': `Bearer ${auth_token}`
    //         },
    //       })
    //     .then((response) => response.json())
    //     .then((res) =>{
    //      if(res.success)
    //         {
    //             toast.success(res.success)
    //         }
    //         else if(res.error)
    //         {
    //             toast.error(res.error)
    //         }
    //         else {
    //             toast.error("An error occured")
    //         }

    //     });
    
    // }



    // Logout
    const logout = () =>{
        fetch(`${server_url}/logout`, {
            method: 'DELETE',
            headers: {
              'Content-type': 'application/json',
              'Authorization': `Bearer ${auth_token}`
            },
          })
        .then((response) => response.json())
        .then((res) =>{
         if(res.success)
            {
                localStorage.removeItem("access_token")
                setCurrentUser(null)
                setAuth_token(null)
                setOnChange(!onChange)
                toast.success(res.success)
            }
            else if(res.error)
            {
                toast.error(res.error)
            }
            else {
                toast.error("An error occured")
            }

        });

    }




    return (
        <UserContext.Provider value={{contextData}}>
            {children}
        </UserContext.Provider>
    )
}