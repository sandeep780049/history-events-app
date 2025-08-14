document.addEventListener('DOMContentLoaded', () => {
    const monthSelect = document.getElementById('month');
    const yearInput = document.getElementById('year');
    const eventsContainer = document.getElementById('events');
    const loadBtn = document.getElementById('loadEvents');

    loadBtn.addEventListener('click', () => {
        const month = monthSelect.value;
        const year = parseInt(yearInput.value);
        if (!month || !year) {
            eventsContainer.innerHTML = "<p>Please select a month and year.</p>";
            return;
        }

        fetch(`/data/events.json`)
            .then(res => res.json())
            .then(data => {
                const filtered = data.filter(ev =>
                    ev.month.toLowerCase() === month.toLowerCase() &&
                    ev.year === year
                );

                if (filtered.length === 0) {
                    eventsContainer.innerHTML = `<p>No events found for ${month} ${year}</p>`;
                    return;
                }

                eventsContainer.innerHTML = filtered
                    .map(ev => `<div class="event"><strong>${ev.year}</strong> - ${ev.name}</div>`)
                    .join('');
            })
            .catch(err => {
                console.error(err);
                eventsContainer.innerHTML = `<p>Error loading events.</p>`;
            });
    });
});
