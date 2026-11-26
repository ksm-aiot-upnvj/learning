/* AI Generated */
function validateSensor(req, res, next) {
  const { device_id, sensor_type, value, unit } = req.body ?? {};
  const hasText = (field) => typeof field === "string" && field.trim() !== "";

  if (!hasText(device_id) || !hasText(sensor_type) || !Number.isFinite(value) || !hasText(unit)) {
    return res.status(400).json({ error: "Format data sensor tidak valid" });
  }

  req.sensor = {
    device_id: device_id.trim(),
    sensor_type: sensor_type.trim(),
    value,
    unit: unit.trim(),
  };
  next();
}

module.exports = validateSensor;
