// Storage: saves records and settings in the browser (localStorage),
// so they are still there after a refresh or when the browser is reopened.

const RECORDS_KEY = "sft:records";
const SETTINGS_KEY = "sft:settings";

// Reads one saved value. Returns the fallback if nothing is saved
// or the saved text is broken, so a bad value can never crash the app.
function load(key, fallback) {
  try {
    const text = localStorage.getItem(key);
    return text ? JSON.parse(text) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be full or blocked (e.g. private mode); the app still works.
  }
}

export function loadRecords() {
  const saved = load(RECORDS_KEY, []);
  return Array.isArray(saved) ? saved : [];
}

export function saveRecords(records) {
  save(RECORDS_KEY, records);
}

export function loadSettings() {
  return load(SETTINGS_KEY, {});
}

export function saveSettings(settings) {
  save(SETTINGS_KEY, settings);
}