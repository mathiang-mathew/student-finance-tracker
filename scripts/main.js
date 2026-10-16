import {
  validateDescription,
  validateAmount,
  validateDate,
  validateCategory,
} from "./validators.js";
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

  statusEl.textContent = "Expense saved.";
  form.reset(); // clear the form
  otherField.hidden = true; // hide the "Specify Category" box again
});

// Cancel: clear the form and every error message.
const cancelBtn = document.getElementById("cancel-btn");

cancelBtn.addEventListener("click", () => {
  form.reset();
  otherField.hidden = true;

  showError(descriptionInput, "");
  showError(amountInput, "");
  showError(dateInput, "");
  showError(categorySelect, "");
  showError(otherInput, "");

  statusEl.textContent = "Form cleared.";
  descriptionInput.focus(); // put the cursor back at the start
});
