"""AI Generated, need human review."""

import csv
from datetime import datetime, timedelta, timezone
from pathlib import Path
from uuid import UUID

START = datetime(2026, 11, 20, tzinfo=timezone.utc)
AS_OF = START + timedelta(minutes=85)
DEVICES = {
    "esp32-01": UUID("80b6352a-53fd-4d55-8d84-6cf176613401"),
    "esp32-02": UUID("80b6352a-53fd-4d55-8d84-6cf176613402"),
}
UNITS = {"ph": "pH", "temperature": "°C"}
DATA = Path(__file__).with_name("sensor_readings.csv")


def generate_csv():
    stable = (6.1, 6.2, 6.3, 6.2)
    count = 0
    with DATA.open("w", encoding="utf-8", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(["device_id", "sensor_type", "measured_at", "value", "unit"])
        for index in range(17):
            measured_at = START + timedelta(minutes=index * 5)
            ph = stable[index % len(stable)]
            if index == 5:
                ph = 7.4
            elif 7 <= index <= 12:
                ph = 6.2
            elif index >= 13:
                ph = (6.4, 6.6, 6.8, 7.0)[index - 13]

            for device in DEVICES:
                if device == "esp32-02" and index > 11:
                    continue
                values = {"ph": ph if device == "esp32-01" else stable[index % 4],
                          "temperature": 25 + index % 4 / 2}
                for sensor_type, value in values.items():
                    writer.writerow([device, sensor_type, measured_at.isoformat(),
                                     value, UNITS[sensor_type]])
                    count += 1
    print(f"{count} pembacaan ditulis ke {DATA.name}.")


def read_data():
    with DATA.open(encoding="utf-8", newline="") as file:
        return list(csv.DictReader(file))


if __name__ == "__main__":
    generate_csv()
