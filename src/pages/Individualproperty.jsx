import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

export default function Indvidualproperty() 
{
  const navigate = useNavigate();
  const {id} = useParams();
 const [listing, setListing] = useState({})
 
   useEffect(() => {
     fetch(`http://localhost:3000/listings/${id}`)
     .then((response) => response.json())
     .then((json) =>{
       setListing(json)
     } );
   }, [id])

     const handleDelete = (id) => {
       fetch(`http://localhost:3000/listings/${id}`, {
        method: 'DELETE',
})
  .then(response => response.json())
  .then((response) => {
       navigate('/allproperties')
      toast.success('Listing deleted successfully !')
  })
    }


  return (
    <div className='container mx-auto p-6'>
      

<div  className="bg-white p-6 rounded-lg shadow-lg">
    <div class="p-5">
       
           <h5 className="text-2xl font-bold mb-4">{listing.title}</h5>
            <img className="rounded-lg  mx-auto my-4 shadow mb-4 h-[70vh]" src={listing.image} alt="" />
        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{listing.description}.</p>
         <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{listing.price}.</p>
          <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{listing.address}.</p>
         
          <button onClick={() => handleDelete(listing.id)} type="button" class="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">Delete</button>
        
    </div>
</div>

      
    </div>
  )
}
