// ============================================================
// Stopwatch — Page Logic
// ============================================================

let running = false;
let startTime = 0;
let elapsedMs = 0;
let lapStart = 0;
let animFrameId: number | null = null;
const laps: number[] = [];

const timerDisplay = document.getElementById('timer-display')!;
const timeMain = document.getElementById('time-main')!;
const msDisplay = document.getElementById('ms-display')!;
const startBtn = document.getElementById('btn-start')!;
const startIcon = document.getElementById('start-icon')!;
const resetBtn = document.getElementById('btn-reset')!;
const lapBtn = document.getElementById('btn-lap')!;
const lapsList = document.getElementById('laps-list')!;
const lapsEmpty = document.getElementById('laps-empty')!;
const lapCountBadge = document.getElementById('lap-count-badge')!;
const bestLap = document.getElementById('best-lap')!;
const lastLap = document.getElementById('last-lap')!;
const ringProgress = document.getElementById('ring-progress') as unknown as SVGCircleElement;
const clearLapsBtn = document.getElementById('btn-clear-laps')!;

function formatMs(ms: number): string {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function formatCentiseconds(ms: number): string {
  return Math.floor((ms % 1000) / 10).toString().padStart(2, '0');
}

function updateDisplay(ms: number) {
  timeMain.textContent = formatMs(ms);
  msDisplay.textContent = `.${formatCentiseconds(ms)}`;
}

function updateRing(ms: number) {
  const circumference = ringProgress.getTotalLength();
  if (!circumference) return;
  const progress = (ms % 60000) / 60000;
  ringProgress.style.strokeDasharray = `${progress * circumference} ${circumference}`;
}

function frame() {
  if (!running) return;
  const now = performance.now();
  const ms = elapsedMs + (now - startTime);
  updateDisplay(ms);
  updateRing(ms);
  animFrameId = requestAnimationFrame(frame);
}

function addLapToList(lapMs: number, index: number) {
  lapsEmpty.style.display = 'none';

  const lapDiff = laps.length > 1 ? lapMs - laps[laps.length - 2] : null;
  const isBest = laps.length === 1 || lapMs <= Math.min(...laps.slice(0, -1));

  const div = document.createElement('div');
  div.className = `lap-item${isBest ? ' best' : ''} flex items-center justify-between p-4 transition-all hover:translate-x-1`;

  const diffHTML = lapDiff !== null
    ? `<p class="${lapDiff >= 0 ? 'lap-diff-worse' : 'lap-diff-better'}">${lapDiff >= 0 ? '+' : ''}${(lapDiff / 1000).toFixed(2)}s</p>
       <p class="lap-sublabel">Diff</p>`
    : '';

  div.innerHTML = `
    <div class="flex items-center gap-4">
      <span class="lap-index">${String(index).padStart(2, '0')}</span>
      <div>
        <p class="lap-time">${formatMs(lapMs)}.${formatCentiseconds(lapMs)}</p>
        <p class="lap-sublabel">Tempo de Volta</p>
      </div>
    </div>
    <div class="text-right">${diffHTML}</div>
  `;

  lapsList.insertBefore(div, lapsList.firstChild);
}

function updateStats() {
  lapCountBadge.textContent = `${laps.length} ${laps.length === 1 ? 'Volta' : 'Voltas'}`;
  if (laps.length > 0) {
    const best = Math.min(...laps);
    const last = laps[laps.length - 1];
    bestLap.textContent = `${formatMs(best)}.${formatCentiseconds(best)}`;
    lastLap.textContent = `${formatMs(last)}.${formatCentiseconds(last)}`;
  }
}

startBtn.addEventListener('click', () => {
  if (running) {
    if (animFrameId) cancelAnimationFrame(animFrameId);
    animFrameId = null;
    elapsedMs += performance.now() - startTime;
    running = false;
    startIcon.textContent = 'play_arrow';
  } else {
    startTime = performance.now();
    if (lapStart === 0) lapStart = startTime;
    running = true;
    startIcon.textContent = 'pause';
    animFrameId = requestAnimationFrame(frame);
  }
});

resetBtn.addEventListener('click', () => {
  if (animFrameId) cancelAnimationFrame(animFrameId);
  animFrameId = null;
  running = false;
  elapsedMs = 0;
  lapStart = 0;
  startIcon.textContent = 'play_arrow';
  updateDisplay(0);
  updateRing(0);
  laps.length = 0;
  lapsEmpty.style.display = '';
  lapsList.querySelectorAll('div:not(#laps-empty)').forEach((el) => el.remove());
  lapCountBadge.textContent = '0 Voltas';
  bestLap.textContent = '--:--:--';
  lastLap.textContent = '--:--:--';
});

lapBtn.addEventListener('click', () => {
  if (!running && elapsedMs === 0) return;
  const now = performance.now();
  const totalMs = running ? elapsedMs + (now - startTime) : elapsedMs;
  const lapMs = totalMs - laps.reduce((acc, l) => acc + l, 0);
  laps.push(lapMs);
  lapStart = now;
  addLapToList(lapMs, laps.length);
  updateStats();
});

clearLapsBtn.addEventListener('click', () => {
  laps.length = 0;
  lapsEmpty.style.display = '';
  lapsList.querySelectorAll('div:not(#laps-empty)').forEach((el) => el.remove());
  lapCountBadge.textContent = '0 Voltas';
  bestLap.textContent = '--:--:--';
  lastLap.textContent = '--:--:--';
});

// Initialize
updateDisplay(0);
