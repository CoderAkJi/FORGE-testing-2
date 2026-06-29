// ============================================================
// NAVIGATION
// ============================================================
function tab(t) {
  curTab = t;
  document.querySelectorAll('.nb').forEach(b => b.classList.toggle('on', b.dataset.t === t));
  const c = document.getElementById('content');
  c.style.opacity = '0';
  c.style.transform = 'translateY(5px)';
  setTimeout(() => {
    renderTab(t);
    c.style.transition = 'all .18s ease';
    c.style.opacity = '1';
    c.style.transform = 'none';
    setTimeout(() => { c.style.transition = ''; }, 200);
  }, 90);
}

function renderTab(t) {
  const map = { home: renderHome, workout: renderWorkout, nutrition: renderNutrition, coach: renderCoach, settings: renderSettings };
  (map[t] || renderHome)();
}

// ============================================================
// MODAL (bottom sheet)
// ============================================================
function openMod(html) {
  document.getElementById('mod-c').innerHTML = html;
  document.getElementById('mod-ov').classList.remove('hidden');
}

function closeMod() {
  document.getElementById('mod-ov').classList.add('hidden');
}

function modBg(e) {
  if (e.target === document.getElementById('mod-ov')) closeMod();
}

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================
function toast(msg, type) {
  const c  = document.getElementById('toast');
  const el = document.createElement('div');
  el.className = 'ti' + (type ? ' ' + type : '');
  el.textContent = msg;
  c.appendChild(el);
  setTimeout(() => el.classList.add('show'), 10);
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 280);
  }, 2800);
}

// ============================================================
// XP POP-UP ANIMATION
// ============================================================
function showXPPop(txt) {
  const el = document.getElementById('xp-pop');
  el.textContent = txt;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 750);
}

// ============================================================
// LEVEL UP OVERLAY
// ============================================================
function showLevelUp() {
  const ri = getRank(S.progress.level);
  const ov = document.createElement('div');
  ov.className = 'lu-ov';
  ov.innerHTML = `
    <div class="lu-c">
      <div class="lu-tag">RANK UP</div>
      <div class="lu-r" style="color:${ri.c}">${ri.r}</div>
      <div class="lu-t" style="color:${ri.c}">Level ${S.progress.level}</div>
      <div class="lu-s">${ri.name} · ${ri.title}</div>
      <div class="lu-b" onclick="this.parentElement.parentElement.remove()">Continue →</div>
    </div>`;
  document.body.appendChild(ov);
  haptic('success');
}

// ============================================================
// HAPTIC FEEDBACK
// ============================================================
function haptic(type) {
  if (!navigator.vibrate) return;
  if (type === 'light')   navigator.vibrate(10);
  if (type === 'success') navigator.vibrate([15, 50, 15]);
  if (type === 'error')   navigator.vibrate([50, 30, 50, 30, 50]);
}
