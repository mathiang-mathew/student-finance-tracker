// Validation rules. Patterns for description, amount, date, category
//are from the assignment brief
export const PATTERNS = {
  description: /^\S(?:.*\S)?$/,
  amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
  date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
  category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
  duplicateWord: /\b(\w+)\s+\1\b/i,
};
// Returns "" when valid, or an error message when not.
export function validateAmount(value) {
  if (value === "") {
    return "Amount is required.";
  }
  if (!PATTERNS.amount.test(value)) {
    return "Enter a number like 2500 or 2500.50 (no commas, up to 2 decimals).";
  }
  return "";
}

export function validateDescription(value) {
  if (value === "") {
    return "A valid description is required.";
  }
  if (!PATTERNS.description.test(value)) {
    return "Remove the spaces at the start or end of the description.";
  }
  if (PATTERNS.duplicateWord.test(value)) {
    return "Remove the repeated word.";
  }
  return "";
}
export function validateDate(value) {
  if (value === "") {
    return "A valid date is required.";
  }
  if (!PATTERNS.date.test(value)) {
    return "Enter the date as YYYY-MM-DD, for example 2026-10-15.";
  }
  // Block future dates
  const today = new Date().toLocaleDateString("en-CA");
  if (value > today) {
    return "The date cannot be in the future.";
  }
  return "";
}
export function validateCategory(value) {
  if (value === "") {
    return "A valid category is required.";
  }
  if (!PATTERNS.category.test(value)) {
    return "Letters only, words separated by a single space or hyphen.";
  }
  return "";
}
