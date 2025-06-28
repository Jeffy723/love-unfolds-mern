// File: App.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import FileBase from 'react-file-base64'; // You may need to install this: npm install react-file-base64
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// This is the child component from your previous code
import MomentCard from './components/MomentCard'; // Make sure you have this component

function App() {
  const [moments, setMoments] = useState([]);
  
  // --- Updated State to match the backend schema ---
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState(''); // Changed from description
  const [creator, setCreator] = useState('');
  const [tags, setTags] = useState('');
  const [selectedFile, setSelectedFile] = useState('');
  // ------------------------------------------------

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const fetchMoments = async (page = 1, search = '') => {
    try {
      const response = await axios.get(`${API_BASE_URL}/moments`, {
        params: { page, limit, search },
      });
      setMoments(response.data.moments);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching moments:', error);
      toast.error('Failed to load moments!');
    }
  };

  useEffect(() => {
    fetchMoments();
  }, []);

  const clearForm = () => {
    setTitle('');
    setMessage('');
    setCreator('');
    setTags('');
    setSelectedFile('');
  };

  const handleAddMoment = async () => {
    // Updated validation
    if (!title.trim() || !message.trim() || !creator.trim()) {
      toast.warn('Title, Message, and Creator are required!');
      return;
    }

    const newMomentData = {
      title,
      message,
      creator,
      tags: tags.split(',').map(tag => tag.trim()), // Convert comma-separated string to array
      selectedFile,
    };

    try {
      await axios.post(`${API_BASE_URL}/moments`, newMomentData);
      toast.success('Moment added ❤️');
      clearForm();
      fetchMoments(1, ''); // Fetch from the first page to see the new moment
    } catch (error) {
      console.error('Error adding moment:', error);
      toast.error('Failed to add moment!');
    }
  };

  const handleDeleteMoment = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/moments/${id}`);
      toast.info('Moment deleted 🗑️');
      fetchMoments(currentPage, searchQuery);
    } catch (error) {
      console.error('Error deleting moment:', error);
      toast.error('Failed to delete moment!');
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchMoments(1, query);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchMoments(newPage, searchQuery);
    }
  };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4 text-danger fw-bold">❤️ Love Unfolds - Moments that Matter ❤️</h1>

      {/* --- Updated Form --- */}
      <div className="card mb-4 shadow">
        <div className="card-body">
          <h5 className="card-title">Add a New Moment</h5>
          <input type="text" className="form-control mb-2" placeholder="Creator" value={creator} onChange={(e) => setCreator(e.target.value)} />
          <input type="text" className="form-control mb-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea className="form-control mb-2" placeholder="Message" rows="3" value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
          <input type="text" className="form-control mb-2" placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
          <div className="mb-2"><FileBase type="file" multiple={false} onDone={({ base64 }) => setSelectedFile(base64)} /></div>
          <button className="btn btn-primary" onClick={handleAddMoment}>Add Moment</button>
        </div>
      </div>
      {/* -------------------- */}
      
      {/* ... The rest of your search, list, and pagination JSX is fine ... */}
      {/* Make sure your list mapping uses the MomentCard component */}
      <div className="row">
        {moments.length === 0 ? (
          <p className="text-center">No moments found.</p>
        ) : (
          moments.map((moment) => (
            <MomentCard key={moment._id} moment={moment} onDelete={handleDeleteMoment} />
          ))
        )}
      </div>

    </div>
  );
}

export default App;