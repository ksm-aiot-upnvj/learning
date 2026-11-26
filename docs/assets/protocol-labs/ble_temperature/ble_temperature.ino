/* AI Generated */
#include <BLEDevice.h>
#include <BLE2902.h>

constexpr auto DEVICE_NAME = "AIoT Suhu";
constexpr auto SERVICE_UUID = "3ca53c17-ebaf-42ef-a94c-1e572376f521";
constexpr auto TEMPERATURE_UUID = "3ca53c17-ebaf-42ef-a94c-1e572376f522";

BLEServer* server;
BLECharacteristic* temperature;

class RestartAdvertising : public BLEServerCallbacks {
  void onDisconnect(BLEServer* disconnectedServer) override {
    disconnectedServer->startAdvertising();
  }
};

void setup() {
  BLEDevice::init(DEVICE_NAME);
  server = BLEDevice::createServer();
  server->setCallbacks(new RestartAdvertising());

  auto* service = server->createService(SERVICE_UUID);
  temperature = service->createCharacteristic(
      TEMPERATURE_UUID,
      BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY);
  temperature->addDescriptor(new BLE2902());

  uint8_t initialValue = 26;
  temperature->setValue(&initialValue, sizeof(initialValue));
  service->start();

  // Put the name first in the advertising packet so it is visible in a scan.
  BLEDevice::getAdvertising()->start();
}

void loop() {
  static uint8_t value = 26;
  delay(2000);
  value = value == 29 ? 26 : value + 1;
  temperature->setValue(&value, sizeof(value));
  if (server->getConnectedCount() > 0) {
    temperature->notify();
  }
}
