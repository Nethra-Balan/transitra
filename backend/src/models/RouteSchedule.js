import mongoose from 'mongoose';

const routeScheduleSchema = new mongoose.Schema(
  {
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BusRoute',
      required: true,
    },
    routeNumber: String,
    schedules: [
      {
        dayOfWeek: {
          type: String,
          enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        },
        departures: [String], // e.g., ["06:00", "06:30", "07:00"]
      },
    ],
    peakHours: {
      startTime: String,
      endTime: String,
      frequency: Number, // in minutes
    },
    offPeakFrequency: Number, // in minutes
    lastBusDeparture: String,
  },
  { timestamps: true }
);

export const RouteSchedule = mongoose.model('RouteSchedule', routeScheduleSchema);
