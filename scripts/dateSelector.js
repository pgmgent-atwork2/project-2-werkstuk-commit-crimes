const yearSelect = document.getElementById("year-select");
const currentYear = new Date().getFullYear();

// Add years in descending order
for (let year = currentYear; year >= 1926; year--) {
  const option = new Option(year, year);
  yearSelect.add(option);
}
