import React, { createContext, useState, useEffect } from 'react';

export const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ name: '', rating: '', review: '' });
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [id, setId] = useState(null); 

 
  useEffect(() => {
    fetchComments();
  }, [id]);

  const fetchComments = () => {

    fetch(`http://127.0.0.1:5000/reviews/${id}`)
      .then(response => response.json())
      .then(data => setComments(data))
      .catch(error => console.error('Error fetching comments:', error));
  };
  const handleSubmit = (event) => {
    event.preventDefault();

if (editingCommentId) {
  
  fetch(`http://127.0.0.1:5000/reviews/${editingCommentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newComment),
  })
    .then(response => response.json())
    .then(() => {
      fetchComments(); 
      setEditingCommentId(null); 
      setNewComment({ name: '', rating: '', review: '' }); 
    })
    .catch(error => console.error('Error editing comment:', error));
} else {
 
  fetch('/api/comments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newComment),
  })
    .then(response => response.json())
    .then(() => {
      fetchComments(); 
      setNewComment({ name: '', rating: '', review: '' });
    })
    .catch(error => console.error('Error adding comment:', error));
}
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

 
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setNewComment({ name: '', rating: '', review: '' });
  };

 
  const handleCommentDelete = (commentId) => {
    fetch(`http://127.0.0.1:5000/reviews/${commentId}`, {
      method: 'DELETE',
    })
      .then(() => {
        fetchComments(); 
      })
      .catch(error => console.error('Error deleting comment:', error));
  };

  return (
    <ReviewContext.Provider
      value={{
        comments,
        newComment,
        editingCommentId,
        handleSubmit,
        handleInputChange,
        handleEdit,
        handleCancelEdit,
        handleCommentDelete,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
};