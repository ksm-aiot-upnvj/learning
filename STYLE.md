# Style Reference for Learning Modules

This file supports the writing rules in `AGENTS.md`. It shows the target style by example.

## Splitting a dense paragraph

Too dense (6 sentences, 4 concepts in one block):

> Aturan ambang cocok jika alarm harus berbunyi saat level air melewati 80 cm karena syaratnya jelas dan mudah diuji. Jika tujuannya memprediksi kapan air melewati batas itu, model machine learning dapat mempelajari hubungan antara riwayat sensor dan level air berikutnya. Deep learning adalah bagian dari machine learning yang memakai jaringan saraf berlapis. Pendekatan ini layak dipertimbangkan jika masukan berupa gambar kamera. Dalam AI Systems, model menjadi satu komponen aplikasi. Backend mengambil data terbaru, menjalankan prediksi, lalu menerapkan aturan untuk menentukan kapan peringatan dikirim.

Correct (one idea per paragraph, causal links kept):

> Aturan ambang cocok jika alarm harus berbunyi saat level air melewati 80 cm, karena syarat tersebut jelas dan mudah diuji. Jika tujuannya memprediksi kapan air melewati batas itu, model machine learning dapat mempelajari hubungan antara riwayat sensor dan level air berikutnya.
>
> Deep learning adalah bagian dari machine learning yang memakai jaringan saraf berlapis. Pendekatan ini layak dipertimbangkan jika masukan berupa gambar kamera, karena lapisan tersebut dapat mengenali pola visual tanpa aturan yang ditulis manual.
>
> Dalam AI Systems, model hanya menjadi satu komponen aplikasi. Backend mengambil data terbaru, menjalankan prediksi, lalu menerapkan aturan untuk menentukan kapan peringatan dikirim.

This example shows how to split by idea. It does not set a fixed shape: paragraph length, sentence length, and the order of claim and example should differ across a page.
