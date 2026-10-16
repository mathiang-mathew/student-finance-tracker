// App state: the single list of expenses
export const records = [];

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
