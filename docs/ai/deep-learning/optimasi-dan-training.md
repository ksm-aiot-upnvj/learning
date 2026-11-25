# Optimasi dan Training

Training mencari parameter model yang menghasilkan loss kecil pada data training dan tetap bekerja pada data baru. Proses ini harus dipantau karena loss training yang rendah dapat terjadi bersamaan dengan performa validation yang buruk.

```mermaid
flowchart LR
    A[Dataset] --> B[Preprocessing]
    B --> C[Training set]
    B --> D[Validation set]
    B --> E[Test set]
    C --> F[Training]
    D --> G[Pemilihan model]
    F --> G
    G --> H[Evaluasi sekali pada test set]
```

## Hyperparameter Utama

**Rujukan riset untuk optimizer:** [Robbins & Monro, “A Stochastic Approximation Method” (1951), *The Annals of Mathematical Statistics*](https://doi.org/10.1214/aoms/1177729586) untuk dasar stochastic approximation; [Duchi, Hazan & Singer, “Adaptive Subgradient Methods for Online Learning and Stochastic Optimization” (2011), *Journal of Machine Learning Research*](https://jmlr.org/papers/v12/duchi11a.html) untuk AdaGrad; [Kingma & Ba, “Adam: A Method for Stochastic Optimization” (2015), ICLR](https://arxiv.org/abs/1412.6980) untuk Adam.

- **Batch size** menentukan jumlah contoh yang diproses sebelum update parameter.
- **Epoch** menentukan berapa kali model melihat seluruh data training.
- **Learning rate** menentukan besar perubahan parameter.
- **Optimizer** menentukan aturan update, misalnya SGD atau Adam.
- **Model capacity** ditentukan oleh jumlah layer dan neuron.

## Overfitting dan Underfitting

Underfitting terjadi ketika model belum mampu mempelajari pola. Overfitting terjadi ketika model terlalu mengikuti data training dan gagal pada data baru.

```text
training loss turun + validation loss turun     -> training masih membantu
training loss turun + validation loss naik       -> kemungkinan overfitting
keduanya tetap tinggi                             -> kemungkinan underfitting
```

Gunakan dropout, weight decay, data augmentation, early stopping, atau model yang lebih kecil sesuai penyebabnya.

## Evaluasi Data Sensor

Untuk data yang memiliki urutan waktu, pembagian acak dapat menyebabkan data masa depan masuk ke training. Gunakan pembagian berdasarkan waktu jika tujuan model adalah memprediksi masa depan.

## Metrik

- Regresi: MAE, RMSE, dan error maksimum.
- Klasifikasi: accuracy, precision, recall, F1 score, dan confusion matrix.
- Anomali: false alarm rate, missed anomaly, dan detection delay.
- Deployment: waktu inference, RAM, ukuran model, dan konsumsi daya.

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-layers:</span> **Arsitektur MLP** <span class="ai-practice-description">Gunakan data sensor berbentuk tabel untuk melihat cara menyusun beberapa lapisan neuron.</span>](arsitektur-mlp.md){ .ai-practice-start }

</div>

[Kembali ke Deep Learning](overview.md)
