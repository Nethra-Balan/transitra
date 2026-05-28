import mongoose from 'mongoose';

const replanEventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    eventType: {
      type: String,
      enum: ['delay', 'missed_stop', 'crowded', 'breakdown', 'accident'],
      required: true,
    },
    description: String,
    originalRoute: {
      routeNumber: String,
      sourceStop: String,
      destinationStop: String,
    },
    alternativeRoutes: [],
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const ReplanEvent = mongoose.model('ReplanEvent', replanEventSchema);
