// AI Generated, need human review.

function mountOcr(root) {
  const choice = root.querySelector("select");
  const result = root.querySelector("[data-ocr-result]");
  function update() {
    const value = choice.value === "clean" ? "0,5 bar" : "5 bar";
    result.querySelector("[data-text]").textContent = "Tekanan referensi: " + value;
    result.querySelector("[data-chunk]").textContent = "manual-ps01 · hlm. 1 · PS-01: " + value;
    result.querySelector("[data-answer]").textContent = "Tekanan referensi " + value + " (hlm. 1).";
  }
  choice.addEventListener("change", update);
  update();
}

function mountEmbedding(root) {
  const vectors = [
    { text: "Suhu air meningkat", xy: [0.95, 0.27], code: "TEMP-01" },
    { text: "Air makin hangat", xy: [0.8, 0.6], code: "TEMP-02" },
    { text: "Riwayat keasaman", xy: [0.2, 0.98], code: "PH-01" },
  ];
  const queries = {
    paraphrase: { xy: [0.9, 0.43], keyword: "hangat" },
    code: { xy: [0.91, 0.38], keyword: "TEMP-02" },
  };
  const select = root.querySelector("select");
  const table = root.querySelector("ol");
  const exact = root.querySelector("[data-keyword]");
  const canvas = root.querySelector("canvas");
  const context = canvas.getContext("2d");
  const cosine = ([x, y], [a, b]) => (x * a + y * b) / (Math.hypot(x, y) * Math.hypot(a, b));

  function update() {
    const query = queries[select.value];
    const ranked = vectors.map((entry) => ({ ...entry, score: cosine(entry.xy, query.xy) }))
      .sort((a, b) => b.score - a.score);
    table.replaceChildren(...ranked.slice(0, 2).map((entry) => {
      const item = document.createElement("li");
      item.textContent = entry.code + " · " + entry.text + " · " + entry.score.toFixed(3);
      return item;
    }));
    exact.textContent = vectors.filter((entry) =>
      (entry.code + " " + entry.text).includes(query.keyword)
    ).map((entry) => entry.code).join(", ");
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = "13px sans-serif";
    const styles = getComputedStyle(root);
    const textColor = styles.color;
    const origin = [28, 170];
    const entries = [
      ...vectors.map((vector) => ({ xy: vector.xy, label: vector.code, color: textColor })),
      { xy: query.xy, label: "Kueri", color: "#0b9a9a" },
    ];
    for (const { xy: [x, y], label, color } of entries) {
      const end = [origin[0] + x * 206, origin[1] - y * 144];
      context.strokeStyle = color;
      context.fillStyle = color;
      context.beginPath();
      context.moveTo(...origin);
      context.lineTo(...end);
      context.stroke();
      context.beginPath();
      context.arc(...end, 4, 0, Math.PI * 2);
      context.fill();
      context.fillText(label, end[0] + 6, end[1] - 3);
    }
  }
  select.addEventListener("change", update);
  update();
}

function mountKernel(root) {
  const pixels = [
    [1, 1, 4, 6, 6],
    [1, 2, 4, 6, 5],
    [2, 2, 5, 7, 5],
    [2, 3, 5, 6, 4],
    [3, 3, 5, 5, 4],
  ];
  const kernel = [-1, 0, 1, -1, 0, 1, -1, 0, 1];
  const input = root.querySelector("input");
  const grid = root.querySelector("[data-pixels]");
  const map = root.querySelector("[data-map]");
  const formula = root.querySelector("output");
  const cells = pixels.flat().map((value) => {
    const cell = document.createElement("span");
    cell.textContent = value;
    return cell;
  });
  grid.replaceChildren(...cells);
  const mapCells = Array.from({ length: 9 }, () => document.createElement("span"));
  map.replaceChildren(...mapCells);
  function products(index) {
    const row = Math.floor(index / 3);
    const col = index % 3;
    return kernel.map((weight, offset) => {
      const value = pixels[row + Math.floor(offset / 3)][col + offset % 3];
      return { value, weight, contribution: value * weight };
    });
  }
  function sum(terms) {
    return terms.reduce((total, term) => total + term.contribution, 0);
  }
  function update() {
    const index = Number(input.value);
    const row = Math.floor(index / 3);
    const col = index % 3;
    cells.forEach((cell, offset) => {
      const y = Math.floor(offset / 5);
      const x = offset % 5;
      cell.classList.toggle("is-active", y >= row && y < row + 3 && x >= col && x < col + 3);
    });
    mapCells.forEach((cell, offset) => {
      cell.textContent = offset <= index ? String(sum(products(offset))) : "·";
      cell.classList.toggle("is-active", offset === index);
    });
    const terms = products(index);
    formula.textContent = terms.map(({ value, weight }) => value + "×(" + weight + ")")
      .join(" + ") + " = " + sum(terms);
  }
  input.addEventListener("input", update);
  update();
}

function mountThreshold(root) {
  const scores = [
    [0.95, true], [0.81, true], [0.65, true], [0.49, true], [0.31, true],
    [0.73, false], [0.52, false], [0.30, false], [0.18, false], [0.08, false],
  ];
  const input = root.querySelector("input");
  const output = root.querySelector("output");
  function update() {
    const threshold = Number(input.value);
    const counts = { tp: 0, fp: 0, fn: 0, tn: 0 };
    for (const [score, leak] of scores) {
      const alarm = score >= threshold;
      counts[leak ? (alarm ? "tp" : "fn") : (alarm ? "fp" : "tn")] += 1;
    }
    output.textContent = threshold.toFixed(2);
    for (const [label, count] of Object.entries(counts)) {
      root.querySelector("[data-count='" + label + "']").textContent = count;
    }
    root.querySelector("[data-threshold-result]").textContent =
      "Alarm palsu: " + counts.fp + ". Kebocoran terlewat: " + counts.fn + ".";
  }
  input.addEventListener("input", update);
  update();
}

const labs = { ocr: mountOcr, embedding: mountEmbedding, kernel: mountKernel, threshold: mountThreshold };
function init() {
  for (const root of document.querySelectorAll("[data-ai-concept]")) {
    if (root.dataset.mounted === "true") continue;
    labs[root.dataset.aiConcept]?.(root);
    root.dataset.mounted = "true";
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
if (typeof document$ !== "undefined") document$.subscribe(init);
