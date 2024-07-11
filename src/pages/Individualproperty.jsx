import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState, useContext } from 'react'
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  import { PropertyContext } from '../context/PropertiesContext';
import { ReviewContext } from '../context/ReviewContext';

export default function Indvidualproperty() 
{
 const navigate = useNavigate();
 const { properties, deleteProperty } = useContext(PropertyContext) || { properties: [] };
 const {id} = useParams();
const [listing, setListing] = useState({})
//  const [comments, setComments] = useState([]);
//  const [newComment, setNewComment] = useState({ name: '', rating: '', review: '' });
//  const [editingCommentId, setEditingCommentId] = useState(null);

 const { comments, newComment, editingCommentId, handleInputChange, handleSubmit, handleCancelEdit } = useContext(ReviewContext) || { comments: [] };

  return (
    <div className='container mx-auto p-6'>
      

    <div  className="bg-white p-6 rounded-lg shadow-lg">
        <div class="p-5">
           
               
        {properties?.map(property => (
  <div key={property.id}>
    <img 
      className="rounded-lg mx-auto my-4 shadow h-[70vh] w-full object-cover" 
      src={property.image} 
      alt={property.title} 
    />
    <h5 className="text-4xl font-extrabold mb-4 p-6 text-center text-blue-700 underline">
      {property.title}
    </h5>
    <p className="mb-3 font-normal text-gray-700 p-5 dark:text-gray-400">
      Description: {property.description}
    </p>
    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
      Price: {property.price}
    </p>
    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
      Address: {property.address}
    </p>
  </div>
))}
    
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    <p style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}> <strong>ALL COMMENTS</strong> </p>
     
                      {comments.map(comment => (
                      <ul>  
                        <li key={comment.id} style={{ textAlign: 'center', marginBottom: '20px', maxWidth: '400px', margin: '0 auto' }}>
                        
                        <div style={{ backgroundColor: '#f0f0f0', padding: '15px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                          <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}><strong>{comment.name}</strong></p>
    
                          <p style={{ fontSize: '16px', marginBottom: '5px' }}>Rating: {comment.rating}</p>
    
                          <p style={{ fontSize: '14px', lineHeight: '1.5', padding: '10px', borderRadius: '3px', backgroundColor: 'white' }}>{comment.review}</p>
                        </div>
                        <button onClick={() => handleEdit(comment.id)} class="text-black border border-blue-500 hover:border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-7 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-900">Edit</button>
    
                        <button onClick={() => handleCommentDelete(comment.id)} class="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900" >Delete</button>
                        </li>
                      </ul>
                      ))}
                      
                </p>
    
                {/* Form for adding or editing comment : YOU CAN FORMAT*/}
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                  <form style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }} onSubmit={handleSubmit}> {/* ADD THIS: onSubmit={handleSubmit}*/}
    
                    {/* <label htmlFor="name" style={{ marginBottom: '10px', display: 'block', fontSize: '16px' }} >Name:</label>
                    <input type="text" name="name" placeholder="Name" value={newComment.name} style={{ width: '100%', padding: '10px', fontSize: '14px', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '15px' }}  required /> ADD THIS HERE: onChange={handleInputChange} */}
    
                    <label htmlFor="rating" style={{ marginBottom: '10px', display: 'block', fontSize: '16px' }}>Rating:</label>
                    <input type="number" name="rating" placeholder="Rating" value={newComment.rating} style={{ width: '100%', padding: '10px', fontSize: '14px', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '15px' }} onChange={handleInputChange} required /> {/* ADD THIS HERE: onChange={handleInputChange} */}
    
                    <label htmlFor="review" style={{ marginBottom: '10px', display: 'block', fontSize: '16px' }} >Review:</label>
                    <textarea name="review" placeholder="Review" value={newComment.review} style={{ width: '100%', padding: '10px', fontSize: '14px', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '20px' }} onChange={handleInputChange} required /> {/* ADD THIS HERE: onChange={handleInputChange} */}
    
                    <div style={{ textAlign: 'center' }}>   
                      <button type="submit" style={{ backgroundColor: '#007bff', color: '#fff', padding: '10px 20px', fontSize: '16px', borderRadius: '5px', border: 'none', marginRight: '10px' }} >{editingCommentId ? 'Edit Comment' : 'Add Comment'}</button>
                      {editingCommentId && <button type="button" style={{ backgroundColor: '#dc3545', color: '#fff', padding: '10px 20px', fontSize: '16px', borderRadius: '5px', border: 'none' }} onClick={handleCancelEdit}>Cancel Edit</button>} {/* ADD THIS HERE: onClick={handleCancelEdit} */}
                    </div>
                  </form>
                </div>   
               
           
             
              <button onClick={() => handleDelete(listing.id)} type="button" class="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-7 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">Delete Property</button>
            
        </div>
    </div>
    
          
        </div>
  )}