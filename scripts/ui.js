import { highlight } from "./search.js";

// UI: draws the records on the page.
const tbody = document.getElementById("records-body");
const table = document.getElementById("records-list");
const emptyMsg = document.getElementById("records-empty");

// Adds one cell (<td>) to a row. The label shows on phones, where rows become cards.
function addCell(row, label, content) {
  const td = document.createElement("td");
  td.dataset.label = label;
  td.append(content); // text, or highlighted text from search
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
// regex is the current search (or null); emptyText is shown when nothing is listed.
export function renderRecords(list, regex, emptyText) {
  tbody.innerHTML = ""; // remove the old rows first

  const isEmpty = list.length === 0;
  emptyMsg.hidden = !isEmpty;
  emptyMsg.textContent = emptyText;
  table.hidden = isEmpty;

  list.forEach((record) => {
    const row = document.createElement("tr");
    addCell(row, "Date", record.date);
    addCell(row, "Description", highlight(record.description, regex));
    addCell(row, "Category", highlight(record.category, regex));
    addCell(row, "Amount (RWF)", record.amount.toLocaleString("en-US"));

    // Actions cell with Edit and Delete buttons.
    const actionsCell = document.createElement("td");
    actionsCell.dataset.label = "Actions";
    actionsCell.appendChild(makeButton("Edit", "edit", record));
    actionsCell.appendChild(makeButton("Delete", "delete", record));
    row.appendChild(actionsCell);

    tbody.appendChild(row);
  });
}
