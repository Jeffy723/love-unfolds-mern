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

  // ✅ Updated API URL for Railway
  const API_BASE_URL = 'https://love-unfolds.up.railway.app';

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

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4 text-danger fw-bold">❤️ Love Unfolds - Moments that Matter ❤️</h1>

      {/* Add New Moment */}
      <div className="card mb-4 shadow">
        <div className="card-body">
          <h5 className="card-title">Add a New Moment</h5>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="form-control mb-2"
            placeholder="Description"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <button className="btn btn-primary" onClick={handleAddMoment}>
            Add Moment
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search moments by title..."
        value={searchQuery}
        onChange={handleSearch}
      />

      {/* Moments List */}
      <ul className="list-group shadow mb-3">
        {moments.length === 0 ? (
          <li className="list-group-item text-center">No moments found.</li>
        ) : (
          moments.map((moment) => (
            <li key={moment._id} className="list-group-item">
              <h5 className="mb-1 text-primary">{moment.title}</h5>
              <p className="mb-1">{moment.description}</p>
              <small className="text-muted">{new Date(moment.createdAt).toLocaleString()}</small>
              <button
                className="btn btn-sm btn-outline-danger float-end"
                onClick={() => handleDeleteMoment(moment._id)}
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>

      {/* Pagination */}
      <div className="d-flex justify-content-center gap-2">
        <button
          className="btn btn-outline-secondary"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="align-self-center">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-outline-secondary"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      <ToastContainer position="top-center" autoClose={2000} hideProgressBar theme="colored" />
    </div>
  );
}

export default App;
