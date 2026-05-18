const mongoose = require('mongoose');

const blockoutDateSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: true,
    },
    reason: { type: String, default: 'Unavailable', maxlength: 200 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

blockoutDateSchema.index({ date: 1 });

module.exports = mongoose.model('BlockoutDate', blockoutDateSchema);
