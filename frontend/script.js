async function loadEvents() {
  try {
    const month = document.getElementById("month").value;
    const day = document.getElementById("day").value;

    if (!month || !day) {
      alert("Please select a valid date");
      return;
    }

    const res = await fetch(`/events?month=${month}&day=${day}`);
    if (!res.ok) throw new Error("Failed to load events");

    const data = await res.json();

    const eventsContainer = document.getElementById("eventsContainer");
    eventsContainer.innerHTML = "";

    if (data.events && data.events.length > 0) {
      data.events.forEach((event) => {
        const p = document.createElement("p");
        p.textContent = event;
        eventsContainer.appendChild(p);
      });
    } else {
      eventsContainer.textContent = "No events found for this date.";
    }
  } catch (err) {
    console.error(err);
    alert("Error loading events");
  }
}
