# Lab Workflow RAG Interaktif

Klik node untuk melihat input, proses, dan output. Jalankan manual atau putar alur otomatis.

<div class="ai-tour" data-ai-tour="rag">
  <noscript>RAG mengindeks dokumen ke vector store, mencari potongan berdasarkan query, lalu mengirim konteks terpilih ke model.</noscript>
</div>

Vektor, skor, dan jawaban pada workflow ini adalah data ilustrasi. Untuk konsep pipeline dan retrieval, baca [materi RAG](../ai/ai-systems/rag.md). Untuk praktik memakai model embedding dan generator, ikuti [RAG Sederhana](../hands-on/rag-simple.md).

## Dari halaman ke jawaban

> **AI Generated, need human review**

Pilih satu hasil OCR pada contoh ilustratif ini. Bandingkan angka di halaman dengan angka yang masuk ke indeks dan muncul pada jawaban. Metadata halaman tetap sama, sehingga sitasi dapat membuka sumber yang tepat meski transkripsinya keliru.

<div class="ai-concept" data-ai-concept="ocr">
  <label for="ocr-result">Hasil yang disimpan</label>
  <select id="ocr-result">
    <option value="clean">Angka terbaca lengkap</option>
    <option value="error">Angka desimal terlewat</option>
  </select>
  <div class="ai-concept-panels" data-ocr-result aria-live="polite">
    <div><strong>Halaman dan kotak deteksi</strong>
      <div class="ai-ocr-paper">Manual PS-01<br>Tekanan referensi: <mark>0,5 bar</mark><br>Halaman 1</div>
    </div>
    <div><strong>Teks OCR</strong><p data-text>Tekanan referensi: 0,5 bar</p></div>
    <div><strong>Chunk berindeks</strong><p data-chunk>manual-ps01 · hlm. 1 · PS-01: 0,5 bar</p></div>
    <div><strong>Jawaban dengan sitasi</strong><p data-answer>Tekanan referensi 0,5 bar (hlm. 1).</p></div>
  </div>
  <noscript>Jika 0,5 bar terbaca 5 bar, kesalahan ikut masuk ke chunk dan jawaban.</noscript>
</div>

Gunakan [praktik OCR](../ai/ai-systems/ocr.md#praktik-membandingkan-tiga-input) untuk melihat kotak deteksi yang benar-benar dihasilkan mesin OCR. Script membuat manual yang sama sebagai PDF digital, scan, dan gambar miring.
