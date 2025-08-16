// ✅ Load events when user clicks "Load Events"
async function loadEvents() {
  const month = document.getElementById("monthSelect").value;
  const day = document.getElementById("dayInput").value;

  if (!month || !day) {
    alert("Please select both month and day!");
    return;
  }

  try {
    const res = await fetch(`/events?month=${month}&day=${day}`);
    if (!res.ok) throw new Error("Failed to fetch events");

    const events = await res.json();
    const eventsContainer = document.getElementById("eventsContainer");
    eventsContainer.innerHTML = "";

    if (events.length === 0) {
      eventsContainer.innerHTML = "<p>No events found.</p>";
      return;
    }

    events.forEach(ev => {
      const div = document.createElement("div");
      div.className = "event-card";
      div.innerHTML = `<strong>${ev.year}</strong>: ${ev.text}`;
      eventsContainer.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    alert("Error loading events.");
  }
}

// ✅ Load quiz when user clicks "Take Quiz"
async function loadQuiz() {
  try {
    const res = await fetch("/quiz");
    if (!res.ok) throw new Error("Failed to load quiz");

    const quiz = await res.json();
    const quizContainer = document.getElementById("quizContainer");
    quizContainer.innerHTML = "";

    quiz.forEach((q, idx) => {
      const qDiv = document.createElement("div");
      qDiv.className = "quiz-card";

      qDiv.innerHTML = `<p><strong>Q${idx + 1}:</strong> ${q.question}</p>`;

      q.options.forEach(opt => {
        qDiv.innerHTML += `
          <label>
            <input type="radio" name="q${idx}" value="${opt}"> ${opt}
          </label><br>
        `;
      });

      quizContainer.appendChild(qDiv);
    });

    // ✅ Submit Button
    const submitBtn = document.createElement("button");
    submitBtn.textContent = "Submit Quiz";
    submitBtn.className = "submit-btn";
    submitBtn.onclick = () => {
      let score = 0;
      quiz.forEach((q, idx) => {
        const selected = document.querySelector(
          `input[name="q${idx}"]:checked`
        );
        if (selected && selected.value === q.answer) score++;
      });
      alert(`You scored ${score} / ${quiz.length}`);
    };
    quizContainer.appendChild(submitBtn);

  } catch (err) {
    console.error(err);
    alert("Error loading quiz.");
  }
}
