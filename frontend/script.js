async function loadEvents() {
    const month = document.getElementById('monthSelect').value;
    const year = document.getElementById('yearInput').value;

    try {
        const res = await fetch(`/events?month=${month}&year=${year}`);
        if (!res.ok) throw new Error('Failed to load events');

        const events = await res.json();
        const container = document.getElementById('eventsContainer');
        container.innerHTML = '';

        if (events.length === 0) {
            container.innerHTML = '<p>No events found for this month/year.</p>';
            return;
        }

        events.forEach(ev => {
            const div = document.createElement('div');
            div.classList.add('event');
            div.innerHTML = `<strong>${ev.date || ''}</strong> - ${ev.event}`;
            container.appendChild(div);
        });

    } catch (err) {
        console.error(err);
        alert('Error loading events');
    }
}

async function loadQuiz() {
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
