import mongoose from 'mongoose';

const savedRouteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: String,
    sourceStop: {
      stopId: String,
      stopName: String,
      coordinates: [Number],
    },
    destinationStop: {
      stopId: String,
      stopName: String,
      coordinates: [Number],
    },
    selectedRoute: {
      routeNumber: String,
      routeName: String,
      totalDuration: Number,
      baseFare: Number,
      stops: [],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    frequency: {
      type: Number,
      default: 1,
    },
    lastUsed: Date,
    tags: [String], // e.g., ["work", "home", "gym"]
  },
  { timestamps: true }
);

export const SavedRoute = mongoose.model('SavedRoute', savedRouteSchema);
