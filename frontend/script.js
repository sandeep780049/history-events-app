// Load events from backend
async function loadEvents() {
  const month = document.getElementById("month").value;
  const day = document.getElementById("day").value;

  const res = await fetch(`/events/${month}/${day}`);
  if (!res.ok) {
    alert("Error loading events");
    return;
  }

  const events = await res.json();
  const resultDiv = document.getElementById("results");
  resultDiv.innerHTML = '';

  if (events.length === 0) {
    resultDiv.innerHTML = "<p>No events found.</p>";
    return;
  }

  events.forEach(e => {
    resultDiv.innerHTML += `<p><strong>${e.year}</strong>: ${e.description}</p>`;
  });
}

// Load quiz
async function loadQuiz() {
  const res = await fetch('/quiz');
  const quiz = await res.json();

  const quizContainer = document.getElementById('quizContainer');
  quizContainer.innerHTML = '';

  quiz.forEach((q, idx) => {
    const qDiv = document.createElement('div');
    qDiv.classList.add('quiz-question');
    qDiv.innerHTML = `<p><strong>Q${idx + 1}:</strong> ${q.question}</p>`;
    q.options.forEach(opt => {
      qDiv.innerHTML += `
        <label>
          <input type="radio" name="q${idx}" value="${opt}"> ${opt}
        </label><br>`;
    });
    quizContainer.appendChild(qDiv);
  });

  const submitBtn = document.createElement('button');
  submitBtn.textContent = 'Submit Quiz';
  submitBtn.onclick = () => {
    let score = 0;
    quiz.forEach((q, idx) => {
      const selected = document.querySelector(`input[name="q${idx}"]:checked`);
      if (selected && selected.value === q.answer) score++;
    });
    alert(`✅ You scored ${score} / ${quiz.length}`);
  };
  quizContainer.appendChild(submitBtn);
}
