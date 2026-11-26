# AI Generated
"""Serve a local browser demo and a short stream of synthetic temperatures."""

from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
from time import sleep
from urllib.parse import urlsplit

PAGE = """<!doctype html>
<html lang="id">
<meta charset="utf-8">
<title>Praktik SSE</title>
<link rel="icon" href="data:,">
<h1>Pembaruan suhu</h1>
<p id="status">Membuka aliran…</p>
<ol id="temperatures"></ol>
<script>
const statusText = document.querySelector("#status");
const temperatures = document.querySelector("#temperatures");
const source = new EventSource("/events");

source.addEventListener("open", () => {
  statusText.textContent = "Aliran terbuka";
});

source.addEventListener("temperature", (event) => {
  const reading = JSON.parse(event.data);
  const item = document.createElement("li");
  item.textContent = reading.value.toLocaleString("id-ID") + " °C";
  temperatures.append(item);
});

source.addEventListener("done", () => {
  source.close();
  statusText.textContent = "Aliran selesai";
});

source.addEventListener("error", () => {
  statusText.textContent = source.readyState === EventSource.CLOSED
    ? "Aliran ditutup"
    : "Mencoba menyambung kembali…";
});
</script>
"""


class DemoHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        path = urlsplit(self.path).path
        if path == "/":
            body = PAGE.encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        elif path == "/events":
            self.stream_temperatures()
        else:
            self.send_error(404)

    def send_event(self, name, data):
        event = f"event: {name}\ndata: {json.dumps(data)}\n\n"
        self.wfile.write(event.encode("utf-8"))
        self.wfile.flush()

    def stream_temperatures(self):
        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream; charset=utf-8")
        self.send_header("Cache-Control", "no-cache")
        self.end_headers()

        try:
            for value in (26.7, 27.1, 26.9):
                self.send_event("temperature", {"value": value})
                sleep(1)
            self.send_event("done", {})
        except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError):
            # The learner closed the stream before it finished.
            return


if __name__ == "__main__":
    with ThreadingHTTPServer(("127.0.0.1", 8002), DemoHandler) as server:
        print("Buka http://127.0.0.1:8002/", flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass
