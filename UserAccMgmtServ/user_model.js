import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  dailyUsageMB: { type: Number, default: 0 },
  dataStoredMB: { type: Number, default: 0 },
  lastReset: { type: Date, default: new Date() },
  
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;