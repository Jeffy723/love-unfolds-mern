const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Moment = require('./models/moments');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors({
  origin: 'https://love-unfolds-mern.vercel.app', // ✅ Allow only your frontend domain
}));
app.use(express.json());

// ✅ Health Check Route for Railway to keep the server alive
// This is the most important fix.
app.get('/', (req, res) => {
  res.status(200).send('Love Unfolds API is healthy and running!');
});

// ✅ MongoDB Connection (No options needed for modern Mongoose)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Get all moments (search + pagination)
app.get('/moments', async (req, res) => {
  try {
    const { search = '', page = 1, limit = 5 } = req.query;
    const query = search
      ? { title: { $regex: search, $options: 'i' } }
      : {};

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

// ✅ Create a new moment
app.post('/moments', async (req, res) => {
  const newMoment = new Moment(req.body);
  try {
    await newMoment.save();
    res.status(201).json(newMoment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ Delete a moment
app.delete('/moments/:id', async (req, res) => {
  try {
    await Moment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Moment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Server Listen
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});