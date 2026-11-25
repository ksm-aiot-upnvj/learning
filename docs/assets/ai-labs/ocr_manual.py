"""AI Generated, need human review."""

import csv
import io
import shutil
import subprocess
from pathlib import Path

import pymupdf
from PIL import Image, ImageDraw

OUTPUT = Path("hasil-ocr")
REFERENCE = (
    "Manual sensor tekanan",
    "Model: PS-01",
    "Tekanan referensi: 0,5 bar",
    "Catat hasil pada lembar pemeriksaan.",
)


def normalize(text):
    return " ".join(text.split())


def character_error_rate(reference, output):
    previous = list(range(len(output) + 1))
    for index, expected in enumerate(reference, start=1):
        current = [index]
        for column, actual in enumerate(output, start=1):
            current.append(min(previous[column] + 1, current[-1] + 1,
                               previous[column - 1] + (expected != actual)))
        previous = current
    return previous[-1] / len(reference)


def recognize(path):
    result = subprocess.run(
        ["tesseract", str(path), "stdout", "-l", "eng", "--psm", "6", "tsv"],
        check=True, capture_output=True, encoding="utf-8",
    )
    records = csv.DictReader(io.StringIO(result.stdout), delimiter="\t", quoting=csv.QUOTE_NONE)
    words = []
    with Image.open(path) as original:
        overlay = original.convert("RGB")
    draw = ImageDraw.Draw(overlay)
    for row in records:
        if row["level"] != "5" or not row["text"].strip():
            continue
        words.append(row["text"])
        x, y, width, height = (int(row[field]) for field in ("left", "top", "width", "height"))
        draw.rectangle((x, y, x + width, y + height), outline="#ac291d", width=2)
    overlay.save(OUTPUT / f"{path.stem}-kotak.png")
    return " ".join(words)


def main():
    if shutil.which("tesseract") is None:
        raise SystemExit("Pasang Tesseract OCR dengan data bahasa eng dan tambahkan ke PATH.")
    OUTPUT.mkdir(exist_ok=True)
    with pymupdf.open() as digital:
        page = digital.new_page(width=420, height=240)
        for index, line in enumerate(REFERENCE):
            page.insert_text((36, 55 + index * 30), line, fontsize=17)
        digital.save(OUTPUT / "manual-digital.pdf")
        native_text = page.get_text(sort=True)
        raster = page.get_pixmap(dpi=180, alpha=False).tobytes("png")

    with pymupdf.open() as scan:
        page = scan.new_page(width=420, height=240)
        page.insert_image(page.rect, stream=raster)
        scan.save(OUTPUT / "manual-scan.pdf")
        assert not page.get_text().strip()
        page.get_pixmap(dpi=180, alpha=False).save(OUTPUT / "manual-scan.png")

    with Image.open(io.BytesIO(raster)) as image:
        image.rotate(12, resample=Image.Resampling.BICUBIC, expand=True,
                     fillcolor="white").save(OUTPUT / "manual-miring.png")

    expected = normalize(" ".join(REFERENCE))
    (OUTPUT / "referensi.txt").write_text(expected + "\n", encoding="utf-8")
    outcomes = (
        ("manual-digital", native_text),
        ("manual-scan", recognize(OUTPUT / "manual-scan.png")),
        ("manual-miring", recognize(OUTPUT / "manual-miring.png")),
    )
    for stem, observed in outcomes:
        actual = normalize(observed)
        (OUTPUT / f"{stem}.txt").write_text(actual + "\n", encoding="utf-8")
        print(f"{stem}, halaman 1: CER {character_error_rate(expected, actual):.1%}, "
              f"nilai rujukan cocok: {'0,5 bar' in actual}")


if __name__ == "__main__":
    main()
