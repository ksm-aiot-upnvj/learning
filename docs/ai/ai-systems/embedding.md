# Embeddings

Embedding adalah representasi data dalam bentuk vector angka. Model embedding mengubah teks, gambar, atau data multimodal menjadi vector yang membawa pola dan makna dari input tersebut.

## Konsep Dasar

Vector menyimpan beberapa nilai numerik pada dimensi tertentu. Data yang memiliki makna atau karakteristik serupa biasanya ditempatkan berdekatan dalam ruang vector, meskipun bentuk teks aslinya berbeda.

Dimensionality menunjukkan jumlah nilai dalam sebuah vector. Dimensi yang lebih besar dapat menyimpan pola yang lebih beragam, tetapi membutuhkan storage dan komputasi yang lebih besar. Kualitas embedding bergantung pada model, bahasa, domain, dan data yang digunakan.

## Embedding Process

Proses embedding menerima input dan menghasilkan vector yang dapat disimpan atau dibandingkan.

```mermaid
flowchart LR
    A[Input teks atau gambar] --> B[Embedding Model]
    B --> C[Vector]
```

Text embedding digunakan untuk kalimat, dokumen, pertanyaan, dan metadata. Image atau multimodal embedding digunakan ketika sistem perlu membandingkan gambar dengan gambar, atau menghubungkan informasi gambar dan teks.

## Semantic Similarity

Semantic similarity mengukur kedekatan makna antara dua vector. Cosine similarity membandingkan arah vector, sedangkan distance mengukur jarak di ruang vector. Nilai dan interpretasinya bergantung pada model serta library yang digunakan.

```mermaid
flowchart LR
    A[Query] --> B[Query vector]
    C[Document] --> D[Document vector]
    B --> E[Similarity atau distance]
    D --> E
```

Similarity dapat digunakan untuk mencari dokumen yang relevan, mencocokkan pertanyaan dengan jawaban, memberi rekomendasi, atau mengelompokkan data. Sistem perlu menguji threshold dengan data nyata karena skor similarity tidak memiliki arti universal di semua model.

**Rujukan riset:** [Reimers & Gurevych, “Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks” (2019), *Proceedings of EMNLP-IJCNLP*](https://aclanthology.org/D19-1410/). Makalah ini membentuk embedding kalimat yang dapat dibandingkan dengan cosine similarity.

## Ikuti perubahan top-2

> **AI Generated, need human review**

Pilih parafrasa atau kode perangkat. Pencarian semantik mengurutkan dokumen menurut cosine similarity, sedangkan pencarian kata kunci di bawah hanya mencocokkan kata atau kode yang ditampilkan. Koordinat sengaja dibuat sederhana untuk memperlihatkan cara menghitung peringkat.

<div class="ai-concept" data-ai-concept="embedding">
  <label for="embedding-query">Kueri</label>
  <select id="embedding-query">
    <option value="paraphrase">Air terasa lebih hangat</option>
    <option value="code">Sensor TEMP-02</option>
  </select>
  <canvas width="310" height="185" role="img" aria-label="Vektor kueri dan tiga dokumen dari satu titik asal"></canvas>
  <div aria-live="polite">
    <strong>Dua hasil semantik teratas</strong><ol></ol>
    <p><strong>Kecocokan kata atau kode</strong> <span data-keyword></span></p>
  </div>
  <noscript>Kueri kode TEMP-02 cocok langsung dengan dokumen yang menyimpan kode TEMP-02.</noscript>
</div>

Jika nama model sensor ditulis persis, pencarian kata kunci dapat mengambil dokumen dengan kode yang sama. Pada pertanyaan yang diparafrasakan, embedding dapat menemukan dokumen relevan meski kata kuncinya berbeda. Bandingkan keduanya pada dokumen yang sama sebelum memilih strategi retrieval.

## Embedding dalam Sistem AI

Pada semantic search, sistem mengubah query menjadi vector lalu mencari vector dokumen yang paling dekat. Similarity matching membandingkan item yang memiliki karakteristik serupa. Recommendation menggunakan kedekatan vector untuk menemukan item yang mungkin sesuai dengan minat pengguna.

Clustering mengelompokkan vector berdasarkan kedekatan tanpa harus menyediakan label untuk setiap data. Retrieval menggunakan hasil pencarian vector sebagai context untuk model generatif.

## Vector Database

Vector database menyimpan vector bersama identifier, isi sumber, dan metadata. Index membantu database mencari nearest neighbor tanpa membandingkan query dengan setiap vector satu per satu.

Metadata dapat berisi device_id, jenis dokumen, waktu, lokasi, atau access level. Filtering membatasi pencarian berdasarkan metadata sebelum atau sesudah similarity search. Isi sumber perlu disimpan agar aplikasi dapat menampilkan context dan sumber asli setelah menemukan vector yang sesuai.

```mermaid
flowchart TD
    A[Dokumen dan metadata] --> B[Embedding model]
    B --> C[Vector database]
    D[Query] --> E[Query embedding]
    E --> C
    C --> F[Dokumen terdekat]
```

## Embedding Model

Pemilihan model perlu mempertimbangkan bahasa, domain, dimensionality, latency, lisensi, dan resource. Model yang cocok untuk teks umum belum tentu paling baik untuk istilah teknis atau data sensor.

Perubahan model embedding dapat membuat vector lama tidak kompatibel secara makna. Ketika mengganti model, sistem biasanya perlu membuat ulang embedding dan menguji kembali threshold similarity.
