# AI Fundamental

Sebuah tangki air punya sensor ketinggian. Sistem harus memberi peringatan sebelum tangki kosong. Mulai dari satu keputusan yang bisa diperiksa: kapan alarm perlu menyala?

## Mulai dengan aturan

Anggap alarm harus menyala ketika ketinggian di bawah 10 cm. Aturan `ketinggian_cm < 10` langsung memberi hasil. Untuk pembacaan 12, 9, dan 11 cm, alarm hanya menyala pada 9 cm. Nilai 10 cm adalah batas latihan, yang perlu ditentukan dari bentuk tangki dan kebutuhan pompa pada sistem nyata.

Aturan ini menjawab pertanyaan “apakah air sudah rendah?”. Jika tujuannya berubah menjadi “apakah air akan rendah dalam 15 menit?”, satu pembacaan belum menunjukkan seberapa cepat air berkurang.

## Kapan model bisa membantu?

Mulailah dengan aturan pembanding, misalnya memakai laju penurunan dari dua pengukuran terakhir. Jika perubahan laju sulit diperkirakan dengan aturan itu, coba Machine Learning (ML). Siapkan beberapa pembacaan sebelumnya sebagai masukan. Untuk setiap contoh historis, beri label apakah air benar-benar turun di bawah 10 cm dalam 15 menit berikutnya.

- **Training** memakai contoh historis untuk menyesuaikan model.
- **Inference** memakai model yang sudah dilatih untuk menilai pembacaan baru.
- **Evaluasi** memakai periode lain yang tidak dipakai saat training. Bandingkan jumlah alarm palsu dan kejadian air rendah yang terlewat dari aturan pembanding dan model.

AI mencakup berbagai cara membuat sistem menyelesaikan tugas seperti prediksi dan pengambilan keputusan. ML adalah salah satu pendekatannya. Deep Learning memakai jaringan saraf berlapis. Pada contoh ini, mulai dengan aturan dan model kecil sebelum mencoba jaringan saraf.

## Mengenal Komponen AI System

* Data
* Model
* Inference
* Prompt dan context
* Knowledge base
* Retrieval
* Tools
* Feedback

Peserta diperkenalkan bahwa sistem AI modern dapat terdiri dari lebih dari sekadar sebuah model.

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-table-2:</span> **Masalah dan Data** <span class="ai-practice-description">Tentukan apa yang ingin diprediksi. Pilih data masukan, target, dan aturan sederhana untuk dijadikan pembanding.</span>](machine-learning/masalah-dan-data.md){ .ai-practice-start }

[<span class="ai-practice-icon" aria-hidden="true">:lucide-workflow:</span> **AI Systems** <span class="ai-practice-description">Jika ingin memakai model yang sudah tersedia, lihat bagaimana aplikasi memberinya data dan memakai hasilnya.</span>](ai-systems/overview.md)

</div>
