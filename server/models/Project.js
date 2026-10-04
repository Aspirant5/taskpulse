import mongoose from 'mongoose';
const { Schema } = mongoose;

export default mongoose.model(
  'Project',
  new Schema(
    {
      name: { type: String, required: true, trim: true, maxlength: 80 },
      description: { type: String, trim: true, maxlength: 300, default: '' },
      owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    { timestamps: true }
  )
);
