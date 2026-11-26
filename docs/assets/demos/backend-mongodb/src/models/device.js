import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Nama device wajib diisi'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Lokasi device wajib diisi'],
    },
    status: {
      type: String,
      enum: ['online', 'offline', 'maintenance'],
      default: 'offline',
    },
    sensorData: {
      temperature: { type: Number, default: 0 },
      humidity: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

const Device = mongoose.model('Device', deviceSchema);
export default Device;
