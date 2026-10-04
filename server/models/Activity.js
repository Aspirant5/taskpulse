import mongoose from 'mongoose';
const { Schema } = mongoose;

export default mongoose.model(
  'Activity',
  new Schema(
    {
      project: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      task: { type: Schema.Types.ObjectId },
      action: { type: String, enum: ['created', 'moved', 'updated', 'deleted'], required: true },
      title: String,
      from: String,
      to: String,
    },
    { timestamps: { createdAt: true, updatedAt: false } }
  )
);
