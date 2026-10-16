import {
  validateDescription,
  validateAmount,
  validateDate,
  validateCategory,
} from "./validators.js";
import { records, addRecord, deleteRecord, updateRecord } from "./state.js";
import { renderRecords } from "./ui.js";

// Shows (or clears) the error under an input, and tells screen readers.
function showError(input, message) {
  const errorEl = document.getElementById(input.id + "-error");
  errorEl.textContent = message;
  input.setAttribute("aria-invalid", message ? "true" : "false");
}

// Description: check as the user types.
const descriptionInput = document.getElementById("description");
descriptionInput.addEventListener("input", () => {
  showError(descriptionInput, validateDescription(descriptionInput.value));
});

const amountInput = document.getElementById("amount");
amountInput.addEventListener("input", () => {
  showError(amountInput, validateAmount(amountInput.value));
});

const dateInput = document.getElementById("date");
dateInput.addEventListener("input", () => {
  showError(dateInput, validateDate(dateInput.value));
});
dateInput.max = new Date().toLocaleDateString("en-CA");

//Category: Show the "Specify Category" field when "Other" is choosen.
const categorySelect = document.getElementById("category");
const otherField = document.getElementById("category-other-field");
const otherInput = document.getElementById("category-other");

categorySelect.addEventListener("change", () => {
  showError(categorySelect, validateCategory(categorySelect.value));

  if (categorySelect.value === "Other") {
    otherField.hidden = false;
    otherInput.focus();
  } else {
    otherField.hidden = true;
    otherInput.value = "";
    showError(otherInput, "");
  }
});

// Custom category: check as the user types.
otherInput.addEventListener("input", () => {
  showError(otherInput, validateCategory(otherInput.value));
});

// Save: check every field before accepting the expense.
const form = document.getElementById("expense-form");
const statusEl = document.getElementById("status");
const saveBtn = document.getElementById("save-btn");
let editingId = null; // null = adding a new expense; an id = editing that record

// Puts the form back into "add" mode.
function stopEditing() {
  editingId = null;
  saveBtn.textContent = "Save";
}

form.addEventListener("submit", (event) => {
  event.preventDefault(); // stop the page reload

  const descError = validateDescription(descriptionInput.value);
  const amountError = validateAmount(amountInput.value);
  const dateError = validateDate(dateInput.value);
  const categoryError = validateCategory(categorySelect.value);

  // Only check the custom box when "Other" is chosen.
  let otherError = "";
  if (categorySelect.value === "Other") {
    otherError = validateCategory(otherInput.value);
  }

  showError(descriptionInput, descError);
  showError(amountInput, amountError);
  showError(dateInput, dateError);
  showError(categorySelect, categoryError);
  showError(otherInput, otherError);

  if (descError || amountError || dateError || categoryError || otherError) {
    statusEl.textContent = "Please fix the errors above.";
    return; // stop here
  }
  // Use the typed custom category when "Other" is chosen
  const category =
    categorySelect.value === "Other" ? otherInput.value : categorySelect.value;
  if (editingId) {
    updateRecord(
      editingId,
      descriptionInput.value,
      amountInput.value,
      category,
      dateInput.value,
    );
    statusEl.textContent = "Expense updated.";
  } else {
    addRecord(
      descriptionInput.value,
      amountInput.value,
      category,
      dateInput.value,
    );
    statusEl.textContent = "Expense saved.";
  }

  renderRecords(records);
  form.reset(); // clear the form
  otherField.hidden = true; // hide the "Specify Category" box again
  stopEditing(); // back to "add" mode
});
// Cancel: clear the form and every error message.
const cancelBtn = document.getElementById("cancel-btn");

cancelBtn.addEventListener("click", () => {
  form.reset();
  stopEditing(); //leave edit mode if we were editing
  otherField.hidden = true;

  showError(descriptionInput, "");
  showError(amountInput, "");
  showError(dateInput, "");
  showError(categorySelect, "");
  showError(otherInput, "");

  statusEl.textContent = "Form cleared.";
  descriptionInput.focus(); // put the cursor back at the start
});

// Delete: one listener on the table body handles every Delete button.
const recordsBody = document.getElementById("records-body");

recordsBody.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return; // the click wasn't on a button

  if (button.dataset.action === "delete") {
    const ok = confirm("Delete this expense?");
    if (!ok) return; // the user pressed Cancel

    deleteRecord(button.dataset.id);
    renderRecords(records);
    statusEl.textContent = "Expense deleted.";
  }
  if (button.dataset.action === "edit") {
    const record = records.find((r) => r.id === button.dataset.id);
    if (!record) return;

    //Copy the record's values into the form.
    descriptionInput.value = record.description;
    amountInput.value = record.amount;
    dateInput.value = record.date;

    // Standard categories go in the dropdown; custom ones go in the "Other" box.
    const standard = ["Food", "Books", "Transport", "Entertainment", "Fees"];
    if (standard.includes(record.category)) {
      categorySelect.value = record.category;
      otherField.hidden = true;
      otherInput.value = "";
    } else {
      categorySelect.value = "Other";
      otherField.hidden = false;
      otherInput.value = record.category;
    }
    editingId = record.id;
    saveBtn.textContent = "Update";
    statusEl.textContent =
      "Editing " +
      record.description +
      ". Change the fields, then press Update.";
    descriptionInput.focus(); // jump the user up to the form
  }
});

// Draw the table once when the page loads.
renderRecords(records);
