/* ============================================
   SPIDERBOOK – script.js
   Deutsch A1-A2 Projekt
   ============================================ */

/* ── Hamburger Menu ── */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
  hamburger.textContent = mobileNav.classList.contains('open') ? '✕' : '☰';
});

// Close mobile nav when a link is clicked
mobileNav.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    hamburger.textContent = '☰';
  });
});

/* ── Active Nav Link on Scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav a[href^="#"]');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { rootMargin: '-30% 0px -60% 0px' }
);

sections.forEach(s => observer.observe(s));

/* ── Reaction Buttons ── */
document.querySelectorAll('.reaction-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const countSpan = btn.querySelector('span');
    if (!countSpan) return;

    // Only animate numeric counts (not "Kommentar" or "Teilen")
    const text = countSpan.textContent.trim();
    const num = parseFloat(text.replace(',', '.').replace('K', '')) ;
    if (isNaN(num)) return;

    // Toggle: if already reacted, deduct; otherwise add
    if (btn.dataset.reacted === 'true') {
      btn.dataset.reacted = 'false';
      btn.style.color = '';
      // Decrease by 1
      const raw = parseRawCount(countSpan.textContent);
      countSpan.textContent = formatCount(raw - 1);
    } else {
      btn.dataset.reacted = 'true';
      btn.style.color = 'var(--red)';
      // Increase by 1
      const raw = parseRawCount(countSpan.textContent);
      countSpan.textContent = formatCount(raw + 1);

      // Bounce animation
      btn.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(1.3)' }, { transform: 'scale(1)' }],
        { duration: 300, easing: 'ease' }
      );
    }
  });
});

function parseRawCount(str) {
  const s = str.trim();
  if (s.endsWith('K')) return Math.round(parseFloat(s) * 1000);
  return parseInt(s.replace(/[^0-9]/g, ''), 10) || 0;
}

function formatCount(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'K';
  return String(n);
}

/* ── Video Placeholders ── */
document.querySelectorAll('.video-placeholder').forEach(vp => {
  vp.addEventListener('click', () => {
    // Pulse animation to indicate "not yet available"
    vp.animate(
      [
        { boxShadow: '0 0 0 0 rgba(227,29,42,0.4)' },
        { boxShadow: '0 0 0 16px rgba(227,29,42,0)' }
      ],
      { duration: 600, easing: 'ease-out' }
    );
  });
});

/* ── Search Bar (fake interaction) ── */
const searchInput = document.querySelector('.search-bar input');
if (searchInput) {
  // Remove disabled attr so it's interactable, but keep it visually consistent
  searchInput.removeAttribute('disabled');
  searchInput.setAttribute('placeholder', 'Suche in SpiderBook...');

  searchInput.addEventListener('focus', () => {
    searchInput.closest('.search-bar').style.borderColor = 'var(--red)';
    searchInput.closest('.search-bar').style.boxShadow = '0 0 0 2px rgba(227,29,42,0.2)';
  });

  searchInput.addEventListener('blur', () => {
    searchInput.closest('.search-bar').style.borderColor = '';
    searchInput.closest('.search-bar').style.boxShadow = '';
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && searchInput.value.trim()) {
      // Fake search feedback
      const original = searchInput.value;
      searchInput.value = `Suche nach "${original}"...`;
      searchInput.disabled = true;
      setTimeout(() => {
        searchInput.value = '';
        searchInput.disabled = false;
        searchInput.placeholder = 'Keine Ergebnisse gefunden 😕';
        setTimeout(() => {
          searchInput.placeholder = 'Suche in SpiderBook...';
        }, 2000);
      }, 800);
    }
  });
}

/* ── Trend List Clicks ── */
document.querySelectorAll('.trend-list li').forEach(li => {
  li.addEventListener('click', () => {
    const tag = li.textContent.trim();
    if (searchInput) {
      searchInput.value = tag;
      searchInput.focus();
    }
  });
});

/* ── Card Scroll Animations (Intersection Observer) ── */
const cardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        cardObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.post-card').forEach((card, i) => {
  card.style.animationDelay = `${(i % 4) * 0.08}s`;
  card.style.animationPlayState = 'paused';
  cardObserver.observe(card);
});

/* ============================================
   QUIZ
   ============================================ */

const quizData = [
  {
    q: 'Wie alt ist Peter Parker?',
    options: ['15 Jahre alt', '17 Jahre alt', '20 Jahre alt', '25 Jahre alt'],
    correct: 1,
    feedback: 'Richtig! Peter Parker ist 17 Jahre alt. 🎂'
  },
  {
    q: 'Wo wohnt Peter Parker?',
    options: ['Brooklyn, New York', 'Manhattan, New York', 'Queens, New York', 'Los Angeles'],
    correct: 2,
    feedback: 'Korrekt! Er wohnt in Queens, New York. 🏙️'
  },
  {
    q: 'Was ist Peters Beruf?',
    options: ['Er ist Arzt.', 'Er ist Polizist.', 'Er ist Fotograf und Schüler.', 'Er ist Journalist.'],
    correct: 2,
    feedback: 'Super! Peter ist Fotograf und Schüler. 📸'
  },
  {
    q: 'Was hat Spider-Man im Daily Bugle gerettet?',
    options: ['Ein Auto', 'Einen Zug', 'Ein Flugzeug', 'Eine Brücke'],
    correct: 1,
    feedback: 'Ja! Spider-Man rettet einen Zug! 🚇'
  },
  {
    q: 'Welcher Bösewicht hat acht Arme?',
    options: ['Der Grüne Goblin', 'Sandman', 'Doktor Octopus', 'Venom'],
    correct: 2,
    feedback: 'Richtig! Doktor Octopus hat acht Arme. 🐙'
  }
];

let currentQuestion = 0;
let score = 0;
let answered = false;

const quizIntro    = document.getElementById('quizIntro');
const quizMain     = document.getElementById('quizMain');
const quizResult   = document.getElementById('quizResult');
const startQuizBtn = document.getElementById('startQuiz');
const progressFill = document.getElementById('progressFill');
const quizCounter  = document.getElementById('quizCounter');
const quizQuestion = document.getElementById('quizQuestion');

// Start quiz
startQuizBtn.addEventListener('click', () => {
  quizIntro.classList.add('hidden');
  quizMain.classList.remove('hidden');
  currentQuestion = 0;
  score = 0;
  renderQuestion();
});

function renderQuestion() {
  answered = false;
  const data = quizData[currentQuestion];
  const total = quizData.length;

  // Update progress
  const pct = ((currentQuestion) / total) * 100;
  progressFill.style.width = `${pct}%`;
  quizCounter.textContent = `${currentQuestion + 1} / ${total}`;

  // Build question HTML
  quizQuestion.innerHTML = `
    <p class="quiz-q">${data.q}</p>
    <div class="quiz-options">
      ${data.options.map((opt, i) => `
        <button class="quiz-option" data-index="${i}">${opt}</button>
      `).join('')}
    </div>
    <div id="quizFeedback" class="quiz-feedback hidden"></div>
    <div id="quizNextWrap" class="hidden" style="text-align:right; margin-top:8px;">
      <button class="btn-primary" id="quizNextBtn">
        ${currentQuestion + 1 < total ? 'Weiter →' : 'Ergebnis sehen 🏆'}
      </button>
    </div>
  `;

  // Attach option listeners
  quizQuestion.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => handleAnswer(btn));
  });
}

function handleAnswer(selectedBtn) {
  if (answered) return;
  answered = true;

  const chosen = parseInt(selectedBtn.dataset.index);
  const data   = quizData[currentQuestion];
  const correct = data.correct;

  // Disable all options
  quizQuestion.querySelectorAll('.quiz-option').forEach(btn => {
    btn.disabled = true;
    const i = parseInt(btn.dataset.index);
    if (i === correct) btn.classList.add('correct');
    else if (i === chosen && chosen !== correct) btn.classList.add('wrong');
  });

  // Show feedback
  const feedbackEl = document.getElementById('quizFeedback');
  feedbackEl.classList.remove('hidden');

  if (chosen === correct) {
    score++;
    feedbackEl.classList.add('ok');
    feedbackEl.classList.remove('err');
    feedbackEl.textContent = '✅ ' + data.feedback;
  } else {
    feedbackEl.classList.add('err');
    feedbackEl.classList.remove('ok');
    feedbackEl.textContent = `❌ Leider falsch. ${data.feedback}`;
  }

  // Show next button
  document.getElementById('quizNextWrap').classList.remove('hidden');
  document.getElementById('quizNextBtn').addEventListener('click', () => {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
      renderQuestion();
    } else {
      showResult();
    }
  });
}

function showResult() {
  quizMain.classList.add('hidden');
  quizResult.classList.remove('hidden');

  const total   = quizData.length;
  const pct     = Math.round((score / total) * 100);
  const emoji   = score === total ? '🏆' : score >= 3 ? '🕷️' : '😅';
  const label   = score === total
    ? 'Perfekt! Du bist ein Spider-Man-Experte!'
    : score >= 3
    ? 'Sehr gut! Fast alles richtig!'
    : 'Gut versucht! Lies die Seite nochmal!';

  const color = score >= 4 ? '#22c55e' : score >= 3 ? 'var(--gold)' : 'var(--red)';

  quizResult.innerHTML = `
    <div class="result-emoji">${emoji}</div>
    <div class="result-score" style="color:${color}">${score}/${total}</div>
    <p class="result-label">${label}</p>
    <p class="result-msg">${pct}% richtig — Sprachkenntnisse: ${getLevelLabel(pct)}</p>
    <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin-top:8px;">
      <button class="btn-primary btn-big" id="retryQuiz">🔄 Nochmal versuchen</button>
      <button class="btn-secondary btn-big" id="shareResult">↗️ Teilen</button>
    </div>
  `;

  document.getElementById('retryQuiz').addEventListener('click', () => {
    quizResult.classList.add('hidden');
    quizIntro.classList.remove('hidden');
  });

  document.getElementById('shareResult').addEventListener('click', () => {
    const text = `Ich habe ${score}/${total} im SpiderBook Quiz erreicht! 🕷️ #SpiderBook #DeutschA1A2`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        document.getElementById('shareResult').textContent = '✅ Kopiert!';
        setTimeout(() => {
          document.getElementById('shareResult').textContent = '↗️ Teilen';
        }, 2000);
      });
    }
  });
}

function getLevelLabel(pct) {
  if (pct === 100) return 'Ausgezeichnet 🌟';
  if (pct >= 80)  return 'Sehr gut 👍';
  if (pct >= 60)  return 'Gut 😊';
  return 'Weiter üben 📚';
}

/* ── Sticky Header Shadow on Scroll ── */
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  header.style.boxShadow = window.scrollY > 10
    ? '0 4px 24px rgba(227,29,42,0.35)'
    : '0 2px 20px rgba(227,29,42,0.25)';
}, { passive: true });