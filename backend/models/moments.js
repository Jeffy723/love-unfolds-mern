// File: models/moments.js

const mongoose = require('mongoose');

// This schema now matches what your MomentCard component expects.
const momentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true }, // Changed from 'description' to 'message'
    creator: { type: String, required: true },
    tags: [String], // An array of strings
    selectedFile: String, // For the Base64 image string
  },
  { timestamps: true }
);

// Mongoose will create a collection named 'moments' (lowercase, plural)
const Moment = mongoose.model('Moment', momentSchema);

module.exports = Moment;