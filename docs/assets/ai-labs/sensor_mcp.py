"""AI Generated, need human review."""

import os
from contextlib import contextmanager
from datetime import datetime, timedelta, timezone
from typing import Literal, TypedDict

from mcp.server.fastmcp import FastMCP
from psycopg import connect

from sensor_data import AS_OF, DEVICES, UNITS

mcp = FastMCP("sensor-time-series")
SensorType = Literal["ph", "temperature"]
FRESH_FOR = timedelta(minutes=15)


class LatestReading(TypedDict):
    status: Literal["ok", "stale", "no_data"]
    device_id: str
    sensor_type: SensorType
    as_of: str
    measured_at: str | None
    value: float | None
    unit: str


class ReadingSummary(TypedDict):
    status: Literal["ok", "no_data"]
    device_id: str
    sensor_type: SensorType
    unit: str
    start: str
    end: str
    count: int
    minimum: float | None
    maximum: float | None
    average: float | None


@contextmanager
def read_connection():
    with connect(os.environ["SENSOR_LAB_DSN"], connect_timeout=3) as connection:
        connection.read_only = True
        connection.execute("SET LOCAL statement_timeout = '2s'")
        yield connection


def parse_time(value: str) -> datetime:
    timestamp = datetime.fromisoformat(value)
    if timestamp.utcoffset() is None:
        raise ValueError("Sertakan zona waktu pada timestamp, misalnya Z untuk UTC.")
    return timestamp.astimezone(timezone.utc)


@mcp.tool()
def get_latest_reading(device_id: str, sensor_type: SensorType) -> LatestReading:
    """Baca nilai terakhir esp32-01 atau esp32-02 pada waktu acuan lab."""
    if device_id not in DEVICES:
        raise ValueError("Perangkat tersedia: esp32-01 dan esp32-02.")
    unit = UNITS[sensor_type]
    with read_connection() as connection:
        row = connection.execute(
            """
            SELECT measured_at, value FROM mcp_lab.sensor_readings
            WHERE device_id = %s AND sensor_type = %s AND unit = %s AND measured_at <= %s
            ORDER BY measured_at DESC, id DESC LIMIT 1
            """,
            (DEVICES[device_id], sensor_type, unit, AS_OF),
        ).fetchone()
    if row is None:
        return {"status": "no_data", "device_id": device_id, "sensor_type": sensor_type,
                "as_of": AS_OF.isoformat(), "measured_at": None, "value": None, "unit": unit}
    measured, value = row
    return {"status": "stale" if AS_OF - measured > FRESH_FOR else "ok",
            "device_id": device_id, "sensor_type": sensor_type, "as_of": AS_OF.isoformat(),
            "measured_at": measured.astimezone(timezone.utc).isoformat(),
            "value": value, "unit": unit}


@mcp.tool()
def summarize_readings(device_id: str, sensor_type: SensorType,
                       start: str, end: str) -> ReadingSummary:
    """Ringkas pembacaan dalam rentang [start, end) berformat ISO 8601 dengan zona waktu."""
    if device_id not in DEVICES:
        raise ValueError("Perangkat tersedia: esp32-01 dan esp32-02.")
    first, last = parse_time(start), parse_time(end)
    if not timedelta(0) < last - first <= timedelta(days=7):
        raise ValueError("Rentang harus positif dan maksimal tujuh hari.")
    unit = UNITS[sensor_type]
    with read_connection() as connection:
        count, minimum, maximum, average = connection.execute(
            """
            SELECT count(*), min(value), max(value), avg(value)
            FROM mcp_lab.sensor_readings
            WHERE device_id = %s AND sensor_type = %s AND unit = %s
              AND measured_at >= %s AND measured_at < %s
            """,
            (DEVICES[device_id], sensor_type, unit, first, last),
        ).fetchone()
    return {"status": "ok" if count else "no_data", "device_id": device_id,
            "sensor_type": sensor_type, "unit": unit, "start": first.isoformat(),
            "end": last.isoformat(), "count": count, "minimum": minimum, "maximum": maximum,
            "average": round(average, 3) if average is not None else None}


if __name__ == "__main__":
    mcp.run(transport="stdio")
