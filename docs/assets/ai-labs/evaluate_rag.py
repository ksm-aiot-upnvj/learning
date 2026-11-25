"""AI Generated, need human review."""

import argparse
import re
from pathlib import Path


def words(text):
    return set(re.findall(r"\w+", text.lower()))


def main():
    parser = argparse.ArgumentParser(description="Periksa ekstraksi, retrieval, dan bukti jawaban.")
    parser.add_argument("extracted_text", type=Path)
    args = parser.parse_args()

    chunks = [
        ("manual-ps01", 1, args.extracted_text.read_text(encoding="utf-8").strip(), "PS-01"),
        ("manual-ts02", 1, "Model TS-02. Catat suhu dalam derajat Celsius.", "TS-02"),
    ]
    questions = [
        ("Berapa tekanan referensi PS-01?", "manual-ps01", "0,5 bar"),
        ("Berapa tenggat garansi PS-01?", None, None),
    ]
    pressure = re.compile(r"Tekanan\s+referensi:\s*(\d+(?:[.,]\d+)?\s+bar)\b", re.I)
    for question, expected_doc, expected_value in questions:
        print(question)
        scores = words(question)
        document, page, content, _ = max(
            chunks, key=lambda chunk: len(scores & words(chunk[2] + " " + chunk[3]))
        )
        print(f"  top-1: {document}, hlm. {page}")

        # Contoh penjawab ekstraktif dengan satu bidang yang didukung.
        match = pressure.search(content) if "tekanan" in scores else None
        if match:
            value = match.group(1)
            print(f"  jawaban: {value} ({document}, hlm. {page})")
        else:
            value = None
            print("  jawaban: informasi tidak tersedia dalam potongan.")

        if expected_doc:
            print(f"  ekstraksi angka: {'cocok' if expected_value in chunks[0][2] else 'periksa halaman'}")
            print(f"  retrieval: {'hit' if document == expected_doc else 'miss'}")
            print(f"  jawaban terhadap sumber asli: {'cocok' if value == expected_value else 'periksa'}")
        else:
            print(f"  uji di luar cakupan: {'lulus' if value is None else 'periksa'}")


if __name__ == "__main__":
    main()
