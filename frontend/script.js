// frontend/script.js
async function loadEvents() {
  const month = document.getElementById("month").value;
  const day = document.getElementById("day").value;

  if (!day) {
    alert("Please enter a valid day (1-31)");
    return;
  }

  try {
    const res = await fetch(`/events/${month}/${day}`);
    if (!res.ok) throw new Error("Failed to fetch events");

    const events = await res.json();
    const container = document.getElementById("eventsContainer");
    container.innerHTML = "";

    if (events.length === 0) {
      container.innerHTML = "<p>No events found for this date.</p>";
      return;
    }

    events.forEach(ev => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `<strong>${ev.year}</strong> - ${ev.description}`;
      container.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    alert("Error loading events");
  }
}

// 🔹 Simple quiz demo
function loadQuiz() {
  const quiz = [
    { q: "Who was the first President of India?", options: ["Nehru", "Rajendra Prasad", "Ambedkar"], answer: "Rajendra Prasad" },
    { q: "When did India get independence?", options: ["1945", "1947", "1950"], answer: "1947" },
    { q: "Who discovered gravity?", options: ["Einstein", "Newton", "Galileo"], answer: "Newton" },
    { q: "In which year did World War II end?", options: ["1942", "1945", "1950"], answer: "1945" },
    { q: "Who wrote the Ramayana?", options: ["Valmiki", "Vyasa", "Tulsidas"], answer: "Valmiki" }
  ];

  const container = document.getElementById("quizContainer");
  container.innerHTML = "";

  quiz.forEach((q, idx) => {
    const div = document.createElement("div");
    div.innerHTML = `<p><b>Q${idx + 1}:</b> ${q.q}</p>`;
    q.options.forEach(opt => {
      div.innerHTML += `
        <label>
          <input type="radio" name="q${idx}" value="${opt}"> ${opt}
        </label><br>`;
    });
    container.appendChild(div);
  });

  const btn = document.createElement("button");
  btn.textContent = "Submit Quiz";
  btn.onclick = () => {
    let score = 0;
    quiz.forEach((q, idx) => {
      const selected = document.querySelector(`input[name="q${idx}"]:checked`);
      if (selected && selected.value === q.answer) score++;
    });
    alert(`✅ You scored ${score}/${quiz.length}`);
  };
  container.appendChild(btn);
}
