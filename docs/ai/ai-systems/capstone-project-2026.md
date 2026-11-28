# Proyek Akhir: Sistem AI (RAG & MCP)

Deadline: 2 Minggu (12 Desember 2026)

- Referensi: [Modul Dokumentasi AI](https://ksm-aiot-upnvj.github.io/learning/ai/ai-systems/overview/)
- Referensi RAG: [TabRAG](https://github.com/Dzoel31/TabRAG)
- Referensi MCP: [Hands-on MCP](https://ksm-aiot-upnvj.github.io/learning/hands-on/mcp-sensor/)

Kalian bisa menjalankan dan mempelajari referensi RAG dan MCP di laptop masing-masing.

## Tujuan

Buat aplikasi AI sederhana yang bisa menjawab pertanyaan tentang suatu tempat atau kegiatan dengan bantuan konteks nyata. Konteksnya boleh berupa dokumen, data terstruktur (via MCP), atau keduanya.

Pilih **satu tema** dari contoh di bawah, atau ajukan tema sendiri yang masih berkaitan dengan AIoT.

## Pilih jalur utama

Setiap proyek wajib memiliki UI chat, memakai LLM API, dan memilih salah satu jalur berikut sebagai fitur utamanya.

### RAG

Gunakan RAG jika jawaban perlu berlandaskan dokumen, misalnya panduan, SOP, atau FAQ.

Contoh hasil yang diharapkan:

- AI menjawab berdasarkan dokumen yang disediakan.
- Jawaban menyebutkan dokumen atau bagian sumbernya.
- Jika informasi tidak ditemukan, AI mengatakannya dengan jelas.

Model Embedding: `google/embeddinggemma-2`, `sentence-transformers/all-MiniLM-L6-v2`, atau model embedding lain yang tersedia di Hugging Face. <br>
MTEB: https://mteb-leaderboard.hf.space/benchmark/MTEB-Multilingual-v2.

Pastikan laptop kalian bisa menjalankan model embedding yang dipilih.

Model LLM via Groq: `gpt-oss-120b`, `gpt-oss-20b`. Diperbolehkan untuk menggunakan model LLM dari inference provider lain. Jika ada yang ingin menjalankan secara lokal, pastikan laptop memiliki sumber daya yang cukup.<br>
Database: Dibebaskan boleh menggunakan `ChromaDB`, `PostgreSQL`, `FAISS`, `Qdrant`, atau database lain yang mendukung vektor embedding.

### MCP

Gunakan MCP jika jawaban perlu mengambil data terstruktur, misalnya inventaris, catatan sensor, atau pemakaian energi. Kalian bisa mengambil data dari internet atau menyiapkan data dummy sendiri jika tidak ada sumber yang tersedia.

Contoh hasil yang diharapkan:

- MCP Server menyediakan setidaknya satu tool yang relevan.
- Tool membaca data dari sumber yang jelas, seperti PostgreSQL, SQLite, atau CSV.
- UI chat dapat meminta AI memanggil tool dan menjelaskan hasilnya.
- Jika data kosong atau sumber tidak tersedia, aplikasi memberi pesan yang bisa dipahami.

### Jalur gabungan — RAG dan MCP

Gabungkan RAG dan MCP sebagai tantangan tambahan dalam satu alur aplikasi. Pisahkan perannya dengan jelas: **MCP** mengambil data terstruktur atau kondisi terbaru, sedangkan **RAG** mencari rujukan pengetahuan di dalam dokumen.

Contoh skenario (tema *Kebun Pintar*):

- **MCP:** Membaca data kondisi sensor tanaman (suhu, kelembapan, jadwal penyiraman).
- **RAG:** Menyediakan panduan atau tips perawatan tanaman dari dokumen.

Untuk mengatur alur pemanggilannya, kalian bisa memilih salah satu pola orkestrasi berikut:

- **LLM as Router / Tool Calling:** Bungkus pencarian dokumen RAG sebagai sebuah *tool* (misalnya `search_docs`) yang sejajar dengan *tool* dari MCP, lalu biarkan model LLM memutuskan apakah perlu memanggil RAG saja, MCP saja, atau keduanya sekaligus sebelum menjawab.
- **RAG otomatis, MCP sesuai kebutuhan:** Setiap pertanyaan otomatis mencari konteks ke *vector database* (RAG) sekaligus, sedangkan *tool* MCP akan dipanggil LLM bila diperlukan.

## Pilihan tema

| Tema | Ide proyek | Contoh RAG | Contoh MCP |
|---|---|---|---|
| **Kualitas Udara Ruang Kelas** | Asisten kondisi ruang belajar | Panduan kenyamanan ruang dan ventilasi | Pembacaan suhu, kelembapan, atau CO₂ |
| **Manajemen Alat Laboratorium** | Asisten alat dan fasilitas lab | Manual, SOP pemakaian, dan troubleshooting | Inventaris dan status alat |
| **Pemantauan Energi** | Asisten pemantau energi gedung | Panduan penghematan listrik | Ringkasan pemakaian energi per ruangan |
| **Pengelolaan & Pemilahan Sampah** | Asisten pemilahan dan pengangkutan sampah | Panduan jenis sampah dan jadwal | Catatan kapasitas tempat sampah atau pengangkutan |
| **Stasiun Cuaca Lokal** | Asisten stasiun cuaca lokal | Panduan membaca dan merawat sensor | Data cuaca terbaru dan tren sederhana |
| **Perawatan & Penyiraman Tanaman** | Asisten perawatan tanaman | Panduan perawatan tanaman | Kondisi sensor atau jadwal penyiraman |

## Batas cakupan

Jaga proyek tetap kecil dan selesai. Pilih satu pengguna, satu masalah utama, satu sumber konteks, dan satu alur yang bisa didemokan. Fokus pada jawaban yang benar sumbernya dan aplikasi yang bisa dijalankan ulang. Fine-tuning tidak wajib menjadi bagian aplikasi akhir. Jika kalian mencoba fine-tuning, bisa dicatat sebagai eksperimen tambahan.

## Demo yang perlu disiapkan

Siapkan tiga skenario untuk demonstrasi:

1. Pertanyaan normal dengan bukti: fitur utama berhasil menjawab sekaligus menampilkan sumber dokumen (RAG) atau hasil pemanggilan tool (MCP) yang dipakai.
2. Informasi tidak tersedia: pertanyaan masih sesuai tema, tetapi data atau dokumennya tidak ada, dan aplikasi mampu mengakuinya tanpa mengarang jawaban.
3. Kasus negatif (*out-of-scope*): pengguna memberi pertanyaan di luar topik aplikasi atau input yang tidak valid, lalu aplikasi menolak dengan sopan sesuai batasan perannya.

Penggunaan AI diperbolehkan; mentee tetap perlu memahami dan memeriksa hasil yang dikumpulkan.

## Pengumpulan

Kumpulkan proyek di repo GitHub pribadi masing-masing. Jika repo bersifat privat, undang mentor/reviewer sebagai collaborator. Cantumkan link repo yang akan dinilai ke grup pembelajaran.

Repo harus berisi:

- README dengan masalah yang dipilih, cara setup, cara menjalankan, dan contoh pertanyaan.
- Kode serta data contoh yang diperlukan untuk menjalankan demo.
- `.env.example` yang mencantumkan nama variabel tanpa secret.
- `.gitignore` yang mengecualikan `.env` dan file rahasia.

Jangan mengunggah API key, password, atau kredensial lain ke GitHub.

## Checklist sebelum mengumpulkan

- [ ] Aplikasi bisa dijalankan mengikuti README.
- [ ] UI chat terhubung ke LLM API.
- [ ] Fitur RAG atau MCP yang dipilih benar-benar digunakan dalam alur jawaban.
- [ ] Saya bisa menunjukkan bukti sumber jawaban.
- [ ] Saya mencoba kasus ketika informasi atau data tidak tersedia.
- [ ] Tidak ada API key atau password di repo.
- [ ] Saya memahami cara kerja aplikasi yang saya buat.

Jika bingung dan butuh bantuan, bisa tanyakan ke mentor yaa!
