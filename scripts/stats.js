// Stats: works out the dashboard numbers from the records.

// Turns a Date into "YYYY-MM-DD" in the user's own timezone.
function toKey(date) {
  return date.toLocaleDateString("en-CA");
}

// Returns every number the dashboard shows.
export function computeStats(list, cap) {
  const today = toKey(new Date());
  const thisMonth = today.slice(0, 7); // "YYYY-MM"

  // Total spent, all time.
  let total = 0;
  list.forEach((record) => {
    total += record.amount;
  });

  // Spent per category, then the biggest one.
  const byCategory = {};
  list.forEach((record) => {
    byCategory[record.category] =
      (byCategory[record.category] || 0) + record.amount;
  });
  let topCategory = "None yet";
  let topAmount = 0;
  for (const category in byCategory) {
    if (byCategory[category] > topAmount) {
      topCategory = category;
      topAmount = byCategory[category];
    }
  }

  // Spent this calendar month, for the cap.
  let monthTotal = 0;
  list.forEach((record) => {
    if (record.date.startsWith(thisMonth)) monthTotal += record.amount;
  });

  // Spent on each of the last 7 days (oldest first), for the trend chart.
  const last7 = [];
  for (let daysAgo = 6; daysAgo >= 0; daysAgo--) {
    const day = new Date();
    day.setDate(day.getDate() - daysAgo);
    const key = toKey(day);

    let dayTotal = 0;
    list.forEach((record) => {
      if (record.date === key) dayTotal += record.amount;
    });

    last7.push({
      label: day.toLocaleDateString("en-US", { weekday: "short" }),
      date: key,
      total: dayTotal,
    });
  }

  return {
    count: list.length,
    total: total,
    topCategory: topCategory,
    monthTotal: monthTotal,
    remaining: cap - monthTotal,
    cap: cap,
    last7: last7,
  };
}
