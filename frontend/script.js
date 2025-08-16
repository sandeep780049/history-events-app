async function loadEvents() {
  const month = document.getElementById("month").value;
  const day = document.getElementById("day").value;
  const container = document.getElementById("eventsContainer");
  container.innerHTML = "<p>Loading...</p>";

  try {
    const res = await fetch(`/events?month=${month}&day=${day}`);
    if (!res.ok) throw new Error("Failed to load events");

    const data = await res.json();
    container.innerHTML = "";

    if (data.length === 0) {
      container.innerHTML = "<p>No events found for this date.</p>";
      return;
    }

    data.forEach(event => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `<strong>${event.year}</strong>: ${event.text}`;

      // Copy & Download buttons
      const actions = document.createElement("div");
      actions.className = "event-actions";

      const copyBtn = document.createElement("button");
      copyBtn.textContent = "Copy";
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(`${event.year}: ${event.text}`);
        alert("Event copied!");
      };

      const downloadBtn = document.createElement("button");
      downloadBtn.textContent = "Download";
      downloadBtn.onclick = () => {
        const blob = new Blob([`${event.year}: ${event.text}`], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `event-${event.year}.txt`;
        link.click();
      };

      actions.appendChild(copyBtn);
      actions.appendChild(downloadBtn);
      card.appendChild(actions);
      container.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Error loading events.</p>";
  }
}

async function loadQuiz() {
  try {
    const res = await fetch("/quiz");
    if (!res.ok) throw new Error("Failed to load quiz");

    const quiz = await res.json();
    const quizContainer = document.getElementById("quizContainer");
    quizContainer.innerHTML = "";

    quiz.forEach((q, idx) => {
      const qDiv = document.createElement("div");
      qDiv.className = "card";
      qDiv.innerHTML = `<p><strong>Q${idx + 1}:</strong> ${q.question}</p>`;
      q.options.forEach(opt => {
        qDiv.innerHTML += `
          <label>
            <input type="radio" name="q${idx}" value="${opt}"> ${opt}
          </label><br>`;
      });
      quizContainer.appendChild(qDiv);
    });

    const submitBtn = document.createElement("button");
    submitBtn.textContent = "Submit Quiz";
    submitBtn.onclick = () => {
      let score = 0;
      quiz.forEach((q, idx) => {
        const selected = document.querySelector(`input[name="q${idx}"]:checked`);
        if (selected && selected.value === q.answer) score++;
      });
      alert(`✅ You scored ${score} / ${quiz.length}`);
    };
    quizContainer.appendChild(submitBtn);

  } catch (err) {
    console.error(err);
    alert("Error loading quiz");
  }
}
