const DEFAULTS = {
  imageData: null,
  darkness: 0.4,
  hue: 0,
  saturation: 100,
  brightness: 100,
  blur: 0
};

const defaultImageUrl = chrome.runtime.getURL("banner.png");

const els = {
  preview: document.getElementById("preview"),
  chooseBtn: document.getElementById("chooseBtn"),
  defaultBtn: document.getElementById("defaultBtn"),
  resetBtn: document.getElementById("resetBtn"),
  fileInput: document.getElementById("fileInput"),
  darkness: document.getElementById("darkness"),
  blur: document.getElementById("blur"),
  hue: document.getElementById("hue"),
  saturation: document.getElementById("saturation"),
  brightness: document.getElementById("brightness"),
  darknessVal: document.getElementById("darknessVal"),
  blurVal: document.getElementById("blurVal"),
  hueVal: document.getElementById("hueVal"),
  saturationVal: document.getElementById("saturationVal"),
  brightnessVal: document.getElementById("brightnessVal")
};

let state = { ...DEFAULTS };

function renderControls() {
  els.darkness.value = Math.round(state.darkness * 100);
  els.blur.value = state.blur;
  els.hue.value = state.hue;
  els.saturation.value = state.saturation;
  els.brightness.value = state.brightness;

  els.darknessVal.textContent = `${Math.round(state.darkness * 100)}%`;
  els.blurVal.textContent = `${state.blur}px`;
  els.hueVal.innerHTML = `${state.hue}&deg;`;
  els.saturationVal.textContent = `${state.saturation}%`;
  els.brightnessVal.textContent = `${state.brightness}%`;

  const img = state.imageData || defaultImageUrl;
  els.preview.style.backgroundImage = `url("${img}")`;
  els.preview.style.filter = `blur(${Math.min(state.blur, 8)}px) hue-rotate(${state.hue}deg) saturate(${state.saturation}%) brightness(${state.brightness}%)`;
}

function save() {
  chrome.storage.local.set(state);
}

function load() {
  chrome.storage.local.get(null, (stored) => {
    state = { ...DEFAULTS, ...(stored || {}) };
    renderControls();
  });
}

// Sliders
els.darkness.addEventListener("input", () => {
  state.darkness = els.darkness.value / 100;
  renderControls();
  save();
});
els.blur.addEventListener("input", () => {
  state.blur = Number(els.blur.value);
  renderControls();
  save();
});
els.hue.addEventListener("input", () => {
  state.hue = Number(els.hue.value);
  renderControls();
  save();
});
els.saturation.addEventListener("input", () => {
  state.saturation = Number(els.saturation.value);
  renderControls();
  save();
});
els.brightness.addEventListener("input", () => {
  state.brightness = Number(els.brightness.value);
  renderControls();
  save();
});

// Photo picker
els.chooseBtn.addEventListener("click", () => els.fileInput.click());
els.fileInput.addEventListener("change", () => {
  const file = els.fileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    state.imageData = reader.result;
    renderControls();
    save();
  };
  reader.readAsDataURL(file);
});

els.defaultBtn.addEventListener("click", () => {
  state.imageData = null;
  renderControls();
  save();
});

els.resetBtn.addEventListener("click", () => {
  state = { ...DEFAULTS };
  renderControls();
  save();
});

load();
