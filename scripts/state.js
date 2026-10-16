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
