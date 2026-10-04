import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const s = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ['admin', 'member'], default: 'member' },
  },
  { timestamps: true }
);

s.pre('save', async function () {
  if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 10);
});
s.methods.match = function (p) {
  return bcrypt.compare(p, this.password);
};

export default mongoose.model('User', s);
