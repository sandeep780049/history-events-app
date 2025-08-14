document.addEventListener("DOMContentLoaded", () => {
  const monthSelect = document.getElementById("month");
  const yearInput = document.getElementById("year");
  const generateBtn = document.getElementById("generate");
  const resultsDiv = document.getElementById("results");

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Populate month dropdown
  monthSelect.innerHTML = monthNames
    .map((m, i) => `<option value="${i + 1}">${m}</option>`)
    .join("");

  // Fetch and display events
  generateBtn.addEventListener("click", async () => {
    const selectedMonth = parseInt(monthSelect.value, 10);
    const selectedYear = parseInt(yearInput.value, 10);

    if (!selectedMonth || isNaN(selectedYear)) {
      resultsDiv.innerHTML = `<p style="color:red;">Please select month and enter a valid year.</p>`;
      return;
    }

    try {
      const res = await fetch("/events");
      const events = await res.json();

      // Filter events based on month and year
      const filtered = events.filter(ev =>
        parseInt(ev.month, 10) === selectedMonth &&
        parseInt(ev.year, 10) === selectedYear
      );

      if (filtered.length === 0) {
        resultsDiv.innerHTML = `<p style="color:orange;">No events found for ${monthNames[selectedMonth - 1]} ${selectedYear}.</p>`;
      } else {
        resultsDiv.innerHTML = filtered
          .map(ev => `
            <div class="event">
              <strong>${ev.date ? ev.date + " " : ""}${monthNames[selectedMonth - 1]} ${ev.year}</strong>
              <p>${ev.event}</p>
            </div>
          `).join("");
      }
    } catch (err) {
      console.error("Error loading events:", err);
      resultsDiv.innerHTML = `<p style="color:red;">Error loading events.</p>`;
    }
  });
});
