import mongoose from 'mongoose';

const preferencesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    routePreference: {
      type: String,
      enum: ['fastest', 'cheapest', 'accessible', 'leastWalking'],
      default: 'fastest',
    },
    avoidTransportTypes: [String],
    preferredTransportTypes: [String],
    maxWalkingDistance: Number, // in km
    avoidCrowded: { type: Boolean, default: false },
    preferNightSafety: { type: Boolean, default: false },
    darkMode: { type: Boolean, default: false },
    highContrast: { type: Boolean, default: false },
    fontSize: {
      type: String,
      enum: ['small', 'normal', 'large', 'xlarge'],
      default: 'normal',
    },
    language: {
      type: String,
      enum: ['en', 'ta'],
      default: 'en',
    },
  },
  { timestamps: true }
);

export const Preferences = mongoose.model('Preferences', preferencesSchema);
