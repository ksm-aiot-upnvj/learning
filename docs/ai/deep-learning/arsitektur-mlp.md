# Arsitektur MLP

Multilayer Perceptron atau MLP menerima data berbentuk vektor. MLP cocok sebagai model awal untuk data sensor yang sudah diringkas menjadi fitur, misalnya suhu rata-rata, kelembapan terakhir, dan perubahan pH dalam satu menit.

![MLP fully connected dari empat fitur ke dua hidden layer dan tiga kelas output](../../assets/images/dl-mlp.svg)

## Bentuk Data

**Rujukan riset:** [Rumelhart, Hinton & Williams, “Learning Representations by Back-propagating Errors” (1986), *Nature*](https://doi.org/10.1038/323533a0), salah satu karya berpengaruh tentang training jaringan berlapis dengan backpropagation.

Jika terdapat `N` baris data dan `F` fitur, input biasanya berbentuk matriks:

$$
X \in \mathbb{R}^{N \times F}
$$

Satu baris berisi satu contoh. Jangan mencampur nilai sensor dengan skala yang sangat berbeda tanpa preprocessing. Standardisasi umum menggunakan:

$$
x' = \frac{x - \mu}{\sigma}
$$

`\mu` adalah rata-rata data training dan `\sigma` adalah standar deviasi data training. Parameter ini harus digunakan kembali saat inference.

## Layer dan Kapasitas

- Input layer mengikuti jumlah fitur.
- Dense layer menghubungkan setiap input ke setiap neuron pada layer berikutnya.
- Jumlah neuron dan layer menentukan kapasitas model.
- Output layer mengikuti jenis tugas: satu angka, satu probabilitas, atau beberapa kelas.

Model yang terlalu kecil dapat gagal mempelajari pola. Model yang terlalu besar dapat menghafal data training dan gagal pada data baru.

## Contoh Kasus

Untuk memprediksi kebutuhan penyiraman, input dapat berupa:

```text
[kelembapan tanah, suhu, kelembapan udara, intensitas cahaya, jam]
```

Output dapat berupa durasi pompa dalam detik. Untuk klasifikasi, output dapat berupa kelas kondisi tanaman.

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-image:</span> **CNN untuk data gambar** <span class="ai-practice-description">Jika posisi pola dalam gambar penting, ikuti cara filter kecil bergerak di atas piksel.</span>](cnn.md){ .ai-practice-start }

[<span class="ai-practice-icon" aria-hidden="true">:lucide-chart-line:</span> **Model Sequence untuk deret waktu** <span class="ai-practice-description">Jika urutan pembacaan sensor penting, bentuk jendela waktu untuk memasukkan beberapa sampel ke model.</span>](model-sequence.md)

</div>

[Kembali ke Deep Learning](overview.md)
