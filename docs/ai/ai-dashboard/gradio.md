# Gradio

Gradio membungkus fungsi Python menjadi demo web. Pengguna mengisi komponen input, Gradio memanggil fungsi, lalu menampilkan nilai yang dikembalikan.

## Buat demo inference

Di PowerShell:

```powershell
mkdir gradio-demo
Set-Location gradio-demo
uv init
uv add gradio
New-Item app.py
```

Isi `app.py`:

```python
import gradio as gr


def predict_condition(moisture: float, temperature: float) -> str:
    # Aturan ini hanya contoh. Ganti dengan pemanggilan model terlatih.
    if moisture < 30 and temperature > 30:
        return "Tanah kering dan suhu tinggi"
    if moisture < 30:
        return "Tanah perlu diperiksa"
    return "Kondisi normal"


demo = gr.Interface(
    fn=predict_condition,
    inputs=[
        gr.Slider(0, 100, value=45, label="Kelembapan tanah (%)"),
        gr.Slider(0, 50, value=28, label="Suhu (°C)"),
    ],
    outputs=gr.Textbox(label="Hasil"),
    title="Demo Kondisi Rumah Kaca",
)

if __name__ == "__main__":
    demo.launch()
```

Jalankan:

```powershell
uv run python app.py
```

Fungsi `predict_condition` berisi aturan sederhana, belum model AI. Saat model sudah tersedia, ganti isi fungsi dengan proses yang sama seperti inference model: siapkan fitur, panggil `model.predict(...)`, lalu kembalikan hasil yang mudah dibaca.

## Interface dan Blocks

`gr.Interface` cocok jika satu fungsi menerima input dan menghasilkan output. Gunakan `gr.Blocks` saat tata letak atau alur interaksi perlu diatur, misalnya tombol menjalankan proses, hasil muncul di beberapa komponen, atau pilihan input mengubah bagian halaman.

Gradio juga menyediakan `gr.ChatInterface` untuk fungsi percakapan. Untuk demo yang dibuka lewat internet, tautan `share=True` bersifat publik. Jangan masukkan data sensor pribadi, API key, atau fungsi yang dapat mengendalikan perangkat penting ke demo publik.

Rujukan: [Quickstart Gradio](https://www.gradio.app/guides/quickstart), [Blocks](https://www.gradio.app/docs/gradio/blocks), [berbagi demo](https://gradio.app/guides/sharing-your-app).

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-search:</span> **Siapkan fungsi tanya jawab dari dokumen** <span class="ai-practice-description">Bangun pipeline RAG sederhana. Gunakan fungsi jawabnya sebagai dasar untuk demo tanya jawab.</span>](../../hands-on/rag-simple.md){ .ai-practice-start }

</div>
