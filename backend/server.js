import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Moment from './models/moments.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/loveUnfolds', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes

// Get all moments with search and pagination
app.get('/moments', async (req, res) => {
  try {
    const { search = '', page = 1, limit = 5 } = req.query;
    const query = { title: { $regex: search, $options: 'i' } };

    const moments = await Moment.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Moment.countDocuments(query);

    res.json({
      moments,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new moment
app.post('/moments', async (req, res) => {
  const newMoment = new Moment(req.body);
  try {
    await newMoment.save();
    res.status(201).json(newMoment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a moment
app.delete('/moments/:id', async (req, res) => {
  try {
    await Moment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Moment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
