import React from 'react'
import { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom'
export default function UpdateProperty() {

  const navigate = useNavigate();
  const [title, setTitle] = useState()
  const [description, setDescription] = useState()
  const [price, setPrice] = useState()
  const [address, setAddress] = useState()
  const [image, setImage] = useState()

  const {id} = useParams();


  useEffect(() => {
    fetch(`http://localhost:3000/listings/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(json => {
        setTitle(json.title);
        setDescription(json.description);
        setPrice(json.price);
        setAddress(json.address);
        setImage(json.image);
      })
      .catch(error => {
        toast.error('Failed to fetch listing data');
        console.error('Error fetching data:', error);
      });
  }, [id]);


  const handleDelete = (id) => {
    fetch(`http://localhost:3000/listings/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(() => {
        navigate('/allproperties');
        toast.success('Listing deleted successfully!');
      })
      .catch(error => {
        toast.error('Failed to delete listing');
        console.error('Error deleting listing:', error);
      });
  };
  //update property

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`http://localhost:3000/listings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        title: title,
        description: description,
        price: price,
        address: address,
        image: image,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(() => {
        navigate('/allproperties');
        toast.success('Listing updated successfully!');
      })
      .catch(error => {
        toast.error('Failed to update listing');
        console.error('Error updating listing:', error);
      });
  };
  return (
    <div className='grid grid-cols-2 h-[80vh] bg-white mt-6 rounded-3xl'>
      <div className='bg-white text-white flex justify-center items-center'>
         <img src="https://img.freepik.com/free-photo/anime-building-illustration_23-2151150979.jpg?t=st=1720469933~exp=1720473533~hmac=8e47917ecd1d6c146f71325d4d24712bc3b9741daa504d9fe3e11a36bd4054ee&w=740" alt="" className=' h-[80vh]  mx-auto rounded-3xl rounded-shadow '/>
      </div>
      <div className=' pt-11 px-5 bg-blue-600 border-blue-500 rounded-3xl rounded-shadow ' >
         <h1 className='text-3xl pb-24 pt-10 font-semibold text-center text-white'>Update Property </h1>
         <form onSubmit={handleSubmit} className=' max-w-md mx-auto  border-blue-500 rounded-3xl items-center justify-center text-center'>
          <div className='relative z-0 W-full mb-5 group'>
            <input
              value={title}
              onChange={(e)=>setTitle(e.target.value)}
              type='text'
              className='block w-full px-3 py-2 placeholder-blue-500 border rounded-md focus:outline-none focus:ring-white focus:border-white sm:text-sm'
              placeholder='kindly enter the title of your property'
              required
            />
          </div>

          <div className='mb-5'>
            <textarea
              value={description}
              onChange={(e)=>setDescription(e.target.value)}
              type='text'
              className='block w-full px-3 py-2 placeholder-blue-500 border rounded-md focus:outline-none focus:ring-white focus:border-white sm:text-sm'
              placeholder='kindly enter the description of your property'
              required
            />
          </div>

          <div className='mb-5'>
            <textarea
                value={price}
                onChange={(e)=>setPrice(e.target.value)}
            
              type='text'
              className='block w-full px-3 py-2 placeholder-blue-500 border rounded-md focus:outline-none focus:ring-white focus:border-white sm:text-sm'
              placeholder='kindly enter the price of your property'
              required
            />
          </div>

          <div className='mb-5'>
            <textarea
               value={address}
               onChange={(e)=>setAddress(e.target.value)}            
              type='text'
              className='block w-full px-3 py-2 placeholder-blue-500 border rounded-md focus:outline-none focus:ring-white focus:border-white sm:text-sm'
              placeholder='kindly enter the address of your property'
              required
            />
          </div>

          <div className='mb-5'>
            <textarea
              value={image}
              onChange={(e)=>setImage(e.target.value)}

              type='text'
              className='block w-full px-3 py-2 placeholder-blue-500 border rounded-md focus:outline-none focus:ring-white focus:border-white sm:text-sm'
              placeholder='kindly add the image of the property'
              required
            />
          </div>

          <button type='submit' className='flex items-center justify-center mx-auto px-4 py-2 text-base font-medium text-blue-600 bg-white border border-transparent rounded-md shadow-sm hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white'>
            Add post
          </button>
        </form>
      </div>

    
    </div>
  )
}