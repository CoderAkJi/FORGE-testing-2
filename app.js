// ============================================================
// SCREEN MANAGEMENT
// ============================================================
function showLogin() {
  document.getElementById('login-screen').classList.remove('hidden');
}

function showOb() {
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('onboarding').classList.remove('hidden');
  goOb(1);
}

function showApp() {
  document.getElementById('app').classList.remove('hidden');
  tab('home');
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});
}

// ============================================================
// ONBOARDING
// ============================================================
function goOb(n) {
  document.querySelectorAll('.ob-screen').forEach(s => {
    s.classList.remove('active', 'exit');
    if (+s.dataset.s < n) s.classList.add('exit');
  });
  const target = document.querySelector(`.ob-screen[data-s="${n}"]`);
  if (target) setTimeout(() => target.classList.add('active'), 10);
  obScr = n;
  const pf = document.getElementById('ob-pf');
  if (pf) pf.style.width = ((n - 1) / 5 * 100) + '%';
}

function nOb() { goOb(obScr + 1); }
function pOb() { if (obScr > 1) goOb(obScr - 1); }

function selCard(type, el) {
  const groupId = { goal: 'g-cards', phys: 'ph-cards', act: 'ac-cards' }[type];
  const btnId   = { goal: 'g-next',  phys: 'ph-next',  act: 'ac-next'  }[type];
  document.querySelectorAll('#' + groupId + ' .ob-card').forEach(c => c.classList.remove('sel'));
  el.classList.add('sel');
  if (type === 'goal') selGoal = el.dataset.v;
  if (type === 'phys') selPhys = el.dataset.v;
  if (type === 'act')  selAct  = el.dataset.v;
  const btn = document.getElementById(btnId);
  if (btn) btn.disabled = false;
  haptic('light');
}

function pickGender(el) {
  document.querySelectorAll('.g-btn').forEach(b => b.classList.remove('sel'));
  el.classList.add('sel');
  selGend = el.dataset.v;
}

function valBody() {
  const age = +document.getElementById('i-age').value;
  const wt  = +document.getElementById('i-wt').value;
  const ht  = +document.getElementById('i-ht').value;
  if (!age || age < 10 || age > 100) { toast('Enter a valid age', 'err'); return; }
  if (!wt  || wt  < 30 || wt  > 300) { toast('Enter a valid weight', 'err'); return; }
  if (!ht  || ht  < 100 || ht > 250) { toast('Enter a valid height', 'err'); return; }
  nOb();
}

async function finishOb() {
  const name  = (document.getElementById('i-name').value  || '').trim();
  const email = (document.getElementById('i-email').value || '').trim();
  const pass  = (document.getElementById('i-pass').value  || '');
  const errEl = document.getElementById('ob-err');
  if (!name)                       { errEl.textContent = 'Enter your name'; return; }
  if (!email || !email.includes('@')) { errEl.textContent = 'Enter a valid email'; return; }
  if (pass.length < 6)             { errEl.textContent = 'Password must be at least 6 characters'; return; }

  const btn = document.getElementById('ob-done');
  btn.textContent = 'Creating account...'; btn.disabled = true;
  try {
    // Build state before pushing to cloud
    S.user = {
      name, goal: selGoal, physique: selPhys, activity: selAct, gender: selGend,
      age:    +document.getElementById('i-age').value,
      weight: +document.getElementById('i-wt').value,
      height: +document.getElementById('i-ht').value,
      joined: today(), planDay: 0
    };
    S.nutrition.targets  = calcTargets(calcTDEE(calcBMR(S.user), S.user.activity), S.user.goal);
    S.progress.lastActive = today(); S.progress.streak = 1; S.progress.bestStreak = 1;
    save();

    await createAccount(name, email, pass);

    document.getElementById('onboarding').classList.add('hidden');
    showApp();
    toast('Welcome, ' + name + '! Your journey begins. 🔥', 'ok');
    haptic('success');
  } catch (e) {
    errEl.textContent = e.message || 'Could not create account. Check your internet.';
    btn.textContent = 'Start My Journey 🔥'; btn.disabled = false;
  }
}

// ============================================================
// XP SYSTEM
// ============================================================
function addXP(amt) {
  S.progress.xp += amt;
  showXPPop('+' + amt + ' XP');
  let leveled = false;
  while (S.progress.xp >= lvlXP() && S.progress.level < 100) {
    S.progress.xp -= lvlXP();
    S.progress.level++;
    leveled = true;
  }
  save(); scheduleSyncLater();
  if (leveled) setTimeout(showLevelUp, 600);
  if (curTab === 'home') renderHome();
}

// ============================================================
// STREAK & DECAY
// ============================================================
function checkDecay() {
  if (!S.progress.lastActive) return;
  const diff = Math.floor((new Date() - new Date(S.progress.lastActive)) / 864e5);
  if (diff >= 2) {
    const decay = Math.min((diff - 1) * 50, S.progress.xp);
    S.progress.xp = Math.max(0, S.progress.xp - decay);
    save();
  }
}

function updStreak() {
  const t = today();
  if (S.progress.lastActive === t) return;
  const last = S.progress.lastActive;
  if (last) {
    const days = Math.floor((new Date(t) - new Date(last)) / 864e5);
    if (days === 1) {
      S.progress.streak++;
      if (S.progress.streak > S.progress.bestStreak) S.progress.bestStreak = S.progress.streak;
    } else if (days > 1) {
      S.progress.streak = 1;
    }
  } else {
    S.progress.streak = 1; S.progress.bestStreak = 1;
  }
  S.progress.lastActive = t; save();
}

// ============================================================
// ENTRY POINT
// ============================================================
checkAuth();
