import mongoose from 'mongoose';

const busRouteSchema = new mongoose.Schema(
  {
    routeNumber: {
      type: String,
      unique: true,
      required: true,
    },
    routeName: String,
    description: String,
    type: {
      type: String,
      enum: ['ordinary', 'express', 'metro'],
      default: 'ordinary',
    },
    stops: [
      {
        stopId: mongoose.Schema.Types.ObjectId,
        stopName: String,
        order: Number,
        arrivalTime: String, // Relative time or distance
      },
    ],
    startPoint: String,
    endPoint: String,
    totalDistance: Number, // in km
    totalDuration: Number, // in minutes
    baseFare: Number, // in currency units
    operatedBy: String,
    accessibility: {
      wheelchairAccessible: { type: Boolean, default: false },
      audio: { type: Boolean, default: false },
      ramps: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export const BusRoute = mongoose.model('BusRoute', busRouteSchema);
