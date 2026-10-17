// Dashboard: draws the stats, the monthly cap and the 7-day chart.

const emptyMsg = document.getElementById("dashboard-empty");
const content = document.getElementById("dashboard-content");
const capStatus = document.getElementById("cap-status");
const capFill = document.getElementById("cap-fill");
const trend = document.getElementById("trend");

// Formats a number of RWF, e.g. 2400000 -> "RWF 2,400,000".
export function formatRWF(amount) {
  return "RWF " + amount.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

// Converts RWF into another currency using a "RWF per 1 unit" rate.
function convert(amount, rate, code) {
  const value = amount / rate;
  return code + " " + value.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export function renderDashboard(stats, settings) {
  const isEmpty = stats.count === 0;
  emptyMsg.hidden = !isEmpty;
  content.hidden = isEmpty;

  // The four stat cards.
  document.getElementById("stat-count").textContent = stats.count;
  document.getElementById("stat-total").textContent = formatRWF(stats.total);
  document.getElementById("stat-total-converted").textContent =
    "≈ " +
    convert(stats.total, settings.rateUsd, "USD") +
    " · " +
    convert(stats.total, settings.rateUgx, "UGX");
  document.getElementById("stat-top").textContent = stats.topCategory;
  document.getElementById("stat-month").textContent = formatRWF(stats.monthTotal);

  // Monthly cap: polite when under, assertive (interrupts) when over.
  let message;
  if (stats.remaining >= 0) {
    message =
      formatRWF(stats.remaining) +
      " left of your " +
      formatRWF(stats.cap) +
      " monthly cap.";
    capStatus.setAttribute("aria-live", "polite");
    capStatus.className = "cap-under";
  } else {
    message =
      "Over your " +
      formatRWF(stats.cap) +
      " monthly cap by " +
      formatRWF(-stats.remaining) +
      ".";
    capStatus.setAttribute("aria-live", "assertive");
    capStatus.className = "cap-over";
  }
  // Only change the text when it changes, so screen readers don't repeat it.
  if (capStatus.textContent !== message) capStatus.textContent = message;

  const percent = stats.cap > 0 ? (stats.monthTotal / stats.cap) * 100 : 100;
  capFill.style.width = Math.min(percent, 100) + "%";
  capFill.classList.toggle("over", stats.remaining < 0);

  // 7-day chart: one bar per day, height relative to the biggest day.
  trend.innerHTML = "";
  const biggest = Math.max(...stats.last7.map((day) => day.total), 1);
  stats.last7.forEach((day) => {
    const item = document.createElement("li");

    // What screen readers hear, e.g. "Mon 2026-10-12: RWF 2,500".
    const spoken = document.createElement("span");
    spoken.className = "visually-hidden";
    spoken.textContent = day.label + " " + day.date + ": " + formatRWF(day.total);

    // What sighted users see: amount, bar, day name (hidden from screen readers).
    const amount = document.createElement("span");
    amount.className = "bar-amount";
    amount.setAttribute("aria-hidden", "true");
    amount.textContent = day.total.toLocaleString("en-US");

    const track = document.createElement("span"); // the space the bar grows in
    track.className = "bar-track";
    track.setAttribute("aria-hidden", "true");
    const bar = document.createElement("span");
    bar.className = "bar";
    bar.style.height = (day.total / biggest) * 100 + "%";
    track.appendChild(bar);

    const label = document.createElement("span");
    label.className = "bar-label";
    label.setAttribute("aria-hidden", "true");
    label.textContent = day.label;

    item.append(spoken, amount, track, label);
    trend.appendChild(item);
  });
}