// Load events for selected month & day
async function loadEvents() {
    try {
        const month = document.getElementById("month").value;
        const day = document.getElementById("day").value;

        if (!month || !day) {
            alert("Please select both month and day!");
            return;
        }

        // Hide quiz if showing
        document.getElementById("quizContainer").innerHTML = "";

        const res = await fetch(`/events/${month}/${day}`);
        if (!res.ok) throw new Error("Failed to load events");

        const events = await res.json();
        const eventsContainer = document.getElementById("eventsContainer");
        const actions = document.getElementById("eventActions");
        eventsContainer.innerHTML = "";
        actions.innerHTML = "";

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

        // Copy & Download buttons
        const copyBtn = document.createElement("button");
        copyBtn.textContent = "Copy Events";
        copyBtn.onclick = () => {
            const text = events.map(e => `${e.year} — ${e.description}`).join("\n");
            navigator.clipboard.writeText(text);
            alert("Events copied to clipboard!");
        };

        const downloadBtn = document.createElement("button");
        downloadBtn.textContent = "Download Events";
        downloadBtn.onclick = () => {
            const text = events.map(e => `${e.year} — ${e.description}`).join("\n");
            const blob = new Blob([text], { type: "text/plain" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `events-${month}-${day}.txt`;
            link.click();
        };

        actions.appendChild(copyBtn);
        actions.appendChild(downloadBtn);

    } catch (err) {
        console.error(err);
        alert("Error loading events");
    }
}

// Load quiz
async function loadQuiz() {
    try {
        // Hide events if showing
        document.getElementById("eventsContainer").innerHTML = "";
        document.getElementById("eventActions").innerHTML = "";

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

            // Next Quiz button
            const nextBtn = document.createElement("button");
            nextBtn.textContent = "Next Quiz";
            nextBtn.onclick = loadQuiz;
            quizContainer.appendChild(nextBtn);
        };
        quizContainer.appendChild(submitBtn);

    } catch (err) {
        console.error(err);
        alert("Error loading quiz");
    }
}

// Footer navigation functions
function goHome() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.getElementById("quizContainer").innerHTML = "";
    document.getElementById("eventsContainer").innerHTML = "";
    document.getElementById("eventActions").innerHTML = "";
}

function openNCERT() {
  window.location.href = "ncert.html"; // open NCERT page
}

function openUPSC() {
  window.location.href = "upsc.html"; // open UPSC page
}

function scrollToQuiz() {
    document.getElementById("eventsContainer").innerHTML = "";
    document.getElementById("eventActions").innerHTML = "";
    document.getElementById("quizContainer").scrollIntoView({ behavior: "smooth" });
    loadQuiz();
}
