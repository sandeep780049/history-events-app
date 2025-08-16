// Load events for selected month & day
async function loadEvents() {
    try {
        const month = document.getElementById("month").value;
        const day = document.getElementById("day").value;

        if (!month || !day) {
            alert("Please select both month and day!");
            return;
        }

        const res = await fetch(`/events/${month}/${day}`);
        if (!res.ok) throw new Error("Failed to load events");

        const events = await res.json();
        const eventsContainer = document.getElementById("eventsContainer");
        eventsContainer.innerHTML = "";

        if (events.length === 0) {
            eventsContainer.innerHTML = "<p>No events found for this date.</p>";
            return;
        }

        events.forEach(ev => {
            const div = document.createElement("div");
            div.classList.add("event");
            div.innerHTML = `<strong>${ev.year}</strong> — ${ev.description}`;
            eventsContainer.appendChild(div);
        });

    } catch (err) {
        console.error(err);
        alert("Error loading events");
    }
}

// Load quiz
async function loadQuiz() {
    try {
        const res = await fetch("/quiz");
        if (!res.ok) throw new Error("Failed to load quiz");

        const quiz = await res.json();
        const quizContainer = document.getElementById("quizContainer");
        quizContainer.innerHTML = "";

        quiz.forEach((q, idx) => {
            const qDiv = document.createElement("div");
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
            let result = "";
            quiz.forEach((q, idx) => {
                const selected = document.querySelector(`input[name="q${idx}"]:checked`);
                if (selected && selected.value === q.answer) {
                    score++;
                    result += `Q${idx + 1}: ✅ Correct<br>`;
                } else {
                    result += `Q${idx + 1}: ❌ Wrong (Correct: ${q.answer})<br>`;
                }
            });
            result += `<p><strong>You scored ${score} / ${quiz.length}</strong></p>`;
            quizContainer.innerHTML += `<div class="result">${result}</div>`;
        };
        quizContainer.appendChild(submitBtn);

    } catch (err) {
        console.error(err);
        alert("Error loading quiz");
    }
}
