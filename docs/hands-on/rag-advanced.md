# Hands-on Pengembangan RAG Lanjutan

Pada modul RAG ini, kita akan mempelajari penerapan RAG tingkat lanjut yang meliputi:

- Ensemble Retriever dan Reranker: Menambahkan pencarian berbasis keyword (BM25) dan pengurutan ulang hasil retrieval.
- HyDE (Hypothetical Document Embeddings): Menambahkan tahapan agar LLM membuat sebuah "hipotesis" atau jawaban singkat yand digunakan untuk mencari dokumen yang relevan.
- Web Search: Mencari informasi dari internet ketika dokumen berada di bawah threshold. Tools yang digunakan adalah DuckDuckGo Search

Pada modul ini juga memuat beberapa eksperimen pada fase retrieval untuk membandingkan satu teknik dengan teknik yang lain.

[Buka notebook RAG Lanjutan di Google Colab](https://colab.research.google.com/drive/1heAkQ1-nkqvbTYblwkGDx6ZlXYSZSEQc){ .md-button }

Library tambahaan yang digunakan adalah: `rank-bm25` untuk lexical search dan `ddgs` untuk DuckDuckGo Search (tool yang digunakan untuk web search).

Kalian bisa menggunakan code yang ada di modul RAG sederhana dengan melakukan perubahan pada proses instalasi library dan proses retrieval.

## Instalasi Library Tambahan

```bash
!uv pip install --upgrade docling sentence-transformers groq chromadb rank-bm25 ddgs accelerate transformers -q
```

Sebelum masuk ke proses retrieval, pada modul ini kita akan menggunakan metrik evaluasi Hit@K yang definisinya adalah sebagai berikut:

Hit@k = apakah minimal satu chunk yang diharapkan muncul di Top-k hasil retrieval?

Kita akan menggunakan metrik tersebut untuk membandingkan beberapa kombinasi teknik retrieval yang berbeda. Kombinasi tersebut antara lain:

1. Retrieval berbasis embedding (default) menggunakan `sentence-transformers`
2. BM25 (lexical retrieval) menggunakan `rank-bm25`
3. Retrieval berbasis embedding + BM25
4. Retrieval berbasis embedding + BM25 + Reranker
5. HyDE + Retrieval berbasis embedding
6. HyDE + Retrieval berbasis embedding + BM25
7. HyDE + Retrieval berbasis embedding + BM25 + Reranker

Penasaran dengan hasil eksperimen? Silakan lanjutkan membaca modul ini.

## Membuat Test Query

Sebelum melakukan eksperimen, kita akan membuat beberapa test query yang akan digunakan untuk menguji performa retrieval. Test ini berkaitan dengan isi dari document yang kita miliki, terdapat total 20 query dengan pasangan chunk yang diharapkan muncul di hasil retrieval. 

```python
test_queries = [
    {
        "query": "tanaman pakcoy butuh target pH dan target PPM berapa",
        "expected_chunks": ["chunk_14", "chunk_15"]
    },
    {
        "query": "berapa target EC untuk kangkung",
        "expected_chunks": ["chunk_13", "chunk_14"]
    },
    {
        "query": "berapa rentang pH tomat",
        "expected_chunks": ["chunk_17", "chunk_18"]
    },
    {
        "query": "berapa target PPM dan EC untuk selada hijau",
        "expected_chunks": ["chunk_12"]
    },
    {
        "query": "apa catatan khusus untuk tanaman selada hijau",
        "expected_chunks": ["chunk_13"]
    },
    {
        "query": "berapa target EC dan pH untuk bayam hijau",
        "expected_chunks": ["chunk_16", "chunk_17"]
    },
    {
        "query": "berapa target PPM, EC, dan pH untuk tanaman melon",
        "expected_chunks": ["chunk_18", "chunk_19"]
    },
    {
        "query": "apa catatan khusus untuk tanaman tomat",
        "expected_chunks": ["chunk_18"]
    },
    {
        "query": "bagaimana pengaruh pH di atas 7 terhadap zat besi pada tanaman",
        "expected_chunks": ["chunk_9", "chunk_10"]
    },
    {
        "query": "apa dampak EC terlalu tinggi dan terlalu rendah pada tanaman",
        "expected_chunks": ["chunk_6", "chunk_7"]
    },
    {
        "query": "berapa standar konversi EC ke PPM yang umum dipakai di Indonesia",
        "expected_chunks": ["chunk_26"]
    },
    {
        "query": "bagaimana logika pengisian pompa dosing pada sistem AIoT",
        "expected_chunks": ["chunk_27", "chunk_28"]
    },
    {
        "query": "apa yang dimaksud dengan tip burn pada selada dan bagaimana mencegahnya",
        "expected_chunks": ["chunk_12", "chunk_20", "chunk_21"]
    },
    {
        "query": "kapan EC ditingkatkan pada tanaman melon dan mengapa",
        "expected_chunks": ["chunk_19", "chunk_24", "chunk_25"]
    },
    {
        "query": "apa perbedaan kebutuhan nutrisi sayuran daun dan sayuran buah",
        "expected_chunks": ["chunk_20", "chunk_23", "chunk_24"]
    },
    {
        "query": "berapa rentang pH ideal untuk hidroponik dan apa akibat fluktuasinya",
        "expected_chunks": ["chunk_9"]
    },
    {
        "query": "apa saja unsur hara makro dan mikro dalam larutan AB Mix",
        "expected_chunks": ["chunk_5"]
    },
    {
        "query": "berapa target EC untuk pakcoy pada fase vegetatif akhir",
        "expected_chunks": ["chunk_14", "chunk_15"]
    },
    {
        "query": "apa catatan khusus untuk tanaman kangkung",
        "expected_chunks": ["chunk_14"]
    },
    {
        "query": "berapa target PPM dan EC untuk tanaman tomat pada fase generatif",
        "expected_chunks": ["chunk_17", "chunk_18"]
    },
]

# Fungsi reusable untuk benchmark tiap teknik
def check_relevance(test_queries, retrieve_fn):
    total_expected = len(test_queries)
    total_hit = 0

    for index, test_query in enumerate(test_queries):
        query = test_query["query"]
        expected_chunks = test_query["expected_chunks"]

        retrieved = retrieve_fn(query, top_k=5)
        retrieved_chunk_ids = [r["chunk_id"] for r in retrieved]

        hit = bool(
            set(retrieved_chunk_ids)
            .intersection(expected_chunks)
        )

        if hit:
            total_hit += 1

    print("=" * 50)
    print(f"Total expected hit: {total_expected}")
    print(f"Total hit: {total_hit}")
    print(f"Hit@5: {total_hit / total_expected * 100:.2f}%")
    print("=" * 50)
```

Jika sudah, kita lanjut untuk menguji tiap teknik retrieval yang berbeda.

## Retrieval Berbasis Embedding (Default)

```python
def retrieve(query, top_k=3):
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
        results["distances"][0]
    ):
        retrieved.append({
            "text": doc,
            "chunk_id": meta["chunk_id"],
            "source": meta["source"],
            "distance": distance
        })

    return retrieved

check_relevance(test_queries, retrieve)
# Output:
# ==================================================
# Total expected hit: 20
# Total hit: 16
# Hit@5: 80.00%
# ==================================================
```

Berdasarkan pengujian yang dilakukan, retrieval berbasis embedding memiliki akurasi sebesar 80%. Artinya, dari 20 query yang diuji, terdapat 16 query yang berhasil menemukan minimal satu chunk yang diharapkan muncul di Top-5 hasil retrieval.

## Retrieval Berbasis Embedding + BM25

Apa itu BM25? BM25 merupakan metode *lexical retrieval* yang memberikan skor relevansi berdasarkan
kecocokan kata antara query dan dokumen. BM25 menggunakan konsep Term Frequency (TF)
dan Inverse Document Frequency (IDF), serta mempertimbangkan panjang dokumen.

- **Term Frequency (TF):** Mengukur seberapa sering sebuah kata muncul dalam suatu dokumen.
  Semakin sering term muncul, skor relevansinya dapat meningkat, meskipun BM25 membatasi
  pengaruh frekuensi tersebut agar tidak meningkat tanpa batas.

- **Inverse Document Frequency (IDF):** Mengukur seberapa jarang sebuah term muncul
  di seluruh corpus. Semakin jarang term tersebut muncul di corpus, semakin tinggi
  nilai IDF-nya.

Langkah pertama untuk menambahkan BM25 adalah membuat corpus dari semua dokumen yang ada. Corpus ini akan digunakan untuk membangun model BM25.

```python
all_data = collection.get(
    include=["documents", "metadatas"]
)

documents = all_data["documents"]
metadatas = all_data["metadatas"]

def tokenize(text: str):
    return text.lower().split()

tokenize_corpus = [tokenize(doc) for doc in documents]
print(tokenize_corpus[0])
```

Kemudian, kita akan membuat model BM25 menggunakan library `rank-bm25` dengan corpus yang telah dibuat.

```python
from rank_bm25 import BM25Okapi
import numpy as np

bm25 = BM25Okapi(tokenize_corpus)

print(bm25.corpus_size) # Output 28
```

Lalu kita buat fungsi retrieval berbasis BM25. Fungsi ini akan menerima query, melakukan tokenisasi, dan mengembalikan hasil retrieval berdasarkan skor BM25.

```python
def retrieve_bm25(query, top_k=3):
    tokenized_query = tokenize(query)
    doc_scores = bm25.get_scores(tokenized_query)

    top_k_indices = np.argsort(doc_scores)[::-1][:top_k]
    retrieved = []
    for idx in top_k_indices:
        retrieved.append({
            "text": documents[idx],
            "chunk_id": metadatas[idx]["chunk_id"],
            "source": metadatas[idx]["source"],
            "score": doc_scores[idx]
        })

    return retrieved
```

Kemudian kita coba test fungsi retrieval dan juga evaluasi menggunakan metrik Hit@K.

```python
query = "berapa target EC untuk kangkung"

results = retrieve_bm25(query, top_k=5)

for result in results:
    print(result["chunk_id"], result["score"])
    print(result["text"])
    print("-" * 50)
```

```python
check_relevance(
    test_queries,
    retrieve_bm25
)
# Output:
# ==================================================
# Total expected hit: 20
# Total hit: 15
# Hit@5: 75.00%
# ==================================================
```

Skor Dense Retrieval dan BM25 memiliki skala yang berbeda. Skor BM25 juga tidak memiliki batas atas tetap, sehingga tidak dapat langsung dijumlahkan dengan skor Dense Retrieval karena salah satu skor dapat mendominasi hasil. Oleh karena itu, Hybrid Retrieval membutuhkan metode yang menggabungkan **peringkat (ranking)** dari kedua metode, bukan skor mentahnya. Salah satu metode yang digunakan adalah **Reciprocal Rank Fusion (RRF)**.

Berikut adalah implementasi gabungan Dense Retrieval dan BM25 menggunakan RRF. 

```python
def retrieve_hybrid(query, top_k=5, candidate_k=10):
    dense_results = retrieve(query, top_k=candidate_k)
    bm25_results = retrieve_bm25(query, top_k=candidate_k)

    scores = {}
    documents = {}

    k = 60

    # Dense ranking
    for rank, result in enumerate(dense_results, start=1):
        chunk_id = result["chunk_id"]

        scores[chunk_id] = scores.get(chunk_id, 0)
        scores[chunk_id] += 1 / (k + rank)

        documents[chunk_id] = result

    # BM25 ranking
    for rank, result in enumerate(bm25_results, start=1):
        chunk_id = result["chunk_id"]

        scores[chunk_id] = scores.get(chunk_id, 0)
        scores[chunk_id] += 1 / (k + rank)

        documents[chunk_id] = result

    # Sort berdasarkan RRF score
    ranked_chunks = sorted(
        scores.items(),
        key=lambda x: x[1],
        reverse=True
    )

    retrieved = []

    for chunk_id, score in ranked_chunks[:top_k]:
        result = documents[chunk_id].copy()
        result["hybrid_score"] = score
        retrieved.append(result)

    return retrieved

results = await retrieve_hybrid(query, top_k=5)

print("Query: ", query)
for result in results:
    print(
        result["chunk_id"],
        result["hybrid_score"]
    )

check_relevance(test_queries, retrieve_hybrid)
# Output:
#==================================================
# Total expected hit: 20
# Total hit: 18
# Hit@5: 90.00%
# ==================================================
```

## Reranker

Reranker adalah sebuah tahap dalam retrieval yang melakukan penilaian ulang terhadap kandidat dokumen menggunakan model yang lebih memahami hubungan antara query dan dokumen. Tapi harap diingat, reranker hanya dapat mengurutkan ulang dokumen yang diambil dari retriever.

Pada modul ini kita menggunakan reranker dari BAAI yaitu `bge-reranker-v2-m3`, kalian dapat eksplorasi menggunakan model reranker yang lain.

```python
from sentence_transformers import CrossEncoder

cross_encoder = CrossEncoder("BAAI/bge-reranker-v2-m3")
```

Membuat fungsi rerank:

```python
def rerank(query, results, top_k=5):
    sentence_pairs = [
        [query, result["text"]]
        for result in results
    ]

    scores = cross_encoder.predict(sentence_pairs)

    for score, result in zip(scores, results):
        result["cross_encoder_score"] = float(score)

    reranked = sorted(
        results,
        key=lambda x: x["cross_encoder_score"],
        reverse=True
    )

    return reranked[:top_k]
```

Membuat fungsi retrieval hybrid + reranker:

```python
def retrieve_hybrid_reranked(query, top_k=5, candidate_k=10):
    candidates = retrieve_hybrid(
        query,
        top_k=candidate_k
    )

    return rerank(
        query,
        candidates,
        top_k=top_k
    )

rerank_result = retrieve_hybrid_reranked(query, top_k=5)
print("Query: ", query)
for result in rerank_result:
    print(
        result["chunk_id"],
        result["cross_encoder_score"]
    )

check_relevance(test_queries, retrieve_hybrid_reranked)
# Output:
# ==================================================
# Total expected hit: 20
# Total hit: 19
# Hit@5: 95.00%
# ==================================================
```

## HyDE (Hypothetical Document Embeddings)

HyDE (Hypothetical Document Embeddings) adalah teknik retrieval yang menggunakan LLM untuk membuat jawaban hipotetis dari query terlebih dahulu, kemudian jawaban tersebut digunakan sebagai representasi untuk melakukan retrieval. Tujuan dari teknik ini adalah mengubah query pendek menjadi representasi yang lebih menyerupai isi dokumen yang ingin ditemukan.

Dalam eksperimen HyDE kalian bisa memilih dan menyesuaikan kode yang ada pada bagian ini (menggunakan `groq` atau `llama-server`). Namun pada bagian ini kita akan menggunakan `groq` untuk membuat jawaban hipotesis.

!!! warning

    Jika kalian menggunakan `groq` terdapat batasan jumlah request yang dapat kalian kirim per menit. Kalian dapat melihat informasi tersebut pada halaman [rate limit](https://console.groq.com/docs/rate-limits). Jika kalian menggunakan `llama-server`, pastikan server sudah berjalan dan dapat diakses.

!!! info

    Pada modul ini kita menggunakan model Gemma 4 E2B QAT. Kalian bisa menggunakan model lain yang tersedia di [Hugging Face](https://huggingface.co/models). Model tersebut dijalankan menggunakan library `transformers`.

!!! tip

    Kalian bisa mengurangi jumlah request yang dikirim ke LLM dengan menambahkan cache pada fungsi `generate_hyde_answer`. Cache ini akan menyimpan jawaban hipotesis untuk query yang sama sehingga tidak perlu mengirim request ke LLM lagi.

```python
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

model_id = "google/gemma-4-E2B-it-qat-mobile-transformers" # atau versi QAT BF16

tokenizer = AutoTokenizer.from_pretrained(model_id)
model_llm = AutoModelForCausalLM.from_pretrained(
    model_id,
    device_map="auto",
    torch_dtype=torch.bfloat16
)
```

Membuat fungsi bantu untuk membuat jawaban hipotesis:

```python
HYDE_SYSTEM_PROMPT = """
Buat satu jawaban hipotetis yang mungkin menjawab pertanyaan berikut dalam 1 kalimat. Jangan buat terlalu umum atau generik.
"""

def hyde_generate(prompt: str) -> str:
    """
    Menghasilkan jawaban menggunakan model Gemma lokal.
    `prompt` diasumsikan sudah berisi SYSTEM_PROMPT + konteks RAG.
    """
    # Gemma tidak mendukung peran 'system'; gabungkan semuanya ke peran 'user'
    # dan gunakan chat template dari tokenizer
    messages = [{"role": "user", "content": f"{HYDE_SYSTEM_PROMPT}\n\n{prompt}"}]

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
```

Kemudian untuk menghemat waktu, kita buat fungsi untuk membuat hipotesis dan menyimpan hasilnya ke sebuah variabel yang dapat digunakan kembali. Dengan begitu, jika query yang sama diminta lagi, kita tidak perlu mengirim request ke LLM lagi.

```python
# Cache HyDE per query — LLM hanya dipanggil sekali per query unik
_HYDE_CACHE: dict[str, str] = {}
QUERY_HYDE_PAIR_LIST = []

def get_hyde(query: str) -> str:
    """Ambil (atau generate) teks hipotetis untuk query. Di-cache."""
    if query not in _HYDE_CACHE:
        hyde_text = hyde_generate(query)
        _HYDE_CACHE[query] = hyde_text
        QUERY_HYDE_PAIR_LIST.append({
            "query": query,
            "hyde": hyde_text,
        })
    return _HYDE_CACHE[query]
```

Lanjut kita buat fungsi retrieval HyDE + Embedding (default):

```python
def retrieve_hyde(query, top_k=5):
    hyde_text = get_hyde(query)
    enhanced_query = f"{query}\n {hyde_text}"

    prefixed_query = QUERY_PREFIX + enhanced_query.strip()

    hyde_embedding = model_embedding.encode([prefixed_query], normalize_embeddings=True).tolist()

    results = collection.query(
        query_embeddings=hyde_embedding,
        n_results=top_k,
        include=["documents", "metadatas", "distances"]
    )

    retrieved = []

    for doc, meta, distance in zip(
        results["documents"][0],
        results["metadatas"][0],
        results["distances"][0]
    ):
        retrieved.append({
            "text": doc,
            "chunk_id": meta["chunk_id"],
            "source": meta["source"],
            "distance": distance
        })

    return retrieved

check_relevance(test_queries, retrieve_hyde)
# Output:
# ==================================================
# Total expected hit: 20
# Total hit: 16
# Hit@5: 80.00%
# ==================================================
```

!!! info

    Pada sesi HyDE, nilai pada output berdasarkan pengujian menggunakan llama-server dan model Gemma 4 E2B QAT. Mungkin akan menghasilkan nilai yang berbeda jika menggunakan model lain.

## HyDE + Retrieval Berbasis Embedding + BM25

```python
def retrieve_hybrid_hyde(query, top_k=5, candidate_k=10):
    dense_results = retrieve_hyde(query, top_k=candidate_k)
    hyde_text = get_hyde(query)
    enhanced_query = f"{query}\n {hyde_text}"
    bm25_results = retrieve_bm25(enhanced_query, top_k=candidate_k)

    scores = {}
    documents = {}

    k = 60

    # Dense ranking
    for rank, result in enumerate(dense_results, start=1):
        chunk_id = result["chunk_id"]

        scores[chunk_id] = scores.get(chunk_id, 0)
        scores[chunk_id] += 1 / (k + rank)

        documents[chunk_id] = result

    # BM25 ranking
    for rank, result in enumerate(bm25_results, start=1):
        chunk_id = result["chunk_id"]

        scores[chunk_id] = scores.get(chunk_id, 0)
        scores[chunk_id] += 1 / (k + rank)

        documents[chunk_id] = result

    # Sort berdasarkan RRF score
    ranked_chunks = sorted(
        scores.items(),
        key=lambda x: x[1],
        reverse=True
    )

    retrieved = []

    for chunk_id, score in ranked_chunks[:top_k]:
        result = documents[chunk_id].copy()
        result["hybrid_score"] = score
        retrieved.append(result)

    return retrieved

check_relevance(test_queries, retrieve_hybrid_hyde)
# Output:
# ==================================================
# Total expected hit: 20
# Total hit: 18
# Hit@5: 90.00%
# ==================================================
```

## HyDE + Retrieval Berbasis Embedding + BM25 + Reranker

```python
def retrieve_hybrid_hyde_reranked(
    query,
    top_k=5,
    candidate_k=10
):
    candidates = retrieve_hybrid_hyde(
        query,
        top_k=candidate_k
    )

    hyde_text = get_hyde(query)
    enhanced_query = f"{query}\n {hyde_text}"

    return rerank(
        enhanced_query,
        candidates,
        top_k=top_k
    )

check_relevance(test_queries, retrieve_hybrid_hyde_reranked)
# Output:
# ==================================================
# Total expected hit: 20
# Total hit: 18
# Hit@5: 90.00%
# =================================================
```

## Hasil Eksperimen

> **AI Generated, need human review** — koreksi pemanggilan benchmark dan penyelarasan hasil.

Dari hasil eksperimen dengan beberapa teknik retrieval, diperoleh hasil sebagai berikut:

| Teknik                         | Hit@5 |
| ------------------------------ | :---: |
| Base Retrieval                 |  80%  |
| BM25 (Lexical Retrieval)       |  75%  |
| Base Retrieval + BM25 (Hybrid) |  90%  |
| Hybrid + Reranker              |  95%  |
| HyDE + Base Retrieval          |  80%  |
| HyDE + Hybrid                  |  90%  |
| HyDE + Hybrid + Reranker       |  90%  |

Hasil eksperimen menunjukkan bahwa penambahan atau kombinasi teknik retrieval tidak selalu meningkatkan performa. Hasilnya bergantung pada beberapa faktor, seperti:

* Ukuran dan struktur chunk
* Kemampuan embedding model
* Kualitas lexical retrieval
* Kualitas kandidat yang dihasilkan pada tahap retrieval
* Hasil generasi LLM pada HyDE

Pada contoh hasil eksperimen ini, **Hybrid + Reranker** memperoleh Hit@5 tertinggi sebesar **95%**. Konfigurasi itu dipakai pada pipeline di bawah.

## Web Search (DuckDuckGo Search)

Retrieval sebelumnya masih terbatas pada informasi yang tersedia di dalam knowledge base. Ketika informasi yang dibutuhkan tidak ditemukan atau membutuhkan informasi dari luar knowledge base, sistem membutuhkan sumber retrieval eksternal. Salah satu pendekatan yang dapat digunakan adalah Web Search menggunakan DuckDuckGo.

DuckDuckGo Search (DDGS) merupakan tools yang digunakan untuk mencari informasi di internet. Dengan menambahkan tools ini ke dalam pipeline RAG, hasil pencarian web dapat digunakan sebagai fallback atau sumber informasi tambahan sebelum dikirim ke model LLM. Pada eksperimen kali ini, DDGS digunakan sebagai fallback ketika skor relevansi hasil retrieval dari knowledge base berada di bawah threshold yang ditentukan.

Contoh penerapannya:

```python
from ddgs import DDGS

web_search_result = DDGS().text(
        query,
        max_results=5
      )
print(f"Hasil pencarian di internet untuk query: {query}")
for result in web_search_result:
    print(result["title"])
    print(result["href"])
    print(result["body"])
```

## Membuat Pipeline RAG dengan Kombinasi Teknik Terbaik + DDGS

```python
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

def augmented(query, retrieved_docs, web_search=False):
    if web_search:
        context = "\n\n".join(
            f"[{d['title']}]\n{d['body']}\nURL: {d['href']}"
            for d in retrieved_docs
        )
    else:
        context = "\n\n".join(
            f"[{d['chunk_id']}]\n{d['text']}"
            for d in retrieved_docs
        )
    # Augmented
    prompt = f"""Konteks:
    {context}

    Pertanyaan:
    {query}

    Jawaban:"""

    return prompt

```

Membuat fungsi retrieval dengan kombinasi teknik terbaik + DDGS:

```python
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

def web_search(query, max_results=5):
    web_search_result = DDGS().text(
        query,
        max_results=max_results
    )
    return web_search_result

# Pipeline RAG dengan kombinasi teknik terbaik + DDGS
def rag_pipeline(query, top_k=3):
    retrieved = retrieve_hybrid_reranked(query, top_k=top_k)
    top_scores = retrieved[0]['cross_encoder_score']
    if top_scores < 0.8:
        web_search_result = web_search(query)
        prompt = augmented(query, web_search_result, web_search=True)
        answer = generate(prompt)
        return web_search_result, answer

    prompt = augmented(query, retrieved)
    answer = generate(prompt)
    return retrieved, answer
```

Lanjut kita coba pipeline RAG tersebut:

```python
query = "bagaimana pengaruh pH di atas 7 terhadap zat besi pada tanaman"
retrieved, answer = rag_pipeline(query, top_k=5)
print("Retrieved: ")
for d in retrieved:
    print(f"  - {d}")
print("Answer: ", answer)
```

## Kesimpulan

Dalam mengembangkan sistem RAG, performa tidak hanya bergantung pada teknik retrieval atau model embedding yang digunakan. Diperlukan eksplorasi dan evaluasi yang berkelanjutan agar sistem yang dibangun dapat memberikan hasil yang sesuai dengan karakteristik dan ruang lingkup knowledge base.
