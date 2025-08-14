document.addEventListener("DOMContentLoaded", () => {
    const monthSelect = document.getElementById("month");
    const yearInput = document.getElementById("year");
    const loadEventsBtn = document.getElementById("loadEvents");
    const eventsContainer = document.getElementById("events");

    const quizContainer = document.getElementById("quiz");
    const loadQuizBtn = document.getElementById("loadQuiz");

    // Load Events
    loadEventsBtn.addEventListener("click", async () => {
        const month = parseInt(monthSelect.value);
        const year = parseInt(yearInput.value);

        try {
            const res = await fetch('/data/events.json');
            const events = await res.json();
            const filtered = events.filter(e => e.month === month && e.year === year);

            eventsContainer.innerHTML = "";
            if (filtered.length === 0) {
                eventsContainer.innerHTML = "<p>No events found.</p>";
                return;
            }
            filtered.forEach(e => {
                const div = document.createElement("div");
                div.classList.add("event");
                div.innerHTML = `<strong>${e.date || ''} ${monthSelect.options[month-1].text} ${e.year}</strong>: ${e.event}`;
                eventsContainer.appendChild(div);
            });
        } catch (err) {
            eventsContainer.innerHTML = `<p>Error loading events.</p>`;
        }
    });async function loadQuiz() {
    try {
        const res = await fetch('/quiz');
        if (!res.ok) throw new Error('Failed to load quiz');

        const quiz = await res.json();

        const quizContainer = document.getElementById('quizContainer');
        quizContainer.innerHTML = '';

        quiz.forEach((q, idx) => {
            const qDiv = document.createElement('div');
            qDiv.innerHTML = `<p><strong>Q${idx + 1}:</strong> ${q.question}</p>`;
            q.options.forEach(opt => {
                qDiv.innerHTML += `
                    <label>
                        <input type="radio" name="q${idx}" value="${opt}"> ${opt}
                    </label><br>`;
            });
            quizContainer.appendChild(qDiv);
        });

        // Submit button
        const submitBtn = document.createElement('button');
        submitBtn.textContent = 'Submit Quiz';
        submitBtn.onclick = () => {
            let score = 0;
            quiz.forEach((q, idx) => {
                const selected = document.querySelector(`input[name="q${idx}"]:checked`);
                if (selected && selected.value === q.answer) score++;
            });
            alert(`You scored ${score} / ${quiz.length}`);
        };
        quizContainer.appendChild(submitBtn);

    } catch (err) {
        console.error(err);
        alert('Error loading quiz');
    }
    }

    // Load Quiz
    loadQuizBtn.addEventListener("click", async () => {
        try {
            const res = await fetch('/data/quiz.json');
            const allQuestions = await res.json();
            const selected = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 5);

            quizContainer.innerHTML = "";
            selected.forEach((q, index) => {
                const qDiv = document.createElement("div");
                qDiv.innerHTML = `<p>${index+1}. ${q.question}</p>`;
                q.options.forEach((opt, i) => {
                    qDiv.innerHTML += `
                        <label>
                            <input type="radio" name="q${index}" value="${i}"> ${opt}
                        </label><br>
                    `;
                });
                quizContainer.appendChild(qDiv);
            });

            const submitBtn = document.createElement("button");
            submitBtn.textContent = "Submit Quiz";
            submitBtn.addEventListener("click", () => {
                let score = 0;
                selected.forEach((q, index) => {
                    const selectedOption = document.querySelector(`input[name="q${index}"]:checked`);
                    if (selectedOption && parseInt(selectedOption.value) === q.answer) {
                        score++;
                    }
                });
                alert(`You scored ${score} / ${selected.length}`);
            });
            quizContainer.appendChild(submitBtn);
        } catch (err) {
            quizContainer.innerHTML = `<p>Error loading quiz.</p>`;
        }
    });
});
