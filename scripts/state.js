// App state: the single list of expenses
export const records = [];

// Settings, with sensible defaults
export const settings = {
  rateUsd: 1450, // RWF per 1 USD
  rateUgx: 0.39, // RWF per 1 UGX
  cap: 200000, // monthly spending cap in RWF
};

// Makes a unique ID (timestamp + 4 random digits).
export function makeId() {
  const random = Math.floor(1000 + Math.random() * 9000);
  return "txn_" + Date.now() + "_" + random;
}

// Builds a full record from the form values and adds it to the list.
export function addRecord(description, amount, category, date) {
  const now = new Date().toISOString();
  const record = {
    id: makeId(),
    description: description,
    amount: Number(amount),
    category: category,
    date: date,
    createdAt: now,
    updatedAt: now,
  };
  records.push(record);
  return record;
}

// Removes the records with this id from the list.
export function deleteRecord(id) {
  const index = records.findIndex((record) => record.id === id);
  if (index !== -1) {
    records.splice(index, 1); //remove 1 item at that position
  }
}
// Changes an existing record and stamps the time it was edited.
export function updateRecord(id, description, amount, category, date) {
  const record = records.find((record) => record.id === id);
  if (!record) return; // no record with that id

  record.description = description;
  record.amount = Number(amount);
  record.category = category;
  record.date = date;
  record.updatedAt = new Date().toISOString();
}

// Swaps every record for a new list (used by import, load sample, and page load).
export function replaceRecords(newList) {
  records.splice(0, records.length, ...newList);
}

// Returns a sorted COPY of the list (the original order is left alone).
export function sortRecords(list, sortBy) {
  const copy = [...list];
  if (sortBy === "date-desc") copy.sort((a, b) => b.date.localeCompare(a.date));
  if (sortBy === "date-asc") copy.sort((a, b) => a.date.localeCompare(b.date));
  if (sortBy === "desc-asc")
    copy.sort((a, b) => a.description.localeCompare(b.description));
  if (sortBy === "desc-desc")
    copy.sort((a, b) => b.description.localeCompare(a.description));
  if (sortBy === "amount-desc") copy.sort((a, b) => b.amount - a.amount);
  if (sortBy === "amount-asc") copy.sort((a, b) => a.amount - b.amount);

  return copy;
}
