// UI: draws the records on the page.
const tbody = document.getElementById("records-body");
const table = document.getElementById("records-list");
const emptyMsg = document.getElementById("records-empty");

// Add one cell (<td>) with text to a row.
function addCell(row, text) {
  const td = document.createElement("td");
  td.textContent = text;
  row.appendChild(td);
}
// Makes one action button (Edit or Delete) tagged with the record's id.
function makeButton(label, action, record) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "btn-secondary";
  button.textContent = label;
  button.dataset.action = action;
  button.dataset.id = record.id;
  button.setAttribute("aria-label", label + " " + record.description);
  return button;
}

// Clears the table, then draws one row per record.
export function renderRecords(list) {
  tbody.innerHTML = ""; //remove the old rows first

  // Show the "No expense yet" message only when the list is empty.
  const isEmpty = list.length === 0;
  emptyMsg.hidden = !isEmpty;
  table.hidden = isEmpty;

  list.forEach((record) => {
    const row = document.createElement("tr");
    addCell(row, record.date);
    addCell(row, record.description);
    addCell(row, record.category);
    addCell(row, record.amount.toLocaleString("en-US"));

    // Actions cell with Edit and Delete buttons.
    const actionsCell = document.createElement("td");
    actionsCell.appendChild(makeButton("Edit", "edit", record));
    actionsCell.appendChild(makeButton("Delete", "delete", record));
    row.appendChild(actionsCell);
    tbody.appendChild(row);
  });
}
