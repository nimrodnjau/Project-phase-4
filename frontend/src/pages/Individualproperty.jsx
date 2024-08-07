
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ReviewContext } from '../context/ReviewContext';
import { UserContext } from '../context/UserContext';

export default function IndividualProperty() {
  const navigate = useNavigate();
  const {auth_token, currentUser } = useContext(UserContext);

  console.log(auth_token, currentUser)

  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({rating: '', review: '' });
  const [editingCommentId, setEditingCommentId] = useState(null);
  // const {
  //   comments = [],
  //   newComment = { rating: '', review: '' }, // Default value
  //   editingCommentId,
  //   handleInputChange,
  //   handleSubmit,
  //   handleCancelEdit,
  //   handleCommentDelete,
  //   handleEdit
  // } = useContext(ReviewContext) || {};

  const [listing, setListing] = useState(null);



//fetching comments(They aren't displaying when using useContext)
  useEffect(() => {
    fetchComments();
  }, [id]);

  const fetchComments = () => {
    fetch(`https://real-estate-listing-app.onrender.com/reviews`)
      .then(response => response.json())
      .then(data => setComments(data))
      .catch(error => console.error('Error fetching comments:', error));
  };

  // const [auth_token, setAuth_token] = useState(() => localStorage.getItem("access_token") ? localStorage.getItem("access_token") : null);

  const handleSubmit = (event) => {
    event.preventDefault();

    //if the button is not for editing, its for posting
// if (editingCommentId) {

  // Editing a comment
//   fetch(`http://127.0.0.1:5000/reviews/${editingCommentId}`, {
//     method: 'PATCH',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${auth_token}`,
//     },
//     body: JSON.stringify(newComment),
//   })
//     .then(response => response.json())
//     .then(() => {
//       fetchComments(); 
//       setEditingCommentId(null); 
//       setNewComment({ rating: '', review: '' }); 
//     })
//     .catch(error => console.error('Error editing comment:', error));
// } else {
 

  //Adding/POSTing a comment
  console.log("You", auth_token)

  fetch(`https://real-estate-listing-app.onrender.com/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      
    },
    body: JSON.stringify({id: currentUser.id, newComment: newComment}),
  })
    .then(response => response.json())
    .then(() => {
      fetchComments(); 
      setNewComment({ rating: '', review: '' });
    })
    .catch(error => console.error('Error adding comment:', error));
  // }
  };



  
const handleInputChange = (event) => {
  const { name, value } = event.target;
  setNewComment({ ...newComment, [name]: value });
};


const handleEdit = (commentId) => {
  const commentToEdit = comments.find(comment => comment.id === commentId);
  setEditingCommentId(commentId);
  setNewComment({ ...commentToEdit });
};


//Deleting a comment
const handleCommentDelete = (commentId) => {
  fetch(`https://real-estate-listing-app.onrender.com/reviews/${commentId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`,
    },
  })
    .then(() => {
      fetchComments(); 
    })
    .catch(error => console.error('Error deleting comment:', error));
};
 

const handleCancelEdit = () => {
  setEditingCommentId(null);
  setNewComment({ name: '', rating: '', review: '' });
};


  useEffect(() => {
    // Fetch property details by id
    const fetchProperty = () => {
      fetch(`https://real-estate-listing-app.onrender.com/real_estate/${id}`)
        .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch property');
        }
        return response.json();
      })
        .then(data => {
          setListing(data);
        })
        .catch(error => {
          console.error('Error fetching property:', error);
          // Handle error, show toast message, etc.
          toast.error('Failed to fetch property');
        });
    };

    fetchProperty();
  }, [id]);


  //Deleting the property
  const handlePropertyDelete = () => {
    fetch(`https://real-estate-listing-app.onrender.com/real_estate/${listing.id}`), {
      method: 'DELETE',
      headers: {
      'Content-Type': 'application/json',
       'Authorization': `Bearer ${localStorage.getItem('token')}`  // Replace with your JWT token management
      }
     }
      .then(response => {
  if (!response.ok) {
    throw new Error('Failed to delete property');
  }
  toast.success('Property deleted successfully');
  navigate('/'); // Redirect to home page or listing page after deletion
})
  .catch(error => {
    console.error('Error deleting property:', error);
    toast.error('Failed to delete property');
  });
  };

if (!listing) {
  return <div>Loading...</div>;
}

return (
  <div  className='container mx-auto p-6'>
    <div  key={listing.id} className="bg-white p-6 rounded-lg shadow-lg">
      <div className="p-5">
        <img
          className="rounded-lg mx-auto my-4 shadow h-[70vh] w-full object-cover"
          src={listing.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd0P-8jGLtQjo5Xcy0YxABxzwUQ5Fwgs0ATQ&s"}
          alt={listing.title}
        />
        <h5 className="text-4xl font-extrabold mb-4 p-6 text-center text-blue-700 underline">
          {listing.title}
        </h5>
        <p className="mb-3 text-lg font-normal text-gray-700 p-5 dark:text-gray-400">
          Description: {listing.description}
        </p>
        <p className="mb-3 text-lg font-normal text-gray-700 dark:text-gray-400">
          Price: ${listing.price.toFixed(2)} {/* Assuming price is a number */}
        </p>
        <p className="mb-3 text-lg font-normal text-gray-700 dark:text-gray-400">
          Address: {listing.address}
        </p>
      </div>

      {comments.map(comment => (
      <div  className="mb-3 font-normal text-gray-700 dark:text-gray-400">
        <p style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
          <strong>ALL COMMENTS</strong>
        </p>
        
          <ul key={comments.id}>
            <li style={{ textAlign: 'center', marginBottom: '20px', maxWidth: '400px', margin: '0 auto' }}>
              <div style={{ backgroundColor: '#f0f0f0', padding: '15px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                {/* <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                  <strong>{comments.name}</strong> */}
                {/* </p> */}
                <p style={{ fontSize: '16px', marginBottom: '5px' }}>Rating: {comment.rating}</p>
                <p style={{ fontSize: '14px', lineHeight: '1.5', padding: '10px', borderRadius: '3px', backgroundColor: 'white' }}>{comment.comment}</p>
              </div>

              <button onClick={() => handleEdit(comment.id)} className="text-black border border-blue-500 hover:border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-7 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-900">Edit</button>


              <button onClick={() => handleCommentDelete(comment.id)} className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">Delete</button>
            </li>
          </ul>
        
      </div>
    ))}

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <form style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }} onSubmit={handleSubmit}>
          <label htmlFor="rating" style={{ marginBottom: '10px', display: 'block', fontSize: '16px' }}>Rating:</label>
          <input type="number" name="rating" placeholder="Rating" value={newComment.rating} style={{ width: '100%', padding: '10px', fontSize: '14px', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '15px' }} onChange={handleInputChange} required />
          <label htmlFor="review" style={{ marginBottom: '10px', display: 'block', fontSize: '16px' }}>Review:</label>
          <textarea name="review" placeholder="Review" value={newComment.review} style={{ width: '100%', padding: '10px', fontSize: '14px', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '20px' }} onChange={handleInputChange} required />
          <div style={{ textAlign: 'center' }}>
            <button type="submit" style={{ backgroundColor: '#007bff', color: '#fff', padding: '10px 20px', fontSize: '16px', borderRadius: '5px', border: 'none', marginRight: '10px' }}>{editingCommentId ? 'Edit Comment' : 'Add Comment'}</button>
            {editingCommentId && <button type="button" style={{ backgroundColor: '#dc3545', color: '#fff', padding: '10px 20px', fontSize: '16px', borderRadius: '5px', border: 'none' }} onClick={handleCancelEdit}>Cancel Edit</button>}
          </div>
        </form>
      </div>

      <button onClick={handlePropertyDelete} type="button" className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-7 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">Delete Property</button>
    </div>
  </div>
);
}