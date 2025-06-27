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
  origin: '*',
}));
app.use(express.json());

// ✅ Check ENV Variable
console.log('------------------------------------');
console.log('✅ Checking ENV variables...');
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('------------------------------------');

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ API Routes

// Get all moments
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

// Create moment
app.post('/moments', async (req, res) => {
  const newMoment = new Moment(req.body);
  try {
    await newMoment.save();
    res.status(201).json(newMoment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete moment
app.delete('/moments/:id', async (req, res) => {
  try {
    await Moment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Moment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Root endpoint (Optional)
app.get('/', (req, res) => {
  res.send('❤️ Love Unfolds Backend Running ❤️');
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});
