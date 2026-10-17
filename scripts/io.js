// Import and export: checks JSON files before trusting them, and downloads backups.
import { PATTERNS } from "./validators.js";

// Checks one record from a file. Returns "" if it is valid, or the reason it is not.
function checkRecord(record, index) {
  const where = "Record " + (index + 1) + ": ";
  if (typeof record !== "object" || record === null) {
    return where + "is not an object.";
  }
  if (typeof record.id !== "string" || !/^txn_\d+_\d+$/.test(record.id)) {
    return where + "has a missing or invalid id.";
  }
  if (
    typeof record.description !== "string" ||
    !PATTERNS.description.test(record.description)
  ) {
    return where + "has a missing or invalid description.";
  }
  if (
    typeof record.amount !== "number" ||
    !PATTERNS.amount.test(String(record.amount))
  ) {
    return where + "has an invalid amount.";
  }
  if (
    typeof record.category !== "string" ||
    !PATTERNS.category.test(record.category)
  ) {
    return where + "has an invalid category.";
  }
  if (typeof record.date !== "string" || !PATTERNS.date.test(record.date)) {
    return where + "has an invalid date (use YYYY-MM-DD).";
  }
  if (
    typeof record.createdAt !== "string" ||
    typeof record.updatedAt !== "string"
  ) {
    return where + "is missing createdAt or updatedAt.";
  }
  return "";
}

// Checks a whole parsed file. Returns { records } if every record is valid, or { error }.
export function validateImport(data) {
  if (!Array.isArray(data)) {
    return { error: "The file must contain a list (array) of records." };
  }

  const seenIds = new Set();
  for (let i = 0; i < data.length; i++) {
    const problem = checkRecord(data[i], i);
    if (problem) return { error: problem };
    if (seenIds.has(data[i].id)) {
      return { error: "Record " + (i + 1) + ": duplicate id." };
    }
    seenIds.add(data[i].id);
  }
  return { records: data };
}

// Downloads the records as a .json file, e.g. "finance-records-2026-10-17.json".
export function exportRecords(records) {
  const json = JSON.stringify(records, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download =
    "finance-records-" + new Date().toLocaleDateString("en-CA") + ".json";
  link.click();
  URL.revokeObjectURL(link.href);
}