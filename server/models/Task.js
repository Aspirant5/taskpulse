import mongoose from 'mongoose';
const { Schema } = mongoose;

export default mongoose.model(
  'Task',
  new Schema(
    {
      title: { type: String, required: true, trim: true, maxlength: 120 },
      description: { type: String, trim: true, maxlength: 1000, default: '' },
      status: { type: String, enum: ['todo', 'inprogress', 'done'], default: 'todo' },
      project: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
      createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      assignee: { type: Schema.Types.ObjectId, ref: 'User', default: null },
      order: { type: Number, default: 0 },
    },
    { timestamps: true }
  )
);
