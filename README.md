# Student Finance Tracker

A responsive, accessible web app that helps students record their daily spending, search and sort their expenses, and stay within a monthly budget. Built with vanilla HTML, CSS and JavaScript (ES modules), with no frameworks.

**Theme chosen:** Student Finance Tracker (ALU Summative, Building Responsive UI)

## Live Site

https://mathiang-mathew.github.io/student-finance-tracker/

## Demo Video

[Watch the demo (unlisted)](PASTE_YOUR_VIDEO_LINK_HERE)

## Features

- **Add, edit and delete expenses** with a description, amount (RWF), category and date. Delete asks for confirmation first.
- **Live validation** with regex rules. Each error appears as text under its field and is linked to it for screen readers.
- **Custom categories:** choosing "Other" reveals a box to type a one-off category. Categories can also be added or removed in Settings.
- **Records table** that turns into cards on phones.
- **Sorting** by date, description or amount, in either direction.
- **Regex search** across description, category, date and amount, with matches highlighted using `<mark>`, a case-sensitive option, and a friendly message for invalid patterns.
- **Dashboard:** total records, total spent (with USD and UGX equivalents), top category, spending this month, and a bar chart of the last 7 days.
- **Monthly cap:** shows how much is left or how far over the cap you are. The message is announced politely when under the cap and assertively when over it.
- **Settings:** manual exchange rates (RWF per 1 USD, RWF per 1 UGX) and the monthly cap, all validated.
- **Persistence:** records and settings are saved in localStorage and survive a refresh.
- **Import and export** as JSON. Imported files are checked record by record before anything is replaced.
- **Load sample data** from `seed.json` (15 records, including edge cases).
- **Keyboard support** for everything, plus Escape to cancel an edit.

## How to Run

The app uses ES modules, which browsers block when a page is opened directly from the file system (`file://`). Run it through a local server:

1. Clone the repo: `git clone https://github.com/mathiang-mathew/student-finance-tracker.git`
2. Open the folder in VS Code.
3. Right-click `index.html` and choose **Open with Live Server**.
4. Click **Load sample data** in Settings to try the app with 15 records.

## Data Model

Every amount is stored in RWF (the base currency) as a number.

| Field       | Type   | Description                                                         |
| ----------- | ------ | ------------------------------------------------------------------- |
| id          | text   | `txn_` + timestamp + 4 random digits, e.g. `txn_1791831600000_4821` |
| description | text   | What was bought. No spaces at the start or end                      |
| amount      | number | Cost in RWF, at most 2 decimals                                     |
| category    | text   | One of the categories, or a custom one                              |
| date        | text   | The day of the expense, `YYYY-MM-DD`                                |
| createdAt   | text   | ISO date and time, set when the record is first saved               |
| updatedAt   | text   | ISO date and time, updated on every edit                            |

## Regex Catalogue

All patterns live in `scripts/validators.js` and are reused by the import check in `scripts/io.js`.

| Field                     | Pattern                                              | Accepts                          | Rejects                  |
| ------------------------- | ---------------------------------------------------- | -------------------------------- | ------------------------ |
| Description               | `/^\S(?:.*\S)?$/`                                    | `Lunch at cafeteria`             | ` Lunch` (leading space) |
| Amount                    | `/^(0\|[1-9]\d*)(\.\d{1,2})?$/`                      | `2500`, `29000.5`, `0`           | `007`, `12.345`, `-5`    |
| Date                      | `/^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$/` | `2024-02-29`                     | `2026-13-01`             |
| Category                  | `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/`                    | `Food`, `Pocket money`           | `Rent2`                  |
| Duplicate word (advanced) | `/\b(\w+)\s+\1\b/i`                                  | flags `Coffee with with friends` | `Coffee with friends`    |

The duplicate-word rule uses a **back-reference** (`\1`) to find the same word typed twice in a row.

Extra rules: dates in the future are rejected, and exchange rates and the cap must be above 0.

**Search examples:** `^Coffee` (starts with Coffee), `(food|fees)` (either category), `\b(\w+)\s+\1\b` (repeated words).

## Keyboard Map

| Key               | Action                                                       |
| ----------------- | ------------------------------------------------------------ |
| Tab / Shift + Tab | Move forward / back                                          |
| Enter             | Follow a link, press a button, submit a form, add a category |
| Space             | Press a button, tick a checkbox                              |
| Arrow keys        | Change a dropdown choice                                     |
| Escape            | Cancel an edit                                               |

## Accessibility Notes

- Semantic landmarks (`header`, `nav`, `main`, `footer`) and one `section` per screen, each labelled by its heading.
- A "Skip to main content" link appears first when using the keyboard.
- Every input has a visible `<label>`. Errors are text, linked with `aria-describedby`, and fields get `aria-invalid`.
- Invalid fields get a thicker red border as well as the text message, so colour is never the only signal (WCAG 1.4.1).
- Status messages ("Expense saved.", "Expense deleted.", search match counts) use `role="status"` live regions.
- The cap message switches between `aria-live="polite"` and `aria-live="assertive"`.
- The 7-day chart includes a hidden sentence for each day (for example "Wed 2026-10-14: RWF 46,000") so screen readers do not depend on bar heights.
- Edit and Delete buttons have labels that name the expense, such as "Delete Lunch".
- A clear focus outline on every focusable element, and transitions turn off when the user prefers reduced motion.
- Colour contrast checked against WCAG 2.1 AA (4.5:1 for text, 3:1 for input borders).
- User text is always inserted with `textContent`, never `innerHTML`, so typed text cannot run as code.

## Responsive Design

Mobile first, with breakpoints at about 360px (base), 768px and 1024px:

- **Phone:** one column, and the records table becomes cards with labels.
- **768px and up:** header in one row, search controls side by side.
- **1024px and up:** the expense form uses two columns.

Wireframes for 360px and 1024px are in `docs/wireframes/`.

## Settings and Design Decisions

- **Base currency:** RWF. USD and UGX are only used to show converted totals.
- **Default rates (set October 2026, editable):** 1 USD = 1,460 RWF and 1,460 RWF = 3,700 UGX (about 0.39 RWF per UGX).
- **Monthly cap:** 200,000 RWF per calendar month, editable.
- **Default categories:** Food, Books, Transport, Entertainment, Fees, plus "Other" for custom entries.
- **Search uses all fields,** but the dashboard always uses every record, so totals do not change while searching.

## Tests

Open `tests.html` with Live Server (`http://127.0.0.1:5500/tests.html`). It runs 18 assertions against the validators and shows a pass or fail line for each, with a summary at the top.

## Project Structure

```
index.html            Main page
tests.html            Validator tests
seed.json             15 sample records
styles/main.css       All styles
scripts/main.js       Connects the page: events, forms, settings, start-up
scripts/state.js      Records, settings, add, edit, delete, sort
scripts/validators.js Regex patterns and validation rules
scripts/search.js     Safe regex search and highlighting
scripts/ui.js         Draws the records table and category lists
scripts/stats.js      Dashboard calculations
scripts/dashboard.js  Draws the dashboard, cap message and chart
scripts/storage.js    localStorage save and load
scripts/io.js         Import checks and JSON export
docs/                 M1 spec and wireframes
```

## Milestones

| Milestone                                             | Status |
| ----------------------------------------------------- | ------ |
| M1 Spec, data model, a11y plan, wireframes            | Done   |
| M2 Semantic HTML and base CSS                         | Done   |
| M3 Regex validation and tests                         | Done   |
| M4 Records table, sort, regex search, edit and delete | Done   |
| M5 Dashboard, cap and live messages                   | Done   |
| M6 Persistence, settings, import and export           | Done   |
| M7 Polish, README and demo                            | Done   |

## Sources and Credits

- Regex patterns for description, amount, date, category and duplicate words are based on the examples given in the assignment brief.
- Contrast target: WCAG 2.1, Success Criterion 1.4.3 Contrast (Minimum), level AA. https://www.w3.org/TR/WCAG21/#contrast-minimum
- Colours checked with the WebAIM Contrast Checker. https://webaim.org/resources/contrastchecker/
- Skip link pattern from WebAIM, "Skip Navigation" Links. https://webaim.org/techniques/skipnav/
- Colour palette inspired by a finance app concept by Qubstudio. The colours themselves are my own choice.
- Poppins font from Google Fonts, used under the SIL Open Font License.

## Use of AI

I used Claude (Anthropic) as a tutor and coding assistant throughout this project. In the interest of honesty:

- `seed.json` and the accessibility plan in the M1 spec were drafted with Claude and then edited by me.
- The CSS variable structure in `:root` was adapted from a template Claude suggested. The colour choices are my own.
- For M3, Claude explained each concept and gave me code with blanks, which I filled in, typed and debugged myself.
- For M4 to M6 (search, sort, dashboard, persistence, settings, import and export), Claude wrote and tested much of the code, explained each part, and I added it to the project step by step, tested it, fixed my own mistakes and committed it.
- Claude helped draft this README, which I reviewed and edited.

All commits were made by me.
