document.getElementById('generateBtn').addEventListener('click', async () => {
  const monthSelect = document.getElementById('month');
  const monthValue = monthSelect.value.trim();
  const yearValue = document.getElementById('year').value.trim();

  // Map month names to numbers
  const monthMap = {
    January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
    July: 7, August: 8, September: 9, October: 10, November: 11, December: 12
  };

  const monthNum = isNaN(monthValue) ? monthMap[monthValue] : parseInt(monthValue, 10);

  // Build API URL
  let query = `/api/events?month=${monthNum}`;
  if (yearValue) {
    query += `&year=${parseInt(yearValue, 10)}`;
  }

  try {
    const res = await fetch(query);
    const events = await res.json();

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    if (!events.length) {
      resultDiv.innerHTML = `<p>No events found for ${monthValue} ${yearValue || ''}</p>`;
      return;
    }

    events.forEach(ev => {
      const div = document.createElement('div');
      div.className = 'event';
      div.innerHTML = `<strong>${ev.date || ''}</strong> - ${ev.event} (${ev.year})`;
      resultDiv.appendChild(div);
    });
  } catch (err) {
    console.error('Error fetching events:', err);
  }
});
