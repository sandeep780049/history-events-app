document.addEventListener("DOMContentLoaded", () => {
    const monthSelect = document.getElementById("month");
    const yearSelect = document.getElementById("year");
    const eventsContainer = document.getElementById("events");

    // Load events.json from backend
    fetch("/events")
        .then(res => res.json())
        .then(events => {
            // Populate year dropdown dynamically
            const years = [...new Set(events.map(e => e.year))].sort((a, b) => a - b);
            years.forEach(y => {
                const option = document.createElement("option");
                option.value = y;
                option.textContent = y;
                yearSelect.appendChild(option);
            });

            // Handle filter
            function filterEvents() {
                const selectedMonth = parseInt(monthSelect.value);
                const selectedYear = parseInt(yearSelect.value);

                const filtered = events.filter(e => e.month === selectedMonth && e.year === selectedYear);

                eventsContainer.innerHTML = "";
                if (filtered.length === 0) {
                    eventsContainer.textContent = "No events found for this date.";
                } else {
                    filtered.forEach(e => {
                        const div = document.createElement("div");
                        div.textContent = `${e.date}: ${e.event}`;
                        eventsContainer.appendChild(div);
                    });
                }
            }

            monthSelect.addEventListener("change", filterEvents);
            yearSelect.addEventListener("change", filterEvents);
        })
        .catch(err => {
            console.error("Error loading events:", err);
            eventsContainer.textContent = "Failed to load events.";
        });
});
