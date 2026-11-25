# OCR dan Pemrosesan Dokumen

!!! note "AI Generated, need human review"

    Materi dan script latihan menunggu tinjauan manusia.

## Kapan perlu OCR?

Manual sensor bisa terlihat sama di layar meski isi berkasnya berbeda. Pada PDF digital, teks biasanya dapat disalin karena berkas menyimpan karakter dan posisinya. Pada scan atau foto, huruf menjadi bagian dari gambar sehingga kita perlu membaca teks dari piksel.

Proses itu disebut *optical character recognition* atau OCR. Sistem mencari area yang berisi tulisan, lalu mengenali karakter dalam area tersebut. Jika tulisan miring, kabur, atau bertumpuk dengan garis tabel, hasil bacanya bisa berubah.

## Dari teks ke dokumen terstruktur

Mengenali kata saja belum cukup untuk membaca tabel. Jika sebuah baris berisi `PS-01` dan `0,5 bar`, ekstraksi perlu mempertahankan kolom dan urutan baca agar batas tekanan tetap terkait dengan sensor yang tepat.

Saat dokumen masuk ke RAG, simpan identitas dokumen dan nomor halaman bersama setiap potongan teks atau *chunk*. Informasi itu memberi jalan kembali ke halaman sumber ketika jawaban perlu diperiksa. Dokumen campuran dapat memakai parser untuk halaman berteks dan OCR untuk halaman yang hanya berisi gambar.

## Praktik membandingkan tiga input

Script membuat satu manual sintetis dalam bentuk PDF digital, PDF scan, dan simulasi foto miring. PyMuPDF membaca lapisan teks atau merender halaman menjadi gambar, lalu Tesseract membaca gambar dan mengembalikan posisi kata. [PyMuPDF](https://pymupdf.readthedocs.io/en/latest/page.html) · [Tesseract TSV](https://tesseract-ocr.github.io/tessdoc/Command-Line-Usage.html#tsv-output)

1. Siapkan folder latihan kosong.
2. Simpan [ocr_manual.py](../../assets/ai-labs/ocr_manual.py) ke folder latihan.
3. Pasang [Tesseract](https://tesseract-ocr.github.io/tessdoc/Installation) dengan data bahasa `eng`.
4. Buka PowerShell tanpa profil di folder latihan.
5. Periksa daftar bahasa Tesseract.

    ```powershell
    tesseract --list-langs
    ```

6. Jika `eng` tersedia, buat proyek Python.

    ```powershell
    uv init --bare
    ```

7. Pasang dependensi Python.

    ```powershell
    uv add pymupdf pillow
    ```

8. Jalankan script ekstraksi.

    ```powershell
    uv run python ocr_manual.py
    ```

Folder `hasil-ocr` berisi berkas sumber, teks yang terbaca, dan gambar dengan kotak deteksi. Bandingkan teks setiap keluaran dengan `referensi.txt`. Hasil PDF digital diharapkan cocok, sedangkan hasil gambar bergantung pada versi mesin, pilihan bahasa, dan kualitas input.

## Periksa angka sebelum indexing

*Character error rate* (CER) membagi jumlah perubahan karakter yang diperlukan dengan panjang teks rujukan. Jika `0,5 bar` terbaca `5 bar`, hanya dua karakter yang hilang, tetapi angka berubah sepuluh kali lipat. Karena itu, periksa nilai dan satuan yang dipakai pada jawaban secara terpisah. [Metrik OCR-D](https://ocr-d.de/en/spec/ocrd_eval.html)

Bandingkan `manual-digital.txt` dan `manual-miring.txt`, lalu pilih salah satu untuk latihan RAG. Catat `document_id` dan `page=1` pada setiap chunk. Jika angka rujukan berbeda, cocokkan dengan halaman asli sebelum mengindeks hasil ekstraksi.

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-clipboard-check:</span> **Evaluasi OCR di pipeline RAG** <span class="ai-practice-description">Gunakan teks hasil OCR untuk memeriksa apakah angka yang terbaca salah ikut muncul di jawaban.</span>](rag.md#evaluasi-dari-halaman-sampai-jawaban){ .ai-practice-start }

[<span class="ai-practice-icon" aria-hidden="true">:lucide-workflow:</span> **Simulasi OCR ke jawaban** <span class="ai-practice-description">Amati perubahan pada teks, potongan dokumen, dan jawaban saat tanda desimal terlewat.</span>](../../labs/rag-workflow.md#dari-halaman-ke-jawaban)

</div>
