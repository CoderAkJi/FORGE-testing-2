// ============================================================
// BODY & NUTRITION CALCULATIONS
// ============================================================
function calcBMR(u) {
  const w = +u.weight, h = +u.height, a = +u.age;
  return u.gender === 'male'
    ? (10 * w) + (6.25 * h) - (5 * a) + 5
    : (10 * w) + (6.25 * h) - (5 * a) - 161;
}

function calcTDEE(bmr, activity) {
  const mult = { low: 1.2, medium: 1.55, high: 1.725 };
  return Math.round(bmr * (mult[activity] || 1.375));
}

function calcTargets(tdee, goal) {
  let cal = goal === 'lose_fat'    ? tdee - 450
          : goal === 'build_muscle' ? tdee + 300
          : tdee;
  cal = Math.max(1400, cal);
  const p  = Math.round((cal * 0.30) / 4);
  const cbR = goal === 'build_muscle' ? 0.45 : goal === 'lose_fat' ? 0.35 : 0.40;
  const cb = Math.round((cal * cbR) / 4);
  const f  = Math.round((cal - p * 4 - cb * 4) / 9);
  return { cal, p: Math.max(50, p), cb: Math.max(50, cb), f: Math.max(30, f) };
}

// ============================================================
// RANK & XP
// ============================================================
function getRank(lvl) {
  return RANKS.find(r => lvl >= r.min && lvl <= r.max) || RANKS[0];
}

function lvlXP()  { return S.progress.level * XPL; }
function lvlPct() { return Math.min(100, Math.round((S.progress.xp / lvlXP()) * 100)); }

// ============================================================
// DATE HELPERS
// ============================================================
function today() {
  return new Date().toISOString().split('T')[0];
}

function fmtD(d) {
  return new Date(d + 'T12:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
