import mongoose from 'mongoose';

const momentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const Moment = mongoose.model('Moment', momentSchema);

export default Moment;
