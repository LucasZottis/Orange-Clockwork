// ============================================================
// Pomodoro Timer — Page Logic
// ============================================================

// --- State ---
type Mode = 'pomodoro' | 'short' | 'long';

const DURATIONS: Record<Mode, number> = {
  pomodoro: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
};

const SESSION_LABELS: Record<Mode, string> = {
  pomodoro: 'Sessão de Trabalho Profundo',
  short: 'Pausa Curta — Respire!',
  long: 'Pausa Longa — Você Merece!',
};

let currentMode: Mode = 'pomodoro';
let totalSeconds = DURATIONS.pomodoro;
let remainingSeconds = DURATIONS.pomodoro;
let running = false;
let intervalId: ReturnType<typeof setInterval> | null = null;
let sessionsDone = 0;
const GOAL_SESSIONS = 4;

// --- DOM Elements ---
const timerDisplay = document.getElementById('timer-display')!;
const startBtn = document.getElementById('btn-start')!;
const startIcon = document.getElementById('start-icon')!;
const resetBtn = document.getElementById('btn-reset')!;
const skipBtn = document.getElementById('btn-skip')!;
const sessionLabel = document.getElementById('session-label')!;
const sessionCount = document.getElementById('session-count')!;
const sessionsDoneEl = document.getElementById('sessions-done')!;
const goalProgress = document.getElementById('goal-progress')!;
const ringProgress = document.getElementById('ring-progress') as unknown as SVGCircleElement;
const editBtn = document.getElementById('btn-edit-focus')!;
const focusEdit = document.getElementById('focus-edit')!;
const focusInput = document.getElementById('focus-input') as HTMLInputElement;
const focusTitle = document.getElementById('focus-title')!;
const focusDesc = document.getElementById('focus-desc')!;
const sessionDots = document.querySelectorAll('.session-dot');

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function updateDisplay() {
  const [mm, ss] = formatTime(remainingSeconds).split(':');
  timerDisplay.innerHTML = `${mm}<span class="timer-sep">:</span>${ss}`;
  document.title = `${formatTime(remainingSeconds)} — Pomodoro`;
}

function updateRing() {
  const r = ringProgress.r.baseVal.value;
  const circumference = 2 * Math.PI * r;
  const progress = 1 - remainingSeconds / totalSeconds;
  ringProgress.style.strokeDasharray = `${progress * circumference} ${circumference}`;
}

function updateSessionDots() {
  sessionDots.forEach((dot, i) => {
    if (i < sessionsDone) {
      dot.classList.add('filled');
    } else {
      dot.classList.remove('filled');
    }
  });
}

function setMode(mode: Mode) {
  currentMode = mode;
  totalSeconds = DURATIONS[mode];
  remainingSeconds = DURATIONS[mode];
  running = false;
  if (intervalId) clearInterval(intervalId);
  intervalId = null;

  startIcon.textContent = 'play_arrow';
  sessionLabel.textContent = SESSION_LABELS[mode];

  document.querySelectorAll('.mode-btn').forEach((btn) => {
    const el = btn as HTMLElement;
    if (el.dataset.mode === mode) {
      el.classList.add('active-mode');
    } else {
      el.classList.remove('active-mode');
    }
  });

  updateDisplay();
  updateRing();
}

function tick() {
  if (remainingSeconds <= 0) {
    clearInterval(intervalId!);
    intervalId = null;
    running = false;
    startIcon.textContent = 'play_arrow';

    if (currentMode === 'pomodoro') {
      sessionsDone++;
      const pct = Math.min((sessionsDone / GOAL_SESSIONS) * 100, 100);
      sessionsDoneEl.textContent = sessionsDone.toString();
      goalProgress.style.width = `${pct}%`;
      sessionCount.textContent = Math.min(sessionsDone + 1, 4).toString();
      updateSessionDots();

      if (sessionsDone % 4 === 0) {
        setMode('long');
      } else {
        setMode('short');
      }
    } else {
      setMode('pomodoro');
    }
    return;
  }
  remainingSeconds--;
  updateDisplay();
  updateRing();
}

function toggleTimer() {
  if (running) {
    clearInterval(intervalId!);
    intervalId = null;
    running = false;
    startIcon.textContent = 'play_arrow';
  } else {
    running = true;
    startIcon.textContent = 'pause';
    intervalId = setInterval(tick, 1000);
  }
}

startBtn.addEventListener('click', toggleTimer);

resetBtn.addEventListener('click', () => {
  if (intervalId) clearInterval(intervalId);
  intervalId = null;
  running = false;
  remainingSeconds = totalSeconds;
  startIcon.textContent = 'play_arrow';
  updateDisplay();
  updateRing();
});

skipBtn.addEventListener('click', () => {
  if (intervalId) clearInterval(intervalId);
  intervalId = null;
  running = false;
  remainingSeconds = 0;
  tick();
});

document.querySelectorAll('.mode-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const mode = (btn as HTMLElement).dataset.mode as Mode;
    setMode(mode);
  });
});

editBtn.addEventListener('click', () => {
  focusEdit.classList.toggle('hidden');
  if (!focusEdit.classList.contains('hidden')) {
    focusInput.value = focusTitle.textContent?.trim() === 'Minha Tarefa' ? '' : focusTitle.textContent?.trim() || '';
    focusInput.focus();
  }
});

focusInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const val = focusInput.value.trim();
    if (val) {
      focusTitle.textContent = val;
      focusDesc.textContent = val;
    }
    focusEdit.classList.add('hidden');
  }
  if (e.key === 'Escape') {
    focusEdit.classList.add('hidden');
  }
});

// Initialize
updateDisplay();
updateRing();
updateSessionDots();
