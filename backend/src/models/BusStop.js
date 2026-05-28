import mongoose from 'mongoose';

const busStopSchema = new mongoose.Schema(
  {
    stopId: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: String,
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    accessibility: {
      wheelchairRamp: { type: Boolean, default: false },
      elevator: { type: Boolean, default: false },
      sittingArea: { type: Boolean, default: false },
      shelter: { type: Boolean, default: false },
    },
    amenities: [String], 
  },
  { timestamps: true }
);

busStopSchema.index({ location: '2dsphere' });

export const BusStop = mongoose.model('BusStop', busStopSchema);
