<!-- AI Generated -->
<script setup>
import { onMounted, ref } from "vue";

const readings = ref([]);
const state = ref("loading");

async function loadReadings() {
  state.value = "loading";

  try {
    const response = await fetch("http://127.0.0.1:8000/sensors");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("Respons harus berupa daftar");

    readings.value = data;
    state.value = data.length ? "success" : "empty";
  } catch {
    state.value = "error";
  }
}

onMounted(loadReadings);
</script>

<template>
  <main>
    <h1>Pembacaan sensor</h1>
    <button type="button" :disabled="state === 'loading'" @click="loadReadings">
      Muat ulang
    </button>

    <p v-if="state === 'loading'" role="status">Memuat pembacaan…</p>
    <p v-else-if="state === 'empty'" role="status">Belum ada pembacaan.</p>
    <p v-else-if="state === 'error'" role="alert">Gagal mengambil pembacaan.</p>

    <table v-else>
      <caption>Sepuluh pembacaan terbaru</caption>
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Perangkat</th>
          <th scope="col">Jenis sensor</th>
          <th scope="col">Nilai</th>
          <th scope="col">Waktu simpan</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="reading in readings" :key="reading.id">
          <td>{{ reading.id }}</td>
          <td>{{ reading.device_id }}</td>
          <td>{{ reading.sensor_type }}</td>
          <td>{{ reading.value }} {{ reading.unit }}</td>
          <td>{{ new Date(reading.recorded_at).toLocaleString("id-ID") }}</td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<style scoped>
main {
  max-width: 48rem;
  margin: 2rem auto;
  padding: 0 1rem;
}

button {
  margin-block-end: 1rem;
  padding: 0.45rem 0.75rem;
}

table {
  display: block;
  overflow-x: auto;
  border-collapse: collapse;
  font-variant-numeric: tabular-nums;
}

caption {
  text-align: left;
  padding-block-end: 0.5rem;
}

th,
td {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid #bbb;
  text-align: left;
  white-space: nowrap;
}
</style>
