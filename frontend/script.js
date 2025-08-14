function fetchEvents() {
  const month = document.getElementById("month").value;
  const year = document.getElementById("year").value;

  fetch(`/api/events/${month}/${year}`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("events-list");
      container.innerHTML = "";
      if (data.length === 0) {
        container.innerHTML = `<p>No events found for this period.</p>`;
        return;
      }
      data.forEach(ev => {
        const card = document.createElement("div");
        card.classList.add("event-card");
        card.innerHTML = `<strong>${ev.date}</strong><br>${ev.event}`;
        container.appendChild(card);
      });
    });
}

function fetchQuiz() {
  const month = document.getElementById("month").value;
  const year = document.getElementById("year").value;

  fetch(`/api/events/quiz/${month}/${year}`)
    .then(res => res.json())
    .then(quiz => {
      const quizDiv = document.getElementById("quiz");
      quizDiv.innerHTML = "";
      if (!Array.isArray(quiz) || quiz.length === 0) {
        quizDiv.innerHTML = `<p>No quiz available for this period.</p>`;
        return;
      }
      quiz.forEach(q => {
        const div = document.createElement("div");
        div.classList.add("quiz-question");
        div.innerHTML = `<strong>${q.question}</strong><br>` +
          q.options.map(opt => `<button onclick="checkAnswer('${opt}','${q.answer}')">${opt}</button>`).join(" ");
        quizDiv.appendChild(div);
      });
    });
}

function checkAnswer(selected, correct) {
  alert(selected === correct ? "✅ Correct!" : `❌ Wrong! Correct answer: ${correct}`);
}

function downloadEvents() {
  const eventsText = [...document.querySelectorAll(".event-card")]
    .map(card => card.innerText)
    .join("\n\n");
  const blob = new Blob([eventsText], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "events.txt";
  link.click();
}

function copyEvents() {
  const eventsText = [...document.querySelectorAll(".event-card")]
    .map(card => card.innerText)
    .join("\n\n");
  navigator.clipboard.writeText(eventsText)
    .then(() => alert("📋 Events copied to clipboard!"))
    .catch(err => alert("❌ Failed to copy: " + err));
}
