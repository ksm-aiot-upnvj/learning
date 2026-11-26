# Hands-on Pengembangan RAG Sederhana

Pada hands-on ini, kita akan membuat sistem RAG sederhana yang dapat menjawab pertanyaan pengguna berdasarkan knowledge base yang telah disiapkan. Sistem ini akan menggunakan LLM untuk menghasilkan jawaban berdasarkan konteks yang diberikan. Meskipun pada contoh ini menggunakan 1 dokumen dan LLM lokal, prinsip yang sama dapat diterapkan pada sistem RAG yang lebih kompleks dengan banyak dokumen dan LLM eksternal.

[Buka notebook RAG Sederhana di Google Colab](https://colab.research.google.com/drive/1WZCNIX31mV20j97pVuPzmvPntbcP8Tdn){ .md-button }

!!! info

    Kalian diperbolehkan untuk menambahkan dokumen lain, menyesuaikan prompt, atau mengubah LLM yang digunakan. Selamat eksplorasi!

Beberapa model yang digunakan adalah:

- LLM: `gpt-oss-120b` via groq atau `gemma-4-E2B-it-qat-mobile-transformers` via library transformer pada Python secara lokal (pemilihan model lokal disesuaikan dengan kemampuan device masing-masing).
- Embedding: `google/embeddinggemma-2` via SentenceTransformers

Tahapan pada hands-on ini akan mengikuti alur RAG yang telah dijelaskan pada [RAG Pipeline](../ai/ai-systems/rag.md#rag-pipeline). Berikut adalah tahapan-tahapan yang akan dilakukan:

- Text Extraction: Mengekstrak konten dari dokumen yang telah disiapkan.
- Chunking: Memecah konten dokumen menjadi potongan-potongan kecil (chunk) agar dapat diproses lebih lanjut.
- Embedding: Mengubah potongan-potongan dokumen menjadi representasi vektor (embedding) yang dapat digunakan untuk pencarian berbasis kesamaan (similarity search).
- Vector Database: Menyimpan embedding ke dalam database vektor seperti FAISS, Milvus, ChromaDB, Qdrant, atau PostgresSQL + pgvector.
- Retrieval: Mengambil informasi yang relevan dari knowledge base berdasarkan query pengguna.
- Augmentation: Menggabungkan query pengguna dengan hasil retrieval untuk membangun konteks yang akan diberikan kepada LLM.
- Generation: LLM menghasilkan jawaban berdasarkan konteks yang diberikan.

Cekidot!

## Instalasi Library

```console
!uv pip install --upgrade docling sentence-transformers groq pymupdf chromadb accelerate transformers -q
```

Penjelasannya:

- `docling`: Library untuk mengekstrak konten dari dokumen.
- `sentence-transformers`: Library untuk membuat embedding dari potongan-potongan dokumen.
- `groq`: Library untuk berinteraksi dengan LLM Groq.
- `pymupdf`: Library untuk membaca file PDF.
- `chromadb`: Library untuk mengelola database vektor.
- `transformers`: Library untuk mengelola model LLM.
- `accelerate`: Library untuk mempercepat proses inferensi model.

Mengapa kita menggunakan `docling` dan `pymupdf`? pada modul ini kita akan melihat perbedaan dari 2 tipe ekstraktor.

## Text Extraction

Text extraction merupakan tahap awal dalam penyediaan data untuk knowledge base LLM. Tahap ini bertujuan mengambil teks atau informasi terstruktur dari berbagai sumber, seperti PDF, dokumen, gambar, audio, video, maupun halaman web.

Beberapa pendekatan yang umum digunakan dalam text extraction antara lain:

- **Parsing**: mengekstrak teks atau data secara langsung dari struktur internal suatu file atau dokumen, seperti PDF text-based, HTML, DOCX, JSON, dan Markdown.
- **OCR (Optical Character Recognition)**: mengenali teks yang terdapat di dalam gambar atau dokumen hasil pemindaian dan mengubahnya menjadi teks digital yang dapat diproses lebih lanjut.
- **AI-Based Extraction**: menggunakan model AI untuk memahami dokumen secara lebih mendalam, termasuk layout, struktur, tabel, hubungan antar-elemen, dan konteks informasi yang terdapat di dalam dokumen.

Atur sumber dokumen:

```python
import os
from pathlib import Path

# unduh dokumen
!curl -L -o "panduan_nutrisi_hidroponik.pdf" \
  "https://drive.google.com/uc?export=download&id=1SkcgeaFHAH71_YDsgkgw0CyFzVgjPKzC"

# Atur path ke direktori dokumen
doc_path = Path("panduan_nutrisi_hidroponik.pdf")
```

Untuk dokumennya dapat kalian unduh dari [sini](https://drive.google.com/file/d/1SkcgeaFHAH71_YDsgkgw0CyFzVgjPKzC/view?usp=sharing)

### Text Extraction dengan PyMuPDF

[PyMuPDF](https://pymupdf.readthedocs.io/en/latest/index.html) merupakan salah satu tools parsing PDF yang ringan dan cepat. Adapun versi ekstraksi untuk LLM yaitu PyMuPDF4LLM.

Membaca file pdf dan cetak total halaman.

```python
import pymupdf

doc = pymupdf.open(doc_path)
print(f"Total Halaman: {len(doc)}\n")
```

Ekstrak langsung:

```python
print("--- [METODE 1: Plain Text Extraction] ---")
for page_num in range(len(doc)):
    page = doc[page_num]
    text = page.get_text("text")
    print(f"=== HALAMAN {page_num + 1} ===")
    print(text[:300] + "...\n")  # Tampilkan 300 karakter pertama
```

Ekstrak per blok teks:

```python
print("--- [METODE 2: Block Text Extraction] ---")
page_1 = doc[0]
blocks = page_1.get_text("blocks")

for i, block in enumerate(blocks):
    # block format: (x0, y0, x1, y1, text, block_no, block_type)
    block_text = block[4].strip()
    block_type = block[6]  # 0 = Teks, 1 = Gambar

    if block_type == 0 and block_text:
        print(f"[Block {i}] (y0: {block[1]:.1f}):")
        print(f"  {block_text[:100]}...\n")
```

Ekstrak tabel:

```python
print("--- [METODE 3: Table Extraction] ---")
for page_num in range(len(doc)):
    page = doc[page_num]
    tabs = page.find_tables()  # Deteksi tabel pada halaman

    if tabs.tables:
        print(f"Ditemukan {len(tabs.tables)} tabel di Halaman {page_num + 1}:")
        for t_idx, table in enumerate(tabs.tables):
            # Konversi tabel ke Pandas DataFrame
            df = table.to_pandas()
            print(f"\n[Tabel {t_idx + 1} Halaman {page_num + 1}]")
            print(df.to_string())

            # Bisa juga diubah langsung ke Markdown untuk RAG Chunk
            print("\nFormat Markdown:")
            print(df.to_markdown(index=False))
            print("-" * 50)

doc.close()
```

### Text Extraction dengan Docling

[Docling](https://docling-project.github.io/docling/) merupakan document processing toolkit yang dapat melakukan document parsing, OCR, dan structural document understanding untuk mengubah berbagai format dokumen menjadi representasi terstruktur yang dapat digunakan dalam pipeline seperti RAG.

```python
from docling.document_converter import DocumentConverter
import logging

converter = DocumentConverter()
doc = converter.convert(doc_path).document

print(doc.export_to_markdown())
```

Kalian bisa bandingkan hasilnya, Docling menghasilkan ekstraksi yang lebih rapi dan terstruktur dibandingkan PyMuPDF. Namun, Docling membutuhkan lebih banyak resource dan waktu untuk memproses dokumen ketimbang PyMuPDF.

## Chunking

Chunking merupakan proses membagi dokumen atau teks menjadi bagian-bagian yang lebih kecil yang disebut **chunk**. Proses ini dilakukan agar setiap bagian informasi dapat diproses, disimpan, dan diambil kembali (*retrieved*) oleh sistem seperti RAG secara lebih efektif.

Beberapa strategi chunking yang umum digunakan antara lain:

1. **Page-Based Chunking**
   Membagi dokumen berdasarkan halaman. Setiap halaman atau kelompok halaman menjadi satu chunk. Teknik ini sederhana dan dapat mempertahankan batas halaman dokumen, tetapi konteks suatu informasi dapat terputus apabila informasi tersebut tersebar di beberapa halaman.

2. **Hierarchy-Based Chunking**
   Membagi dokumen berdasarkan struktur dan hierarki informasinya, seperti heading, subheading, paragraf, dan bagian lainnya. Teknik ini dapat mempertahankan konteks dari struktur dokumen, misalnya informasi pada suatu paragraf tetap dikaitkan dengan heading atau subheading yang menaunginya.

3. **Token-Based Chunking**
   Membagi dokumen berdasarkan jumlah token tertentu. Teknik ini berguna untuk mengontrol ukuran input yang diberikan kepada embedding model maupun LLM. Namun, apabila digunakan tanpa mempertimbangkan struktur dokumen, suatu pembahasan dapat terpotong di tengah konteksnya.

Setiap strategi memiliki kelebihan dan kekurangan yang berbeda sehingga pemilihannya perlu disesuaikan dengan karakteristik dokumen dan kebutuhan sistem.

Untuk dokumen yang memiliki struktur yang jelas, **Hierarchy-Based Chunking dapat menjadi pilihan yang baik** karena struktur hierarki dapat digunakan sebagai bagian dari konteks chunk. Namun, teknik ini bukan selalu pilihan terbaik untuk semua kasus. Dalam praktiknya, beberapa strategi juga dapat **dikombinasikan**, misalnya menggunakan hierarchy-based chunking dengan batas maksimum token untuk menjaga konteks sekaligus mengontrol ukuran chunk.

Pada modul ini kita menggunakan **HybridChunking** yang telah disediakan oleh Docling. HybridChunking menggabungkan beberapa strategi chunking, seperti hierarchy-based dan token-based chunking, untuk menghasilkan potongan-potongan dokumen yang lebih optimal.

```python
from docling.chunking import HybridChunker

chunker = HybridChunker(max_tokens=96) # Set max_tokens sesuai kebutuhan kalian, mempengaruhi ukuran chunk yang dihasilkan
chunks = list(chunker.chunk(doc))

print(f"Total Chunks Dihasilkan: {len(chunks)}\n")

idx = 1
sample_chunk = chunks[idx]
print(f"=== CONTOH CHUNK {idx+1} ===")
print(f"Header: {sample_chunk.meta.headings}")
print(f"Teks Content:\n{sample_chunk.text}\n")
```

Output dari kode di atas akan menampilkan jumlah chunk yang dihasilkan dan contoh salah satu chunk beserta header dan teks kontennya. Keuntungan dari HybridChunking adalah metode ini menyertakan informasi header dari dokumen sebagai bagian dari metadata chunk, sehingga konteks dari setiap chunk dapat lebih mudah dipahami oleh LLM saat proses retrieval dan generation.

Untuk cetak semua chunk:

```python
for i, chunk in enumerate(chunks):
    print(f"=== CHUNK {i+1} ===")
    print(f"Header: {chunk.meta.headings}")
    print(f"Teks Content:\n{chunk.text}\n")
```

## Embedding dengan SentenceTransformers & Vector Database

entence Transformers merupakan salah satu library yang dapat digunakan untuk melakukan embedding pada teks. Embedding merupakan teknik mengubah teks menjadi sebuah vector N dimensi (bergantung pada model embedding yang digunakan). Setelah teks diembedding, maka dapat dilakukan pengukuran untuk mencari teks terdekat dari sebuah prompt.

Setelah teks diembedding maka disimpan ke database khusus yang dapat mendukung format vector. Beberapa database vector adalah sebagai berikut:

- FAISS
- ChromaDB
- QDrant
- ElasticSearch
- PostgreSQL + pgvector

Pada modul ini menggunakan ChromaDB. Selain untuk menyimpan data dalam bentuk vector, database tersebut juga bisa melakukan operasi pencarian dokumen berbasis kemiripan.

Menyiapkan model embedding:

```python
from sentence_transformers import SentenceTransformer, util

model_embedding = SentenceTransformer("google/embeddinggemma-2", config_kwargs={"vision_config": None, "audio_config": None})

# Berdasarkan https://ai.google.dev/gemma/docs/embeddinggemma/model_card_2#1_task_instruction_prefixes
DOC_PREFIX   = "task: search result | text: "
QUERY_PREFIX = "task: search query | text: "
TITLE_NONE   = "title: none | text: "
```

Karena model embedding Gemma2 dilatih menggunakan prefix khusus, maka untuk meningkatkan kualitas embedding, kita perlu menambahkan prefix pada setiap teks yang akan diembedding. Untuk dokumen, kita menggunakan `DOC_PREFIX`, sedangkan untuk query pengguna, kita menggunakan `QUERY_PREFIX`. Untuk mempermudah kita buat fungsi bantuan untuk menambahkan prefix pada teks.

```python
def build_doc_text(chunk) -> str:
    """
    Format dokumen sesuai rekomendasi EmbeddingGemma 2:
      - Ada judul    : title: {title} | text: {content}
      - Tidak ada    : title: none | text: {content}
    Lalu ditambah prefix task: search result
    """
    # Ambil judul dari metadata heading (jika ada)
    headings = getattr(chunk.meta, "headings", None)
    title = headings[0] if headings else None

    content = chunk.text.strip()

    if title:
        body = f"title: {title.strip()} | text: {content}"
    else:
        body = f"title: none | text: {content}"

    return DOC_PREFIX + body

def build_query_text(query: str) -> str:
    """Query pakai prefix search query, tanpa title."""
    return QUERY_PREFIX + query.strip()
```

Menyiapkan database vector dan custom embedding menyesuaikan model yang digunakan:

```python
import chromadb
chroma_client = chromadb.PersistentClient(path="./chroma_db")

collection = chroma_client.get_or_create_collection(
    name="nutrisi_hidroponik",
    metadata={"hnsw:space": "cosine"} # menggunakan cosine similarity untuk pencarian berbasis kemiripan
)
```

Setelah database vector siap, kita dapat menyimpan chunk ke dalam database tersebut. Agar setiap chunk dapat diidentifikasi, kita dapat menambahkan metadata seperti `chunk_id`, `source`, dan `headings` dari dokumen.

```python
documents = [] # teks asli (untuk display hasil retrieval)
metadatas = []
ids = []
embeddings= []

for idx, chunk in enumerate(chunks):
    # --- teks asli untuk disimpan ---
    documents.append(chunk.text)

    # --- metadata ---
    meta = {
        "source":   chunk.meta.origin.filename,
        "headings": chunk.meta.headings,
        "chunk_id": f"chunk_{idx}",
    }
    metadatas.append(meta)
    ids.append(f"doc_chunk_{idx}")

    # --- teks dengan prefix untuk embedding ---
    doc_with_prefix = build_doc_text(chunk)
    embeddings.append(doc_with_prefix)

# Encode semua dokumen sekaligus (batch, lebih efisien)
doc_embeddings = model_embedding.encode(
    embeddings,
    batch_size=32,
    normalize_embeddings=True,
    show_progress_bar=True,
).tolist()


collection.add(
    documents=documents,          # teks asli untuk display
    embeddings=doc_embeddings,    # vektor dari teks ber-prefix
    metadatas=metadatas,
    ids=ids,
)

print(f"Berhasil menyimpan {len(ids)} chunk ke ChromaDB.")
```

Setelah chunk tersimpan, kita dapat masuk ke fase retrieval untuk mengambil informasi yang relevan dari knowledge base berdasarkan query pengguna.

## [Retrieval](../ai/ai-systems/rag.md#retrieval)

```python
query_text = "tanaman pakcoy butuh target PH dan target PPM berapa"

query_with_prefix = build_query_text(query_text)
query_embedding = model_embedding.encode(
    [query_with_prefix],
    normalize_embeddings=True,
).tolist()

results = collection.query(
    query_embeddings=query_embedding,
    n_results=3,
)

print(f"\n[QUERY]: {query_text}\n")
for i, (doc_text, meta, dist) in enumerate(zip(
        results["documents"][0],
        results["metadatas"][0],
        results["distances"][0])):
    print(f"=== HASIL RETRIEVAL {i+1} ===")
    print(f"Distance : {dist:.4f}")
    print(f"Metadata : {meta}")
    print(f"Isi Teks :\n{doc_text}\n")
```

Jika kalian ingin menampilkan nilai kemiripan (similarity score) kalian dapat menambahkan kode berikut:

```python
results = collection.query(
    query_embeddings=query_embedding,
    n_results=5,
)

for i, (doc, meta, distance) in enumerate(
    zip(
        results["documents"][0],
        results["metadatas"][0],
        results["distances"][0]
    )
):
    print(f"=== HASIL RETRIEVAL {i+1} ===")
    print(f"Distance : {distance:.4f}")
    print(f"Metadata : {meta}")
    print(f"Isi Teks :\n{doc}\n")
```

## [Augmentation](../ai/ai-systems/rag.md#augmentation)

fase augmentation bertujuan untuk membangun konteks yang akan diberikan kepada LLM.

```python
def augmented(query, retrieved_docs):
    context = "\n\n".join(
        f"[{d['chunk_id']}]\n{d['text']}"
        for d in retrieved_docs
    )
    # Augmented
    prompt = (
        "Konteks:\n"
        f"{context}\n\n"
        f"Pertanyaan: {query}\n\n"
    )

    return prompt

```

## [Generation](../ai/ai-systems/rag.md#generation)

Pada tahap ini, LLM akan menghasilkan jawaban berdasarkan konteks yang telah dibangun pada fase augmentation. Kita akan menggunakan model LLM yang telah disiapkan sebelumnya untuk menghasilkan jawaban.

Terdapat dua cara untuk melakukan generation, yaitu menggunakan LLM lokal (misalnya menggunakan llama-server) atau menggunakan LLM eksternal (misalnya menggunakan API Groq, OpenAI, Gemini, Antropic, atau provider LLM lainnya). Pada contoh ini, kita akan menggunakan groq dan LLM lokal via llama-server.

Sebelum masuk ke tahap generation, kita buat akun dan API key di [Groq](https://groq.com/) dengan cara berikut:

1. Kunjungi [Groq](https://groq.com/) dan klik start building.
![groq](../images/groq.png)
2. Setelah halaman groq console terbuka, buat akun baru atau login jika sudah memiliki akun.
![groq-console](../images/groq-console.png)
3. Setelah berhasil login, klik menu API Keys dari navbar
![groq-console-navbar](../images/groq-console-navbar.png)
4. Klik tombol "Create API Key" untuk membuat API key baru. Buat nama API key dan atur expiration sesuai kebutuhan kalian. Setelah itu klik tombol "Submit". Dan jangan lupa untuk menyimpan API key yang telah dibuat karena hanya ditampilkan sekali.
![groq-api-keys-view](../images/groq-api-keys-view.png)

Jika semua tahapan di atas sudah dilakukan, kalian akan mendapatkan API key yang digunakan untuk menggunakan layanan Groq. Oke, lanjut ke tahap implementasi fungsi retrieval, augmentation, dan generation.

```python
# Membangun fungsi retrieval
# ---------- Retrieval ----------
def retrieve(query, top_k=3):
    # 1. Tambahkan prefix query
    prefixed_query = QUERY_PREFIX + query.strip()

    # 2. Embed manual (bukan query_texts)
    query_embedding = model_embedding.encode(
        [prefixed_query],
        normalize_embeddings=True,
    ).tolist()

    # 3. Query pakai query_embeddings
    results = collection.query(
        query_embeddings=query_embedding,
        n_results=top_k,
        include=["documents", "metadatas", "distances"],
    )

    retrieved = []
    for doc, meta, distance in zip(
        results["documents"][0],
        results["metadatas"][0],
        results["distances"][0],
    ):
        retrieved.append({
            "text":     doc,
            "chunk_id": meta["chunk_id"],
            "source":   meta["source"],
            "distance": distance,
        })
    return retrieved
```

Kemudian fungsi generate yang menggunakan groq:

!!! info

    Pastikan kalian sudah menyimpan API key Groq di Google Colab dengan cara klik menu "Secrets" yang bergambar kunci. Kemudian klik tombol "Add new secret" dan masukkan nama `GROQ_API_KEY` dan value API key yang telah kalian buat sebelumnya.

```python
from groq import Groq
from google.colab import userdata

client_groq = Groq(api_key=userdata.get("GROQ_API_KEY"))

SYSTEM_PROMPT = """Kamu adalah Nexo, Asisten Bot KSM AIoT.

Tugasmu adalah menjawab pertanyaan berdasarkan konteks yang diberikan dengan kalimatmu sendiri secara alami dan mudah dipahami.

Aturan:
1. Gunakan HANYA informasi yang tersedia dalam konteks.
2. Jangan menyalin mentah-mentah kalimat dari konteks. Parafrasekan dengan tetap mempertahankan makna.
3. Semua fakta, angka, satuan, dan parameter teknis HARUS sesuai dengan konteks. Jangan mengarang atau menambahkan informasi dari luar konteks.
4. Jika informasi yang dibutuhkan tidak tersedia dalam konteks, katakan:
   "Informasi tidak ditemukan dalam konteks."
5. Setiap fakta atau informasi yang berasal dari konteks HARUS disertai sitasi menggunakan chunk_id sumbernya, misalnya [chunk_14].
6. Jangan membuat atau mengubah chunk_id.
7. Jika beberapa informasi berasal dari chunk yang sama, gunakan satu sitasi [chunk_id] pada akhir klausa atau kalimat yang relevan.
8. Jangan memberikan sitasi pada informasi yang tidak didukung oleh konteks.
9. Jawab dalam Bahasa Indonesia."""

def generate_groq_answer(prompt):
    response = client_groq.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        temperature=0.1,
        max_completion_tokens=1024,
    )
    return response.choices[0].message.content.strip()

# Menggabungkan retrieval, augmentation, dan generation
def rag_groq(query, top_k=3):
    retrieved = retrieve(query, top_k=top_k)
    query_context = augmented(query, retrieved)
    answer = generate_groq_answer(query_context)   # tanpa await
    return retrieved, answer

# Contoh penggunaan
query = "tanaman pakcoy butuh target PH dan target PPM berapa"
retrieved, answer = rag_groq(query, top_k=3)

print("Retrieved: ")
for d in retrieved:
    print(f"  - {d}")
print("Answer: ", answer)
```

Jika kalian ingin menggunakan LLM lokal via transformers, kalian dapat mengikuti kode berikut:

```python
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig

model_id = "google/gemma-4-E2B-it-qat-mobile-transformers" # atau versi QAT BF16

tokenizer = AutoTokenizer.from_pretrained(model_id)
model_llm = AutoModelForCausalLM.from_pretrained(
    model_id,
    device_map="auto",
    torch_dtype=torch.bfloat16
)

def generate(prompt: str) -> str:
    """
    Menghasilkan jawaban menggunakan model Gemma lokal.
    `prompt` diasumsikan sudah berisi SYSTEM_PROMPT + konteks RAG.
    """
    # Gemma tidak mendukung peran 'system'; gabungkan semuanya ke peran 'user'
    # dan gunakan chat template dari tokenizer
    messages = [{"role": "user", "content": f"{SYSTEM_PROMPT}\n\n{prompt}"}]

    inputs = tokenizer.apply_chat_template(
        messages,
        add_generation_prompt=True,
        tokenize=True,
        return_dict=True,
        return_tensors="pt",
    ).to(model_llm.device)

    outputs = model_llm.generate(
        **inputs,
        max_new_tokens=800,
        temperature=0.1,
        do_sample=True,
        pad_token_id=tokenizer.eos_token_id,
    )

    # Hanya decode token yang baru dihasilkan (abaikan prompt)
    generated_ids = outputs[0][inputs["input_ids"].shape[-1]:]
    answer = tokenizer.decode(generated_ids, skip_special_tokens=True)

    return answer.strip()

def rag(query, top_k=3):
    retrieved = retrieve(query, top_k=top_k)
    query_context = augmented(query, retrieved)
    answer = generate(query_context)
    return retrieved, answer

# Contoh penggunaan
query = "tanaman pakcoy butuh target PH dan target PPM berapa"
retrieved, answer = rag(query, top_k=3)
print("Retrieved: ")
for d in retrieved:
    print(f"  - {d}")
print("Answer: ", answer)
```
