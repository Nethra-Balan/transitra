import mongoose from 'mongoose';

const travelHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sourceStop: {
      stopId: String,
      stopName: String,
    },
    destinationStop: {
      stopId: String,
      stopName: String,
    },
    selectedRoute: {
      routeNumber: String,
      routeName: String,
    },
    fare: Number,
    duration: Number,
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    notes: String,
    date: {
      type: Date,
      default: Date.now,
    },
    cancelled: {
      type: Boolean,
      default: false,
    },
    delayMinutes: Number,
  },
  { timestamps: true }
);

export const TravelHistory = mongoose.model('TravelHistory', travelHistorySchema);
