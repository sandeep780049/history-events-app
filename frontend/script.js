// Load Historical Events
async function loadEvents() {
    const day = document.getElementById("day").value;
    const month = document.getElementById("month").value;

    if (!day || !month) {
        alert("Please enter both day and month!");
        return;
    }

    try {
        const res = await fetch(`/events?day=${day}&month=${month}`);
        if (!res.ok) throw new Error("Failed to fetch events");

        const events = await res.json();
        const container = document.getElementById("eventsContainer");
        container.innerHTML = "";

        if (events.length === 0) {
            container.innerHTML = "<p>No events found.</p>";
            return;
        }

        events.forEach(ev => {
            const div = document.createElement("div");
            div.classList.add("event-item");
            div.innerHTML = `<strong>${ev.year}:</strong> ${ev.description}`;
            container.appendChild(div);
        });

    } catch (err) {
        console.error(err);
        alert("Error loading events.");
    }
}

// Load UPSC Quiz
async function loadQuiz() {
    try {
        const res = await fetch("/quiz");
        if (!res.ok) throw new Error("Failed to load quiz");

        const quiz = await res.json();
        const container = document.getElementById("quizContainer");
        container.innerHTML = "";

        quiz.forEach((q, idx) => {
            const qDiv = document.createElement("div");
            qDiv.classList.add("quiz-question");

            qDiv.innerHTML = `<p><strong>Q${idx + 1}:</strong> ${q.question}</p>`;

            q.options.forEach(opt => {
                qDiv.innerHTML += `
                    <label>
                        <input type="radio" name="q${idx}" value="${opt}"> ${opt}
                    </label><br>
                `;
            });

            container.appendChild(qDiv);
        });

        const submitBtn = document.createElement("button");
        submitBtn.textContent = "Submit Quiz";
        submitBtn.onclick = () => {
            let score = 0;
            quiz.forEach((q, idx) => {
                const selected = document.querySelector(`input[name="q${idx}"]:checked`);
                if (selected && selected.value === q.answer) {
                    score++;
                }
            });
            alert(`✅ You scored ${score} / ${quiz.length}`);
        };

        container.appendChild(submitBtn);

    } catch (err) {
        console.error(err);
        alert("Error loading quiz.");
    }
}
