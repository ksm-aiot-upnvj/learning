# Fine-tuning LLM

Fine-tuning adalah proses mengubah perilaku model yang sudah dilatih sebelumnya (*pre-trained model*) agar lebih cocok untuk tugas tertentu.

Urutan umumnya adalah **pre-training → post-training/alignment → deployment**. Fine-tuning termasuk dalam tahap post-training. Beberapa caranya adalah *Supervised Fine-Tuning* (SFT), distillation, dan reinforcement learning.

Base model hasil pre-training pada dasarnya mempelajari *next-token prediction*, yaitu melanjutkan teks. Base model belum tentu mengikuti instruksi atau berperilaku seperti asisten. Instruct model telah melalui fine-tuning agar dapat menjawab pertanyaan, mengikuti instruksi, dan menerapkan perilaku yang diharapkan.

## Memilih pendekatan

Fine-tuning dari base model dapat dipakai ketika ingin membentuk perilaku model secara mendasar. Dalam banyak penggunaan industri, titik awalnya adalah instruct model, lalu model disesuaikan untuk spesialisasi domain atau format keluaran tertentu.

### Full fine-tuning

Full fine-tuning memperbarui semua parameter model. Fleksibilitasnya tinggi, tetapi training perlu menyimpan bobot model, gradien, *optimizer state*, dan aktivasi. Karena itu kebutuhan memori dapat beberapa kali ukuran bobot model. Training model besar sering membagi pekerjaan ke banyak GPU:

- **Data parallelism**: setiap GPU memegang salinan model dan memproses bagian data berbeda.
- **Model parallelism**: model dibagi ke beberapa GPU, misalnya dengan *pipeline parallelism* atau *tensor parallelism*.

### Angka presisi dan quantization

**Rujukan riset:** [Dettmers et al., “QLoRA: Efficient Finetuning of Quantized LLMs” (2023), *Advances in Neural Information Processing Systems*](https://proceedings.neurips.cc/paper_files/paper/2023/file/1feb87871436031bdc0f2beaa62a049b-Paper-Conference.pdf). Makalah ini menjelaskan NF4, double quantization, dan paged optimizers pada QLoRA.

Floating point menyimpan nilai dengan bagian tanda (*sign*), eksponen (*exponent*), dan mantisa (*mantissa*). *Quantization* menyimpan bobot dengan lebih sedikit bit untuk mengurangi kebutuhan memori.

| Format | Bit per nilai | Komponen / representasi | Catatan penggunaan |
| --- | ---: | --- | --- |
| FP32 | 32 | 1 bit tanda, 8 eksponen, 23 mantisa | Presisi penuh; kebutuhan memori lebih besar. |
| FP16 | 16 | 1 bit tanda, 5 eksponen, 10 mantisa | Lebih hemat dari FP32; rentang nilai lebih sempit. |
| BF16 | 16 | 1 bit tanda, 8 eksponen, 7 mantisa | Rentang eksponen sama dengan FP32, mantisa lebih pendek. |
| INT8 | 8 | Nilai integer 8-bit; biasanya disertai *scale* dan *zero point* | Pemetaan nilai float ke rentang integer; rentang signed yang umum adalah −128 hingga 127. |
| NF4 | 4 | Indeks ke codebook 16 nilai, dirancang untuk distribusi bobot normal | Digunakan QLoRA untuk menyimpan bobot dasar dengan kebutuhan memori lebih rendah. |

Bit per nilai menunjukkan ukuran representasi dasar. Kebutuhan memori nyata juga dipengaruhi metadata kuantisasi, skala, padding, dan format komputasi.

### Parameter-Efficient Fine-Tuning (PEFT)

PEFT membekukan sebagian besar parameter dan melatih bagian yang lebih kecil. Kelompok metodenya antara lain:

- **Additive methods** menambahkan parameter, seperti adapter pada layer Transformer atau *soft prompt*.
- **Selective methods** memilih sebagian parameter yang sudah ada, misalnya beberapa layer terakhir atau parameter bias.
- **Reparameterization methods** menyatakan perubahan bobot dalam bentuk yang lebih ringkas, seperti LoRA.

Jika masih menentukan pendekatan untuk Gemma 4, bandingkan kapan memakai RAG, LoRA, atau full fine-tuning. Lihat juga perkiraan kebutuhan memori agar pilihan metode sesuai dengan kapasitas GPU yang tersedia. [Panduan resmi fine-tuning Gemma 4](https://gemma.ai/tuning/)

## LoRA

LoRA (*Low-Rank Adaptation*) membekukan bobot model dasar dan menambahkan dua matriks adapter yang dilatih. Untuk bobot \(W_0\), perubahan bobot ditulis sebagai \(\Delta W = \frac{\alpha}{r} B A\), sehingga bobot efektifnya \(W = W_0 + \Delta W\). Matriks A memproyeksikan ke dimensi rendah dan B memproyeksikan kembali. Rank \(r\) mengatur ukuran bottleneck; \(\alpha\) mengatur skala kontribusi adapter.

![Ilustrasi bobot dasar beku dan adapter LoRA](../../assets/images/lora-matrix-illustration.png)

**Rujukan riset:** [Hu et al., “LoRA: Low-Rank Adaptation of Large Language Models” (2022), *International Conference on Learning Representations*](https://openreview.net/pdf?id=nZeVKeeFYf9). Persamaan \(\Delta W = BA\) dengan faktor skala adalah parameterisasi adapter yang menjadi dasar ilustrasi ini.

Saat training LoRA, optimizer memperbarui A dan B; bobot dasar tetap. Hyperparameter penting mencakup **rank (r)**, **alpha** sebagai skala kontribusi adapter, dan **target modules** yang dipasangi adapter. Modul yang umum pada attention ialah `q_proj`, `k_proj`, `v_proj`, `o_proj`; pada feed-forward antara lain `gate_proj`, `up_proj`, dan `down_proj`.

## QLoRA

QLoRA menggabungkan bobot dasar yang dikuantisasi dengan pelatihan adapter LoRA. Bobot dasar dapat disimpan dalam 4-bit NF4, sementara komputasi menggunakan representasi presisi lebih tinggi seperti BF16. Bobot dasar dibekukan; adapter menjadi parameter yang dilatih. Ini mengurangi kebutuhan memori dibanding full fine-tuning, tetapi tidak menghilangkan kebutuhan GPU maupun evaluasi kualitas.

**Rujukan riset:** [Dettmers et al., “QLoRA: Efficient Finetuning of Quantized LLMs” (2023), *Advances in Neural Information Processing Systems*](https://proceedings.neurips.cc/paper_files/paper/2023/file/1feb87871436031bdc0f2beaa62a049b-Paper-Conference.pdf). Ini prosiding konferensi yang memperkenalkan metode QLoRA.

## Knowledge distillation

Knowledge distillation melatih *student model* agar meniru sebagian perilaku *teacher model* yang lebih besar. Sinyal yang dipindahkan dapat berupa keluaran atau probabilitas (*response-based*), representasi layer internal (*feature-based*), atau relasi antarfitur (*relation-based*). Bila logits teacher tersedia, student dapat belajar dari distribusi logits. Bila tidak, keluaran teacher dapat digunakan untuk membentuk data sintetis.

![Alur knowledge distillation: teacher beku menghasilkan soft target untuk melatih student](../../assets/images/ai-knowledge-distillation.svg)

**Rujukan riset:** [Hinton, Vinyals & Dean, “Distilling the Knowledge in a Neural Network” (2015)](https://arxiv.org/abs/1503.02531). Naskah ini beredar sebagai paper arXiv dan NIPS Deep Learning and Representation Learning Workshop.

## Alignment dan reinforcement learning

**Rujukan riset:** [Ouyang et al., “Training language models to follow instructions with human feedback” (2022), *Advances in Neural Information Processing Systems*](https://proceedings.neurips.cc/paper_files/paper/2022/hash/b1efde53be364a73914f58805a001731-Abstract.html), menjelaskan resep InstructGPT dengan supervised fine-tuning dan umpan balik manusia.

Alignment menyesuaikan perilaku model dengan tujuan dan preferensi yang ditetapkan. RLHF (*Reinforcement Learning from Human Feedback*) memakai umpan balik manusia dan model reward. PPO (*Proximal Policy Optimization*) biasanya melibatkan empat model/komponen: actor menghasilkan jawaban, reference model menjadi pembanding yang dibekukan, reward model memberi skor, dan critic memperkirakan nilai. Prosesnya menghasilkan beberapa jawaban, memberi reward, menghitung penalti KL terhadap reference, memperkirakan advantage, lalu memperbarui policy.

**Rujukan riset:** [Schulman et al., “Proximal Policy Optimization Algorithms” (2017), arXiv:1707.06347](https://arxiv.org/abs/1707.06347), sumber algoritma PPO.

GRPO (*Group Relative Policy Optimization*) membandingkan beberapa keluaran untuk satu masukan dan menghitung skor relatif antar keluaran. Alur umumnya menghasilkan beberapa jawaban, memberi reward, lalu menghitung advantage relatif dalam kelompok. Pendekatan ini tidak menggunakan critic terpisah seperti PPO, meski tetap memiliki kebutuhan komputasi dan rancangan reward yang perlu diperhitungkan.

![Diagram dua alur alignment: PPO memakai critic untuk menghitung advantage, sedangkan GRPO menormalkan reward dalam kelompok tanpa critic terpisah](../../assets/images/ai-alignment-ppo-grpo.svg)

**Rujukan riset:** [Shao et al., “DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models” (2024), arXiv:2402.03300](https://arxiv.org/abs/2402.03300), memperkenalkan GRPO. Sumber ini adalah preprint.

## Referensi lanjutan

- [Hugging Face TRL: SFT Trainer](https://huggingface.co/docs/trl/sft_trainer)
- [Hugging Face PEFT: LoRA](https://huggingface.co/docs/peft/main/en/conceptual_guides/lora)
- [RAG](rag.md) cocok untuk memasukkan dokumen yang sering berubah ke konteks saat inferensi.

## What's next

<div class="ai-resource-grid ai-practice-grid" id="simulator-qlora" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-sliders-horizontal:</span> **Simulator LoRA/QLoRA** <span class="ai-practice-description">Ubah panjang konteks. Bandingkan perkiraan memori GPU dengan pengaturan lain tetap sama.</span>](../../labs/qlora-simulator.md){ .ai-practice-start }

[<span class="ai-practice-icon" aria-hidden="true">:lucide-flask-conical:</span> **Latih adapter Gemma 4** <span class="ai-practice-description">Siapkan dataset percakapan dan jalankan QLoRA. Bandingkan jawaban model sebelum dan sesudah pelatihan.</span>](https://gemma.ai/tuning/qlora/)

</div>
