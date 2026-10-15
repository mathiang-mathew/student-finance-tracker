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
