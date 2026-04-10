// ============================================================
// Countdown Timer — Page Logic
// ============================================================

let totalSeconds = 25 * 60;
let remainingSeconds = 25 * 60;
let running = false;
let intervalId: ReturnType<typeof setInterval> | null = null;
let selectedAlarm = 'chime';
let audioCtx: AudioContext | null = null;
let completedSessions = 0;
let accumulatedMinutes = 0;
let currentStreak = 0;

// DOM Elements
const timerDisplay = document.getElementById('timer-display')!;
const statusBadge  = document.getElementById('status-badge')!;
const startBtn     = document.getElementById('btn-start')!;
const startIcon    = document.getElementById('start-icon')!;
const resetBtn     = document.getElementById('btn-reset')!;
const stopBtn      = document.getElementById('btn-stop')!;
const inputHours   = document.getElementById('input-hours')   as HTMLInputElement;
const inputMinutes = document.getElementById('input-minutes') as HTMLInputElement;
const inputSeconds = document.getElementById('input-seconds') as HTMLInputElement;
const statSessions = document.getElementById('stat-sessions')!;
const statMinutes  = document.getElementById('stat-minutes')!;
const statStreak   = document.getElementById('stat-streak')!;

// ── Helpers ─────────────────────────────────────────────────

function pad(n: number, len = 2): string {
  return n.toString().padStart(len, '0');
}

function formatTime(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return h > 0
    ? `${pad(h)}:${pad(m)}:${pad(s)}`
    : `${pad(m)}:${pad(s)}`;
}

// ── Display ─────────────────────────────────────────────────

function updateTimerDisplay(): void {
  const h = Math.floor(remainingSeconds / 3600);
  const m = Math.floor((remainingSeconds % 3600) / 60);
  const s = remainingSeconds % 60;
  const sep = '<span class="timer-colon">:</span>';

  timerDisplay.innerHTML = h > 0
    ? `${pad(h)}${sep}${pad(m)}${sep}${pad(s)}`
    : `${pad(m)}${sep}${pad(s)}`;

  document.title = `${formatTime(remainingSeconds)} – Contagem Regressiva | Chronos Focus`;
}

function setStatus(state: 'ready' | 'active' | 'paused' | 'warning' | 'error', label: string): void {
  statusBadge.textContent = label;
  statusBadge.className = `status-badge status-badge-${state}`;
}

function updateStats(): void {
  statSessions.textContent = pad(completedSessions);
  statMinutes.textContent  = accumulatedMinutes.toString().padStart(3, '0');
  statStreak.textContent   = pad(currentStreak);
}

// ── Timer mechanics ─────────────────────────────────────────

function stopTimer(): void {
  if (intervalId) clearInterval(intervalId);
  intervalId = null;
  running = false;
  startIcon.textContent = 'play_arrow';
  startIcon.className = 'material-symbols-outlined text-5xl icon-filled';
}

function applyTime(secs: number): void {
  if (running) stopTimer();
  totalSeconds    = secs;
  remainingSeconds = secs;

  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  inputHours.value   = h.toString();
  inputMinutes.value = m.toString();
  inputSeconds.value = s.toString();

  updateTimerDisplay();
  setStatus('ready', 'Pronto para Iniciar');
}

function readInputTime(): number {
  const h = Math.max(0, parseInt(inputHours.value)   || 0);
  const m = Math.max(0, parseInt(inputMinutes.value) || 0);
  const s = Math.max(0, parseInt(inputSeconds.value) || 0);
  return h * 3600 + m * 60 + s;
}

// ── Alarm ────────────────────────────────────────────────────

function playAlarm(): void {
  if (!audioCtx) return;
  const ctx = audioCtx;

  if (selectedAlarm === 'chime') {
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      const t = ctx.currentTime + i * 0.2;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.35, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 2.5);
      osc.start(t);
      osc.stop(t + 2.6);
    });

  } else if (selectedAlarm === 'bell') {
    for (let i = 0; i < 3; i++) {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 440;
      osc.type = 'sine';
      const t = ctx.currentTime + i * 0.7;
      gain.gain.setValueAtTime(0.5, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
      osc.start(t);
      osc.stop(t + 0.7);
    }

  } else if (selectedAlarm === 'digital') {
    for (let i = 0; i < 4; i++) {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 1000;
      osc.type = 'square';
      const t = ctx.currentTime + i * 0.3;
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.setValueAtTime(0, t + 0.15);
      osc.start(t);
      osc.stop(t + 0.2);
    }
  }
}

// ── Tick ─────────────────────────────────────────────────────

function tick(): void {
  if (remainingSeconds <= 0) {
    stopTimer();
    playAlarm();
    completedSessions++;
    accumulatedMinutes += Math.floor(totalSeconds / 60);
    currentStreak++;
    updateStats();
    setStatus('error', 'Tempo Esgotado!');
    return;
  }

  remainingSeconds--;
  updateTimerDisplay();

  if (remainingSeconds <= 10 && remainingSeconds > 0) {
    setStatus('warning', `Encerrando em ${remainingSeconds}s`);
  }
}

// ── Event Listeners ──────────────────────────────────────────

startBtn.addEventListener('click', () => {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  if (remainingSeconds <= 0) return;

  if (running) {
    stopTimer();
    setStatus('paused', 'Pausado');
  } else {
    running = true;
    startIcon.textContent = 'pause';
    startIcon.className = 'material-symbols-outlined text-5xl icon-filled';
    setStatus('active', 'Sessão Ativa');
    intervalId = setInterval(tick, 1000);
  }
});

resetBtn.addEventListener('click', () => {
  applyTime(totalSeconds);
});

stopBtn.addEventListener('click', () => {
  stopTimer();
  remainingSeconds = 0;
  updateTimerDisplay();
  setStatus('paused', 'Parado');
});

// Apply time from inputs on Enter or blur
[inputHours, inputMinutes, inputSeconds].forEach((input) => {
  input.addEventListener('keydown', (e) => {
    if ((e as KeyboardEvent).key === 'Enter') {
      const total = readInputTime();
      if (total > 0) applyTime(total);
    }
  });
  input.addEventListener('blur', () => {
    if (!running) {
      const total = readInputTime();
      if (total > 0) applyTime(total);
    }
  });
});

// Preset buttons
document.querySelectorAll<HTMLButtonElement>('.preset-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const secs = parseInt(btn.dataset.seconds ?? '0');
    if (secs > 0) applyTime(secs);
  });
});

// Alarm buttons
document.querySelectorAll<HTMLButtonElement>('.alarm-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll<HTMLElement>('.alarm-btn').forEach((b) => {
      b.classList.remove('active-alarm');
      const check = b.querySelector<HTMLElement>('.alarm-check');
      const play  = b.querySelector<HTMLElement>('.alarm-play');
      if (check) { check.textContent = 'play_circle'; check.classList.remove('icon-filled'); check.classList.add('alarm-play'); check.classList.remove('alarm-check'); }
      if (play)  { play.classList.remove('icon-filled'); }
    });

    btn.classList.add('active-alarm');
    selectedAlarm = btn.dataset.alarm ?? 'chime';

    // swap icon to check_circle with fill
    const icon = btn.querySelector<HTMLElement>('.alarm-play') ?? btn.querySelector<HTMLElement>('.alarm-check');
    if (icon) {
      icon.textContent = 'check_circle';
      icon.classList.add('icon-filled', 'alarm-check');
      icon.classList.remove('alarm-play');
    }
  });
});

// ── Init ─────────────────────────────────────────────────────

updateTimerDisplay();
updateStats();
setStatus('ready', 'Pronto para Iniciar');
