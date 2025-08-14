document.addEventListener('DOMContentLoaded', () => {
  const monthSelect = document.getElementById('month');
  const yearInput = document.getElementById('year');
  const eventsContainer = document.getElementById('events');
  const quizContainer = document.getElementById('quiz');
  const quizButton = document.getElementById('generateQuiz');

  // Populate months (January, February, etc.)
  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];
  months.forEach((name, index) => {
    const opt = document.createElement('option');
    opt.value = index + 1; // month number (1-12)
    opt.textContent = name;
    monthSelect.appendChild(opt);
  });

  // Fetch events from backend
  async function fetchEvents(month, year) {
    const res = await fetch(`/api/events?month=${month}&year=${year}`);
    const data = await res.json();
    displayEvents(data);
  }

  // Display all matching events
  function displayEvents(events) {
    eventsContainer.innerHTML = '';
    if (!events || events.length === 0) {
      eventsContainer.innerHTML = '<p>No events found for this month/year.</p>';
      return;
    }
    events.forEach(ev => {
      const div = document.createElement('div');
      div.className = 'event-card';
      div.innerHTML = `
        <h3>${ev.event}</h3>
        <p><strong>Year:</strong> ${ev.year}</p>
        <p><strong>Month:</strong> ${months[ev.month - 1]}</p>
      `;
      eventsContainer.appendChild(div);
    });
  }

  // Fetch quiz question
  async function fetchQuiz(month, year) {
    const res = await fetch('/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ month, year })
    });
    const data = await res.json();
    displayQuiz(data);
  }

  // Display quiz
  function displayQuiz({ question, answer }) {
    quizContainer.innerHTML = '';
    if (!question) {
      quizContainer.innerHTML = '<p>No quiz available for this month/year.</p>';
      return;
    }

    const questionEl = document.createElement('p');
    questionEl.textContent = question;

    const inputEl = document.createElement('input');
    inputEl.type = 'number';
    inputEl.placeholder = 'Enter your answer year';

    const submitBtn = document.createElement('button');
    submitBtn.textContent = 'Submit';

    const resultEl = document.createElement('p');

    submitBtn.addEventListener('click', () => {
      const userAnswer = parseInt(inputEl.value);
      if (userAnswer === answer) {
        resultEl.textContent = '✅ Correct!';
        resultEl.style.color = 'green';
      } else {
        resultEl.textContent = `❌ Wrong! Correct answer: ${answer}`;
        resultEl.style.color = 'red';
      }
    });

    quizContainer.appendChild(questionEl);
    quizContainer.appendChild(inputEl);
    quizContainer.appendChild(submitBtn);
    quizContainer.appendChild(resultEl);
  }

  // Event listeners
  document.getElementById('generateEvents').addEventListener('click', () => {
    const month = parseInt(monthSelect.value);
    const year = parseInt(yearInput.value);
    if (month && year) {
      fetchEvents(month, year);
    }
  });

  quizButton.addEventListener('click', () => {
    const month = parseInt(monthSelect.value);
    const year = parseInt(yearInput.value);
    if (month && year) {
      fetchQuiz(month, year);
    }
  });
});
