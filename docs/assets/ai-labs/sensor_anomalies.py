"""AI Generated, need human review."""

import argparse
import csv
from datetime import datetime
from statistics import median

from sensor_data import read_data


def evaluate(alarms):
    # Event intervals use sample indices. Each index represents five minutes.
    events = {"lonjakan": (5, 5), "macet": (7, 12), "perubahan bertahap": (13, 16)}
    for label, (first, last) in events.items():
        hits = [index for index in alarms if first <= index <= last]
        result = f"{(hits[0] - first) * 5} menit" if hits else "terlewat"
        print(f"  {label}: {result}")
    false_alarms = [
        index for index in alarms
        if all(not first <= index <= last for first, last in events.values())
    ]
    print(f"  Titik alarm di luar kejadian: {len(false_alarms)}")


def main():
    parser = argparse.ArgumentParser(description="Bandingkan alarm pada sampel pH sintetis.")
    parser.add_argument("--evaluate", action="store_true", help="Tampilkan hasil terhadap label.")
    args = parser.parse_args()

    import matplotlib.pyplot as plt

    rows = [row for row in read_data()
            if row["device_id"] == "esp32-01" and row["sensor_type"] == "ph"]
    rows.sort(key=lambda row: datetime.fromisoformat(row["measured_at"]))
    times = [datetime.fromisoformat(row["measured_at"]).strftime("%H:%M") for row in rows]
    values = [float(row["value"]) for row in rows]
    baselines = [None] * 5 + [median(values[index - 5:index])
                              for index in range(5, len(values))]
    fixed = [index for index, value in enumerate(values) if not 5.8 <= value <= 6.8]
    rolling = [index for index, (value, base) in enumerate(zip(values, baselines, strict=True))
               if base is not None and abs(value - base) > 0.75]
    for name, points in (("Ambang tetap", fixed), ("Median bergerak", rolling)):
        print(f"{name}: {', '.join(times[index] for index in points) or 'tanpa alarm'}")
        if args.evaluate:
            evaluate(points)

    with open("alarm-sensor.csv", "w", encoding="utf-8", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(["measured_at", "ph", "rolling_median", "fixed_alarm", "rolling_alarm"])
        for index, row in enumerate(rows):
            writer.writerow([row["measured_at"], values[index], baselines[index],
                             index in fixed, index in rolling])

    figure, axis = plt.subplots(figsize=(10, 4), layout="constrained")
    axis.plot(times, values, marker=".", label="pH terukur")
    axis.axhspan(5.8, 6.8, color="tab:green", alpha=0.09, label="Rentang latihan")
    axis.plot(times, baselines, "--", label="Median 5 sampel sebelumnya")
    axis.scatter([times[i] for i in fixed], [values[i] for i in fixed],
                 marker="o", s=95, facecolors="none", edgecolors="tab:red", label="Alarm tetap")
    axis.scatter([times[i] for i in rolling], [values[i] for i in rolling],
                 marker="x", color="tab:purple", label="Alarm median")
    axis.set(ylabel="pH", xlabel="Waktu UTC",
             title="Deteksi anomali pada pembacaan pH sintetis\nAI Generated, need human review")
    axis.tick_params(axis="x", labelrotation=45)
    axis.legend(loc="upper left")
    figure.savefig("alarm-sensor.png", dpi=150)
    print("Buka alarm-sensor.png dan alarm-sensor.csv untuk membandingkan alarm.")


if __name__ == "__main__":
    main()
