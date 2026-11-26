import Device from '../models/device.js';

// [READ ALL + QUERY PARAMS] GET /api/devices?status=online
export const getAllDevices = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const devices = await Device.find(filter);
    res.status(200).json({
      count: devices.length,
      data: devices,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// [READ ONE + PATH PARAMS] GET /api/devices/:id
export const getDeviceById = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({ message: 'Device tidak ditemukan' });
    }

    res.status(200).json({ data: device });
  } catch (error) {

    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Format ID device tidak valid' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// [CREATE] POST /api/devices
export const createDevice = async (req, res) => {
  try {
    const newDevice = await Device.create(req.body);

    res.status(201).json({
      message: 'Device berhasil ditambahkan',
      data: newDevice,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// [UPDATE] PUT /api/devices/:id
export const updateDevice = async (req, res) => {
  try {
    const updatedDevice = await Device.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedDevice) {
      return res.status(404).json({ message: 'Device tidak ditemukan' });
    }

    res.status(200).json({
      message: 'Device berhasil diperbarui',
      data: updatedDevice,
    });
  } catch (error) {
    if (error.name === 'CastError' || error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// [DELETE] DELETE /api/devices/:id
export const deleteDevice = async (req, res) => {
  try {
    const deletedDevice = await Device.findByIdAndDelete(req.params.id);

    if (!deletedDevice) {
      return res.status(404).json({ message: 'Device tidak ditemukan' });
    }

    res.status(200).json({ message: 'Device berhasil dihapus' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Format ID device tidak valid' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
