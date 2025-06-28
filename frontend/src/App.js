import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [moments, setMoments] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  // ✅ Use an Environment Variable for the API URL (Best Practice)
  // This will use the URL from Vercel in production, or localhost in development.
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

  const handleAddMoment = async () => {
    if (!title.trim() || !description.trim()) {
      toast.warn('Both Title and Description are required!');
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/moments`, { title, description });
      toast.success('Moment added ❤️');
      setTitle('');
      setDescription('');
      fetchMoments(currentPage, searchQuery);
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

  // ... rest of your JSX return statement is perfect, no changes needed ...
  return (
    <div className="container py-4">
      {/* ... your JSX code here ... */}
    </div>
  );
}

export default App;