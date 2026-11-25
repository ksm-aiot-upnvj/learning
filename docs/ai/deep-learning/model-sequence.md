# Model Sequence untuk Deret Waktu

Model sequence digunakan ketika urutan data membawa informasi. Pada sistem AIoT, urutan suhu, kelembapan, getaran, atau arus listrik dapat membantu model membedakan tren normal dari perubahan yang tidak biasa.

![Tiga langkah pembacaan sensor diproses berurutan; hidden state diteruskan ke langkah berikutnya dan menghasilkan prediksi](../../assets/images/dl-sequence.svg)

## Windowing

Data diubah menjadi window yang berisi beberapa pengamatan sebelumnya. Jika panjang window adalah `T` dan setiap pengamatan memiliki `F` fitur, bentuk input dapat ditulis sebagai:

$$
X \in \mathbb{R}^{T \times F}
$$

Target dapat berupa nilai berikutnya, kelas seluruh window, atau beberapa nilai pada masa depan.

Contoh baseline: dua suhu terakhir `[29.0, 29.5]` menghasilkan moving average `29.25 °C`. Baseline nilai terakhir menghasilkan `29.5 °C`. Jika suhu aktual berikutnya `30.0 °C`, error absolutnya masing-masing `0.75 °C` dan `0.5 °C`. Satu sampel belum cukup untuk memilih model; perbandingan dilakukan pada seluruh periode uji.

## RNN, LSTM, dan GRU

Lapisan sequence menerima satu window sekaligus, lalu membaca isinya langkah demi langkah. Pada waktu $t$, model menggabungkan fitur saat ini $x_t$ dengan ringkasan langkah sebelumnya $h_{t-1}$. Bobot yang sama digunakan pada setiap langkah waktu.

### RNN sederhana

**Rujukan riset:** [Elman, “Finding Structure in Time” (1990), *Cognitive Science*](https://doi.org/10.1207/S15516709COG1402_1), memperkenalkan Simple Recurrent Network untuk mempelajari struktur urutan.

Recurrent Neural Network (RNN) memperbarui hidden state dengan persamaan:

$$
h_t = \tanh(W_x x_t + W_h h_{t-1} + b)
$$

$h_t$ menyimpan ringkasan dari input sampai waktu $t$. Contohnya, saat membaca suhu per menit, state saat ini dipengaruhi suhu menit ini dan state dari menit sebelumnya. RNN sederhana berguna untuk memahami alur state, tetapi informasi lama dapat sulit dipertahankan pada urutan panjang. Saat training, gradien dapat mengecil (*vanishing gradient*) atau membesar (*exploding gradient*), sehingga hubungan jarak jauh sulit dipelajari.

[Dokumentasi SimpleRNN Keras](https://keras.io/api/layers/recurrent_layers/simple_rnn/){ .md-button }

### LSTM

**Rujukan riset:** [Hochreiter & Schmidhuber, “Long Short-Term Memory” (1997), *Neural Computation*](https://doi.org/10.1162/neco.1997.9.8.1735).

Long Short-Term Memory (LSTM) memiliki **cell state** $c_t$ sebagai jalur penyimpanan informasi dan tiga gate untuk mengatur alirannya. Gate menghasilkan nilai antara 0 dan 1 melalui sigmoid: nilai mendekati 0 menahan informasi, sedangkan nilai mendekati 1 meloloskannya.

$$
f_t = \sigma(W_f [h_{t-1}, x_t] + b_f), \qquad
i_t = \sigma(W_i [h_{t-1}, x_t] + b_i)
$$

$$
\tilde{c}_t = \tanh(W_c [h_{t-1}, x_t] + b_c), \qquad
c_t = f_t \odot c_{t-1} + i_t \odot \tilde{c}_t
$$

$$
o_t = \sigma(W_o [h_{t-1}, x_t] + b_o), \qquad
h_t = o_t \odot \tanh(c_t)
$$

Forget gate $f_t$ mengatur bagian memori lama yang dipertahankan. Input gate $i_t$ memilih informasi baru untuk ditulis. Output gate $o_t$ memilih bagian memori yang menjadi hidden state berikutnya. Jalur cell state membantu informasi bertahan melewati lebih banyak langkah, tetapi lapisan ini memiliki parameter lebih banyak daripada RNN sederhana.

[Dokumentasi LSTM Keras](https://keras.io/api/layers/recurrent_layers/lstm/){ .md-button }

### GRU

**Rujukan riset:** [Cho et al., “Learning Phrase Representations using RNN Encoder–Decoder for Statistical Machine Translation” (2014), *Proceedings of EMNLP*](https://aclanthology.org/D14-1179/). Makalah ini memperkenalkan arsitektur encoder-decoder GRU.

Gated Recurrent Unit (GRU) memakai dua gate dan tidak memisahkan cell state dari hidden state. **Update gate** menentukan seberapa banyak state lama dibawa, sedangkan **reset gate** menentukan seberapa banyak state lama dipakai saat membentuk kandidat state baru.

Salah satu bentuk persamaannya adalah:

$$
z_t = \sigma(W_z [h_{t-1}, x_t]), \qquad
r_t = \sigma(W_r [h_{t-1}, x_t])
$$

$$
\tilde{h}_t = \tanh(W_h [r_t \odot h_{t-1}, x_t]), \qquad
h_t = z_t \odot h_{t-1} + (1-z_t) \odot \tilde{h}_t
$$

$z_t$ mengatur campuran state lama dan kandidat baru; $r_t$ mengatur seberapa kuat riwayat lama memengaruhi kandidat. GRU biasanya lebih ringkas daripada LSTM karena tidak memiliki cell state terpisah. Detail definisi gate dapat berbeda menurut formulasi dan implementasi, jadi periksa dokumentasi layer yang digunakan.

[Dokumentasi GRU Keras](https://keras.io/api/layers/recurrent_layers/gru/){ .md-button }

### Contoh bentuk model

Untuk input dengan 24 langkah dan 3 fitur per langkah, bentuk tensor yang masuk ke model adalah `(batch, 24, 3)`. `batch` adalah jumlah window yang diproses bersama. Model di bawah memprediksi satu nilai suhu dari window tersebut.

??? example "Model LSTM dengan Keras"
    ```python
    import keras

    model = keras.Sequential([
        keras.Input(shape=(24, 3)),
        keras.layers.LSTM(32),
        keras.layers.Dense(1),
    ])
    model.compile(optimizer="adam", loss="mean_squared_error")
    model.summary()
    ```

Untuk membandingkan arsitektur, ganti `keras.layers.LSTM(32)` dengan `keras.layers.SimpleRNN(32)` atau `keras.layers.GRU(32)`, lalu latih dan nilai model pada split waktu yang sama.

| Model | Ringkasan memori | Hal yang perlu diperhatikan |
| --- | --- | --- |
| RNN sederhana | Satu hidden state | Paling sederhana; sulit membawa informasi jauh pada sequence panjang. |
| LSTM | Hidden state dan cell state dengan tiga gate | Lebih banyak parameter; gate mengatur memori yang dilupakan, ditulis, dan dikeluarkan. |
| GRU | Satu hidden state dengan dua gate | Struktur lebih ringkas; sering layak dibandingkan dengan LSTM sebagai baseline sequence. |

Tidak ada satu model yang selalu unggul. Mulai dengan baseline nilai terakhir atau moving average, lalu bandingkan RNN, LSTM, dan GRU pada periode test yang sama. CNN 1D juga dapat lebih ringan jika pola lokal sudah cukup.

## Evaluasi Berbasis Waktu

Jangan mencampur pengamatan masa depan ke data training. Urutkan data berdasarkan timestamp, gunakan bagian awal untuk training, bagian berikutnya untuk validation, dan bagian terakhir untuk test.

## Kasus AIoT

- Prediksi suhu satu langkah ke depan.
- Klasifikasi kondisi pompa dari getaran.
- Deteksi perubahan pola kelembapan tanah.
- Prediksi kebutuhan air berdasarkan riwayat sensor dan cuaca.

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-clipboard-check:</span> **Evaluasi Model** <span class="ai-practice-description">Gunakan pemisahan berdasarkan waktu agar sampel masa depan tidak ikut menentukan prediksi yang sedang diuji.</span>](../machine-learning/evaluasi-model.md#pisahkan-data-dengan-benar){ .ai-practice-start }

[<span class="ai-practice-icon" aria-hidden="true">:lucide-cpu:</span> **AI Inference** <span class="ai-practice-description">Ikuti bagaimana aplikasi menerima data baru dan menjalankan model setelah pelatihan.</span>](../ai-systems/ai-inference.md)

</div>

[Kembali ke Deep Learning](overview.md)
