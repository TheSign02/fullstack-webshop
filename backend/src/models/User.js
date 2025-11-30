import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, unique: true, required: true, lowercase: true, index: true },
  password: { type: String, default: null },
  googleId: { type: String, default: null },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: { createdAt: true, updatedAt: true } });

export default mongoose.model('User', userSchema);
