const API_URL = 'http://localhost:3000/api/devices';

const randomFloat = (min, max) => Number((Math.random() * (max - min) + min).toFixed(1));

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const generateDummyDevices = () => [
  {
    name: 'ESP32-Greenhouse-01',
    location: 'Rooftop FIK UPNVJ',
    status: 'online',
    sensorData: {
      temperature: randomFloat(26.0, 33.5),
      humidity: randomInt(65, 88)
    }
  },
  {
    name: 'ESP8266-Hydroponic-02',
    location: 'Lab AIoT Lt. 3',
    status: 'online',
    sensorData: {
      temperature: randomFloat(22.0, 27.5),
      humidity: randomInt(55, 75)
    }
  }
];

async function sendDummyData() {
  console.log('Memulai simulasi streaming sensor IoT (tekan Ctrl + C untuk berhenti)...\n');

  let index = 0;

  while (true) {
    const devices = generateDummyDevices();
    const device = devices[index];

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(device)
      });

      const result = await response.json();
      console.log(
        `[${new Date().toLocaleTimeString()}] [${response.status}] ${device.name} ` +
        `(Temp: ${device.sensorData.temperature}°C, Hum: ${device.sensorData.humidity}%) -> ${result.message}`
      );
    } catch (error) {
      console.error(`Gagal mengirim ${device.name}:`, error.message);
    }

    index = (index + 1) % devices.length;

    await delay(10000);
  }
}

sendDummyData();
