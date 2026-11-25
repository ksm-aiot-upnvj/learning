# Convolutional Neural Network

Convolutional Neural Network atau CNN mempelajari pola lokal dengan filter yang digunakan berulang pada bagian data yang berbeda. CNN paling dikenal untuk gambar, tetapi CNN 1D juga dapat membaca pola pendek pada sinyal sensor.

Contoh kode pada halaman ini memakai Keras. Jika istilah framework masih baru, baca [TensorFlow, Keras, dan PyTorch](frameworks.md) terlebih dahulu.

![Alur CNN dari gambar melalui filter, feature map, pooling, hingga kelas](../../assets/images/dl-cnn.svg)

## Convolution

**Rujukan riset:** [LeCun et al., “Gradient-Based Learning Applied to Document Recognition” (1998), *Proceedings of the IEEE*](https://doi.org/10.1109/5.726791). Artikel jurnal ini menjelaskan CNN untuk pengenalan pola gambar.

Pada satu dimensi, filter menghitung gabungan berbobot dari beberapa nilai yang berdekatan:

$$
y_t = \sum_{k=0}^{K-1} w_k x_{t-k} + b
$$

`K` adalah panjang filter. Pada gambar, filter bergerak pada dua dimensi dan menghasilkan feature map.

Misalkan tiga pembacaan getaran berurutan adalah `[2, 3, 7]`. Dengan `w₀ = 1`, `w₁ = −1`, dan bias nol, rumus di atas menghitung nilai terbaru dikurangi nilai sebelumnya. Dua keluaran lengkapnya adalah `3 − 2 = 1` dan `7 − 3 = 4`. Filter ini menonjolkan kenaikan pada pembacaan terakhir.

## Geser kernel di atas citra

> **AI Generated, need human review**

Citra kecil ini memakai angka untuk kecerahan piksel. Kernel 3×3 memberi bobot `[-1, 0, 1]` pada setiap baris, sehingga tepian vertikal menghasilkan respons besar ketika sisi kanan dan kiri berbeda.

<div class="ai-concept" data-ai-concept="kernel">
  <label for="kernel-position">Posisi kernel</label>
  <input id="kernel-position" type="range" min="0" max="8" value="0">
  <div class="ai-concept-panels">
    <div><strong>Citra 5×5</strong><div class="ai-grid" data-pixels></div></div>
    <div><strong>Feature map 3×3</strong><div class="ai-grid" style="--columns:3" data-map></div></div>
  </div>
  <p><output for="kernel-position" aria-live="polite"></output></p>
  <noscript>Jendela kiri atas menghasilkan (4 − 1) + (4 − 1) + (5 − 2) = 9.</noscript>
</div>

Geser slider satu langkah. Jendela berpindah satu piksel dan hasil berikutnya mengisi satu sel *feature map*. Contoh memakai stride 1 dan tanpa padding, sehingga jendela 3×3 hanya punya tiga posisi mendatar dan tiga posisi menurun.

## Kapan CNN Berguna?

- Klasifikasi gambar daun, buah, atau kondisi komponen.
- Pengenalan pola lokal pada getaran motor.
- Deteksi perubahan pendek pada arus listrik.
- Klasifikasi potongan deret waktu dengan CNN 1D.

CNN tidak menggantikan model sequence secara otomatis. Pilih CNN 1D ketika pola lokal cukup untuk menentukan hasil. Gunakan model sequence ketika hubungan jarak jauh dalam urutan berpengaruh.

## Transfer Learning

Transfer learning memakai bobot yang telah dipelajari model dari dataset besar sebagai titik awal. Kita dapat memakai model sebagai feature extractor, lalu melatih classifier baru untuk kelas lokal. Ini mengurangi kebutuhan training dari awal, tetapi model tetap perlu diuji pada gambar dari kamera dan kondisi yang akan dipakai.

Keras menyediakan model dengan bobot pretrained melalui [Keras Applications](https://keras.io/api/applications/), termasuk MobileNetV2, ResNet, dan EfficientNet. Contoh berikut menghapus classifier bawaan MobileNetV2 dan membekukan convolutional base saat classifier baru mulai dilatih:

```python
import keras

base = keras.applications.MobileNetV2(
    weights="imagenet",
    include_top=False,
    input_shape=(224, 224, 3),
)
base.trainable = False

inputs = keras.Input(shape=(224, 224, 3))
x = keras.layers.Rescaling(scale=1 / 127.5, offset=-1)(inputs)
x = base(x, training=False)
x = keras.layers.GlobalAveragePooling2D()(x)
outputs = keras.layers.Dense(3, activation="softmax")(x)
model = keras.Model(inputs, outputs)
model.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])
```

Masukan contoh ini berupa gambar RGB `224 × 224` dengan piksel pada rentang `0–255`; layer `Rescaling` mengubahnya ke rentang `−1–1` yang diharapkan MobileNetV2. Pakai preprocessing yang sesuai untuk setiap arsitektur. Setelah classifier baru stabil, sebagian layer dasar dapat dibuka untuk fine-tuning dengan learning rate kecil. Pisahkan data train, validation, dan test sebelum melihat hasil.

Detail model dan preprocessing tersedia pada [Keras Applications](https://keras.io/api/applications/) dan [MobileNetV2](https://keras.io/api/applications/mobilenet/).

## Batasan Edge Device

Resolusi gambar, jumlah filter, dan jumlah layer memengaruhi memori serta waktu inference. Ukur model pada perangkat target, bukan hanya pada komputer training.

[Kembali ke Deep Learning](overview.md)
