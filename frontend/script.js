function fetchEvents() {
  const month = document.getElementById("month").value;
  const year = document.getElementById("year").value;

  fetch(`/api/events/${month}/${year}`)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("events-list");
      list.innerHTML = "";
      data.forEach(ev => {
        const li = document.createElement("li");
        li.textContent = `${ev.date}: ${ev.event}`;
        list.appendChild(li);
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
  const eventsText = document.getElementById("events-list").innerText;
  const blob = new Blob([eventsText], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "events.txt";
  link.click();
}
