// Search: turns what the user types into a safe regex, filters, and highlights.

// Builds a RegExp from the search box. Returns null when the box is empty,
// or { error } when the pattern is not valid, so the app never crashes.

export function compileRegex(text, caseSensitive) {
  if (text === "") return null;
  try {
    return new RegExp(text, caseSensitive ? "" : "i");
  } catch {
    return { error: "That is not a valid pattern. Showing all records." };
  }
}

// Keeps only the records where the pattern matches any visible field.
export function filterRecords(list, regex) {
  if (!regex) return list;
  return list.filter(
    (record) =>
      regex.test(record.description) ||
      regex.test(record.category) ||
      regex.test(record.date) ||
      regex.test(String(record.amount)),
  );
}

// Returns the text as page nodes, with every match wrapped in <mark>.
// Built from text nodes (never innerHTML), so typed text can't run as code.
export function highlight(text, regex) {
  const fragment = document.createDocumentFragment();
  if (!regex) {
    fragment.append(text);
    return fragment;
  }

  const globalRegex = new RegExp(regex.source, regex.flags + "g");
  let lastEnd = 0;
  let match;

  while ((match = globalRegex.exec(text)) !== null) {
    if (match[0] === "") {
      globalRegex.lastIndex++; // skip empty matches like "a*" so the loop ends
      continue;
    }
    fragment.append(text.slice(lastEnd, match.index));
    const mark = document.createElement("mark");
    mark.textContent = match[0];
    fragment.append(mark);
    lastEnd = match.index + match[0].length;
  }
  fragment.append(text.slice(lastEnd));
  return fragment;
}
