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

    //Actions cell with a Delete button.
    const actionsCell = document.createElement("td");
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn-secondary";
    deleteBtn.textContent = "Delete";
    deleteBtn.dataset.action = "delete";
    deleteBtn.dataset.id = record.id;
    deleteBtn.setAttribute("aria-label", "Delete " + record.description);
    actionsCell.appendChild(deleteBtn);
    row.appendChild(actionsCell);
    tbody.appendChild(row);
  });
}
