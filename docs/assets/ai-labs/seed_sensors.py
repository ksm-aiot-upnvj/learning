"""AI Generated, need human review."""

import os
from datetime import datetime, timedelta
from uuid import uuid5

from psycopg import connect

from sensor_data import DEVICES, START, read_data

SCHEMA = """
CREATE SCHEMA IF NOT EXISTS mcp_lab;
CREATE TABLE IF NOT EXISTS mcp_lab.devices (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS mcp_lab.sensor_readings (
    id UUID PRIMARY KEY,
    device_id UUID NOT NULL REFERENCES mcp_lab.devices(id),
    sensor_type TEXT NOT NULL,
    value DOUBLE PRECISION NOT NULL,
    unit TEXT NOT NULL,
    measured_at TIMESTAMPTZ NOT NULL,
    ingested_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS mcp_sensor_device_time
ON mcp_lab.sensor_readings (device_id, sensor_type, measured_at DESC);
"""


def main():
    readings = []
    for row in read_data():
        device = DEVICES[row["device_id"]]
        sensor = row["sensor_type"]
        measured = datetime.fromisoformat(row["measured_at"])
        reading_id = uuid5(device, f"{sensor}/{measured.isoformat()}")
        readings.append((reading_id, device, sensor, float(row["value"]), row["unit"],
                         measured, measured + timedelta(seconds=5)))

    with connect(os.environ["SENSOR_LAB_DSN"], connect_timeout=3) as connection:
        with connection.cursor() as cursor:
            cursor.execute(SCHEMA)
            cursor.executemany(
                """
                INSERT INTO mcp_lab.devices (id, name, created_at, updated_at)
                VALUES (%s, %s, %s, %s) ON CONFLICT (id) DO NOTHING
                """,
                [(device, name, START, START) for name, device in DEVICES.items()],
            )
            cursor.executemany(
                """
                INSERT INTO mcp_lab.sensor_readings
                  (id, device_id, sensor_type, value, unit, measured_at, ingested_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO NOTHING
                """,
                readings,
            )
            count = cursor.execute("SELECT count(*) FROM mcp_lab.sensor_readings").fetchone()[0]
    print(f"Total pembacaan dalam skema mcp_lab: {count}")


if __name__ == "__main__":
    main()
