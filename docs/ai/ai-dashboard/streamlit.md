# Streamlit

Streamlit mengubah script Python menjadi aplikasi web. Cocok untuk menyusun panel data sensor, grafik, filter, dan input interaktif tanpa menulis komponen frontend satu per satu.

## Siapkan proyek

Di PowerShell:

```powershell
mkdir streamlit-dashboard
Set-Location streamlit-dashboard
uv init
uv add streamlit pandas joblib
New-Item app.py
```

Isi `app.py`:

```python
import pandas as pd
import streamlit as st

st.title("Kondisi Rumah Kaca")

readings = pd.DataFrame(
    {
        "waktu": ["08.00", "09.00", "10.00", "11.00"],
        "kelembapan_tanah": [42, 38, 31, 27],
        "suhu": [26.1, 27.4, 29.0, 30.2],
    }
)

minimum = st.slider("Batas kelembapan tanah (%)", 10, 60, 30)
latest = readings.iloc[-1]

left, right = st.columns(2)
left.metric("Kelembapan terakhir", f"{latest['kelembapan_tanah']}%")
right.metric("Suhu terakhir", f"{latest['suhu']} °C")

st.line_chart(readings.set_index("waktu"))

if latest["kelembapan_tanah"] < minimum:
    st.warning("Kelembapan di bawah batas yang dipilih.")
else:
    st.success("Kelembapan berada di atas batas.")
```

Jalankan:

```powershell
uv run streamlit run app.py
```

Contoh ini memakai aturan ambang dan data contoh, belum menjalankan model AI. Tujuannya menunjukkan hubungan widget, data, dan tampilan.

## Apa yang terjadi saat widget berubah?

Secara bawaan, Streamlit menjalankan ulang script dari atas ketika pengguna mengubah widget. Untuk nilai yang harus bertahan selama interaksi, gunakan `st.session_state`. Untuk menghindari pemuatan model berulang, `st.cache_resource` dapat menyimpan objek model dalam satu proses aplikasi.

Jika model scikit-learn sudah disimpan sebagai `model.joblib`, muat satu kali dengan cache resource:

```python
import joblib


@st.cache_resource
def load_model():
    return joblib.load("model.joblib")


model = load_model()
prediction = model.predict([[27, 30.2]])
st.write("Prediksi model:", prediction[0])
```

Urutan fitur `[27, 30.2]` harus sama dengan urutan fitur saat model dilatih. Simpan kredensial atau data rahasia di konfigurasi server, bukan di script yang dibagikan.

Rujukan: [konsep dasar dan alur Streamlit](https://docs.streamlit.io/get-started/fundamentals/main-concepts), [Session State](https://docs.streamlit.io/develop/concepts/architecture/session-state), [chat elements](https://docs.streamlit.io/develop/api-reference/chat).

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-database:</span> **Hubungkan dashboard ke data sensor** <span class="ai-practice-description">Telusuri satu kiriman sensor dari PostgreSQL sampai tampil pada dashboard berbasis Vue.</span>](../../hands-on/dashboard-hands-on.md){ .ai-practice-start }

[<span class="ai-practice-icon" aria-hidden="true">:lucide-flask-conical:</span> **Gradio untuk demo fungsi model** <span class="ai-practice-description">Jika ingin mendemokan satu fungsi inference, coba antarmuka yang langsung menerima masukan dan menampilkan hasil.</span>](gradio.md)

</div>
