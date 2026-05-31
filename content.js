const DEFAULTS = {
  imageData: null, // data URL; null = use bundled banner.png
  darkness: 0.4, // overlay opacity 0..1
  hue: 0, // deg -180..180
  saturation: 100, // %
  brightness: 100, // %
  blur: 0 // px
};

const defaultImageUrl = chrome.runtime.getURL("banner.png");

function apply(settings) {
  const s = { ...DEFAULTS, ...settings };
  const root = document.documentElement;
  const imgUrl = s.imageData ? s.imageData : defaultImageUrl;

  root.style.setProperty("--custom-bg-url", `url("${imgUrl}")`);
  root.style.setProperty("--custom-bg-darkness", String(s.darkness));
  root.style.setProperty("--custom-bg-hue", `${s.hue}deg`);
  root.style.setProperty("--custom-bg-saturation", `${s.saturation}%`);
  root.style.setProperty("--custom-bg-brightness", `${s.brightness}%`);
  root.style.setProperty("--custom-bg-blur", `${s.blur}px`);

  root.classList.add("custom-roblox-bg");
}

function ensureLayers() {
  if (!document.body) return;
  if (!document.getElementById("custom-roblox-bg-layer")) {
    const layer = document.createElement("div");
    layer.id = "custom-roblox-bg-layer";
    document.body.appendChild(layer);
  }
  if (!document.getElementById("custom-roblox-bg-overlay")) {
    const overlay = document.createElement("div");
    overlay.id = "custom-roblox-bg-overlay";
    document.body.appendChild(overlay);
  }
}

// Apply CSS variables ASAP (document_start).
chrome.storage.local.get(null, (settings) => apply(settings || {}));

// Inject layer elements once the body exists.
if (document.body) {
  ensureLayers();
} else {
  document.addEventListener("DOMContentLoaded", ensureLayers);
}

// Live-update when settings change in the popup.
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;
  chrome.storage.local.get(null, (settings) => apply(settings || {}));
});
