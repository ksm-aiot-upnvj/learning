const API_URL = '/api/devices';

const form = document.querySelector('#device-form');
const formTitle = document.querySelector('#form-title');
const deviceIdInput = document.querySelector('#device-id');
const submitButton = document.querySelector('#submit-button');
const cancelButton = document.querySelector('#cancel-button');
const filterStatus = document.querySelector('#filter-status');
const deviceList = document.querySelector('#device-list');
const deviceCount = document.querySelector('#device-count');
const message = document.querySelector('#message');

async function request(url, options) {
  const response = await fetch(url, options);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Permintaan gagal.');
  }

  return result;
}

function addCell(row, value) {
  const cell = document.createElement('td');
  cell.textContent = value ?? '-';
  row.append(cell);
  return cell;
}

function renderDevices(devices) {
  deviceList.replaceChildren();
  deviceCount.textContent = String(devices.length);

  if (devices.length === 0) {
    const row = document.createElement('tr');
    const cell = addCell(row, 'Belum ada perangkat untuk ditampilkan.');
    cell.colSpan = 7;
    cell.className = 'empty-state';
    deviceList.append(row);
    return;
  }

  for (const device of devices) {
    const row = document.createElement('tr');
    const nameCell = addCell(row, device.name);
    nameCell.className = 'device-name';
    addCell(row, device.location);

    const statusCell = document.createElement('td');
    const badge = document.createElement('span');
    const status = ['online', 'offline', 'maintenance'].includes(device.status)
      ? device.status
      : 'offline';
    badge.className = `badge badge-${status}`;
    badge.textContent = status;
    statusCell.append(badge);
    row.append(statusCell);

    addCell(row, `${device.sensorData?.temperature ?? '-'} °C`);
    addCell(row, `${device.sensorData?.humidity ?? '-'} %`);
    addCell(row, device.updatedAt ? new Date(device.updatedAt).toLocaleString('id-ID') : '-');

    const actionCell = document.createElement('td');
    actionCell.className = 'actions';
    for (const [action, label, style] of [
      ['edit', 'Edit', 'secondary'],
      ['delete', 'Hapus', 'danger'],
    ]) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `button small ${style}`;
      button.dataset.action = action;
      button.dataset.id = device._id;
      button.textContent = label;
      actionCell.append(button);
    }
    row.append(actionCell);
    deviceList.append(row);
  }
}

async function loadDevices() {
  message.textContent = 'Memuat perangkat…';
  try {
    const query = filterStatus.value
      ? `?status=${encodeURIComponent(filterStatus.value)}`
      : '';
    const result = await request(`${API_URL}${query}`);
    renderDevices(result.data ?? []);
    message.textContent = '';
  } catch (error) {
    deviceList.replaceChildren();
    deviceCount.textContent = '0';
    message.textContent = `Gagal memuat perangkat: ${error.message}`;
  }
}

function resetForm() {
  form.reset();
  deviceIdInput.value = '';
  formTitle.textContent = 'Tambah perangkat';
  submitButton.textContent = 'Tambah perangkat';
  cancelButton.classList.add('hidden');
}

async function editDevice(id) {
  try {
    const result = await request(`${API_URL}/${encodeURIComponent(id)}`);
    const device = result.data;
    deviceIdInput.value = device._id;
    form.elements.name.value = device.name;
    form.elements.location.value = device.location;
    form.elements.status.value = device.status;
    form.elements.temperature.value = device.sensorData?.temperature ?? 0;
    form.elements.humidity.value = device.sensorData?.humidity ?? 0;
    formTitle.textContent = `Edit ${device.name}`;
    submitButton.textContent = 'Simpan perubahan';
    cancelButton.classList.remove('hidden');
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) {
    message.textContent = `Gagal membuka perangkat: ${error.message}`;
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const id = deviceIdInput.value;
  const payload = {
    name: form.elements.name.value.trim(),
    location: form.elements.location.value.trim(),
    status: form.elements.status.value,
    sensorData: {
      temperature: Number(form.elements.temperature.value),
      humidity: Number(form.elements.humidity.value),
    },
  };

  try {
    const result = await request(id ? `${API_URL}/${encodeURIComponent(id)}` : API_URL, {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    resetForm();
    await loadDevices();
    message.textContent = result.message || 'Perubahan tersimpan.';
  } catch (error) {
    message.textContent = `Gagal menyimpan perangkat: ${error.message}`;
  }
});

deviceList.addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  if (button.dataset.action === 'edit') {
    await editDevice(button.dataset.id);
    return;
  }

  const row = button.closest('tr');
  const name = row?.querySelector('.device-name')?.textContent || 'perangkat ini';
  if (!window.confirm(`Hapus ${name}?`)) return;

  try {
    const result = await request(`${API_URL}/${encodeURIComponent(button.dataset.id)}`, {
      method: 'DELETE',
    });
    if (deviceIdInput.value === button.dataset.id) resetForm();
    await loadDevices();
    message.textContent = result.message || 'Perangkat dihapus.';
  } catch (error) {
    message.textContent = `Gagal menghapus perangkat: ${error.message}`;
  }
});

cancelButton.addEventListener('click', resetForm);
filterStatus.addEventListener('change', loadDevices);
document.querySelector('#refresh-button').addEventListener('click', loadDevices);
loadDevices();
