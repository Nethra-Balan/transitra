import mongoose from 'mongoose';
import { config } from '../src/config/index.js';
import { BusStop, BusRoute, RouteSchedule } from '../src/models/index.js';

const mockStops = [
  {
    stopId: 'S001',
    name: 'Central Station',
    description: 'Main transport hub',
    location: {
      type: 'Point',
      coordinates: [80.27, 13.08],
    },
    accessibility: {
      wheelchairRamp: true,
      elevator: true,
      sittingArea: true,
      shelter: true,
    },
    amenities: ['water_fountain', 'bench', 'restroom'],
  },
  {
    stopId: 'S002',
    name: 'City College',
    description: 'College area',
    location: {
      type: 'Point',
      coordinates: [80.28, 13.09],
    },
    accessibility: {
      wheelchairRamp: true,
      elevator: false,
      sittingArea: true,
      shelter: true,
    },
    amenities: ['water_fountain', 'bench'],
  },
  {
    stopId: 'S003',
    name: 'Park Avenue',
    description: 'Main shopping area',
    location: {
      type: 'Point',
      coordinates: [80.29, 13.1],
    },
    accessibility: {
      wheelchairRamp: true,
      elevator: false,
      sittingArea: true,
      shelter: true,
    },
    amenities: ['water_fountain', 'bench', 'shop'],
  },
  {
    stopId: 'S004',
    name: 'Railway Crossing',
    description: 'Near railway station',
    location: {
      type: 'Point',
      coordinates: [80.3, 13.11],
    },
    accessibility: {
      wheelchairRamp: false,
      elevator: false,
      sittingArea: true,
      shelter: false,
    },
    amenities: ['bench'],
  },
  {
    stopId: 'S005',
    name: 'Beach Road',
    description: 'Coastal area',
    location: {
      type: 'Point',
      coordinates: [80.31, 13.12],
    },
    accessibility: {
      wheelchairRamp: true,
      elevator: false,
      sittingArea: true,
      shelter: true,
    },
    amenities: ['water_fountain', 'bench', 'restroom'],
  },
  {
    stopId: 'S006',
    name: 'Market Square',
    description: 'Commercial center',
    location: {
      type: 'Point',
      coordinates: [80.26, 13.07],
    },
    accessibility: {
      wheelchairRamp: true,
      elevator: false,
      sittingArea: true,
      shelter: true,
    },
    amenities: ['water_fountain', 'bench', 'shop'],
  },
];

const mockRoutes = [
  {
    routeNumber: '1A',
    routeName: 'Central - Beach',
    description: 'From central station to beach road',
    type: 'ordinary',
    stops: [
      { stopId: null, stopName: 'Central Station', order: 1, arrivalTime: '0' },
      { stopId: null, stopName: 'City College', order: 2, arrivalTime: '10' },
      { stopId: null, stopName: 'Park Avenue', order: 3, arrivalTime: '20' },
      { stopId: null, stopName: 'Railway Crossing', order: 4, arrivalTime: '30' },
      { stopId: null, stopName: 'Beach Road', order: 5, arrivalTime: '45' },
    ],
    startPoint: 'Central Station',
    endPoint: 'Beach Road',
    totalDistance: 8,
    totalDuration: 45,
    baseFare: 15,
    operatedBy: 'City Transport',
    accessibility: {
      wheelchairAccessible: true,
      audio: true,
      ramps: true,
    },
  },
  {
    routeNumber: '2B',
    routeName: 'Market Square - Beach',
    description: 'From market square to beach',
    type: 'express',
    stops: [
      { stopId: null, stopName: 'Market Square', order: 1, arrivalTime: '0' },
      { stopId: null, stopName: 'Park Avenue', order: 2, arrivalTime: '15' },
      { stopId: null, stopName: 'Beach Road', order: 3, arrivalTime: '25' },
    ],
    startPoint: 'Market Square',
    endPoint: 'Beach Road',
    totalDistance: 6,
    totalDuration: 25,
    baseFare: 12,
    operatedBy: 'Express Transport',
    accessibility: {
      wheelchairAccessible: true,
      audio: false,
      ramps: false,
    },
  },
  {
    routeNumber: '3C',
    routeName: 'Central - Market Square',
    description: 'Central to market square route',
    type: 'ordinary',
    stops: [
      { stopId: null, stopName: 'Central Station', order: 1, arrivalTime: '0' },
      { stopId: null, stopName: 'City College', order: 2, arrivalTime: '8' },
      { stopId: null, stopName: 'Market Square', order: 3, arrivalTime: '18' },
    ],
    startPoint: 'Central Station',
    endPoint: 'Market Square',
    totalDistance: 4,
    totalDuration: 18,
    baseFare: 10,
    operatedBy: 'City Transport',
    accessibility: {
      wheelchairAccessible: false,
      audio: false,
      ramps: false,
    },
  },
  {
    routeNumber: '4D',
    routeName: 'Railway Crossing - Central',
    description: 'Railway crossing to central',
    type: 'ordinary',
    stops: [
      { stopId: null, stopName: 'Railway Crossing', order: 1, arrivalTime: '0' },
      { stopId: null, stopName: 'Park Avenue', order: 2, arrivalTime: '12' },
      { stopId: null, stopName: 'City College', order: 3, arrivalTime: '20' },
      { stopId: null, stopName: 'Central Station', order: 4, arrivalTime: '30' },
    ],
    startPoint: 'Railway Crossing',
    endPoint: 'Central Station',
    totalDistance: 5,
    totalDuration: 30,
    baseFare: 10,
    operatedBy: 'City Transport',
    accessibility: {
      wheelchairAccessible: true,
      audio: true,
      ramps: false,
    },
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(config.mongodb.uri);
    console.log('Connected to MongoDB');

    // Clear existing data
    await BusStop.deleteMany({});
    await BusRoute.deleteMany({});
    await RouteSchedule.deleteMany({});
    console.log('Cleared existing data');

    // Insert stops
    const insertedStops = await BusStop.insertMany(mockStops);
    console.log(`✓ Inserted ${insertedStops.length} bus stops`);

    // Insert routes with stop references
    const routesWithStops = mockRoutes.map((route) => ({
      ...route,
      stops: route.stops.map((stop, idx) => {
        const matchingStop = insertedStops.find((s) => s.name === stop.stopName);
        return {
          stopId: matchingStop ? matchingStop._id : null,
          stopName: stop.stopName,
          order: stop.order,
          arrivalTime: stop.arrivalTime,
        };
      }),
    }));

    const insertedRoutes = await BusRoute.insertMany(routesWithStops);
    console.log(`✓ Inserted ${insertedRoutes.length} bus routes`);

    // Insert schedules
    const schedules = insertedRoutes.map((route) => ({
      routeId: route._id,
      routeNumber: route.routeNumber,
      schedules: [
        {
          dayOfWeek: 'monday',
          departures: ['06:00', '06:30', '07:00', '07:30', '08:00'],
        },
        {
          dayOfWeek: 'tuesday',
          departures: ['06:00', '06:30', '07:00', '07:30', '08:00'],
        },
        {
          dayOfWeek: 'wednesday',
          departures: ['06:00', '06:30', '07:00', '07:30', '08:00'],
        },
        {
          dayOfWeek: 'thursday',
          departures: ['06:00', '06:30', '07:00', '07:30', '08:00'],
        },
        {
          dayOfWeek: 'friday',
          departures: ['06:00', '06:30', '07:00', '07:30', '08:00'],
        },
        {
          dayOfWeek: 'saturday',
          departures: ['07:00', '07:30', '08:00', '08:30'],
        },
        {
          dayOfWeek: 'sunday',
          departures: ['08:00', '08:30', '09:00'],
        },
      ],
      peakHours: {
        startTime: '08:00',
        endTime: '10:00',
        frequency: 10,
      },
      offPeakFrequency: 20,
      lastBusDeparture: '22:00',
    }));

    await RouteSchedule.insertMany(schedules);
    console.log(`✓ Inserted ${schedules.length} route schedules`);

    console.log('✓ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Database seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
