// ============================================================
// HOME TAB
// ============================================================
function getTodayWOD() {
  const plan = PLANS[S.user.physique || 'balanced'];
  return plan.days[(S.user.planDay || 0) % 7];
}

function getTodayNut() {
  if (S.nutrition.todayDate !== today()) {
    S.nutrition.todayDate = today();
    S.nutrition.todayLog  = [];
    save();
  }
  const r = { cal: 0, p: 0, cb: 0, f: 0 };
  (S.nutrition.todayLog || []).forEach(i => {
    r.cal += i.cal; r.p += i.p; r.cb += i.cb; r.f += i.f;
  });
  return r;
}

function getQuest(n, wDone) {
  const t = S.nutrition.targets;
  if (!wDone) return {
    name: "Complete today's workout",
    desc: 'Train hard, earn XP, protect your streak.',
    pct: 0
  };
  const pPct = Math.min(100, Math.round((n.p / t.p) * 100));
  if (pPct < 80) return {
    name: 'Hit your protein target',
    desc: `${Math.round(t.p - n.p)}g protein still to go.`,
    pct: pPct
  };
  return {
    name: 'Log all your meals',
    desc: 'Keep tracking to hit your daily targets.',
    pct: Math.min(100, Math.round((n.cal / t.cal) * 100))
  };
}

function renderHome() {
  const ri      = getRank(S.progress.level);
  const tN      = getTodayNut();
  const t       = S.nutrition.targets;
  const calLeft = Math.max(0, t.cal - tN.cal);
  const wDone   = S.workout.todayDone && S.workout.todayDate === today();
  const dInact  = S.progress.lastActive
    ? Math.floor((new Date() - new Date(S.progress.lastActive)) / 864e5)
    : 0;
  const wod = getTodayWOD();
  const q   = getQuest(tN, wDone);

  document.getElementById('content').innerHTML = `
  <div>
    <div class="rank-hero">
      <div class="rb-wrap" style="color:${ri.c}">
        <div class="rb-ring">
          <div class="rb-letter">${ri.r}</div>
          <div class="rb-sub">${ri.name}</div>
        </div>
        <div class="rb-title">${ri.title}</div>
        <div class="rb-level">Level ${S.progress.level}</div>
      </div>
    </div>

    <div class="xp-wrap">
      <div class="xp-lr">
        <div class="xp-ll">⚡ Hunter XP</div>
        <div class="xp-lv">${S.progress.xp} / ${lvlXP()}</div>
      </div>
      <div class="xp-track"><div class="xp-fill" id="xb" style="width:0%"></div></div>
      <div class="xp-hint">
        ${S.progress.level < 100
          ? 'Level ' + (S.progress.level + 1) + ' in ' + (lvlXP() - S.progress.xp) + ' XP'
          : 'MAX LEVEL'}
      </div>
    </div>

    ${dInact >= 2 ? `
    <div class="decay-w">
      <div style="font-size:18px">⚠️</div>
      <div class="dw-t">Rank weakening — ${dInact} days without training. XP is decaying.</div>
    </div>` : ''}

    <div class="srow">
      <div class="sc">
        <div class="sv" style="color:var(--accent)">${calLeft}</div>
        <div class="slb">Calories Left</div>
      </div>
      <div class="sc">
        <div class="sv" style="color:${wDone ? 'var(--green)' : 'var(--text)'};font-size:${wDone ? '16px' : '22px'}">
          ${wDone ? '✓ Done' : 'Pending'}
        </div>
        <div class="slb">Today's Workout</div>
      </div>
    </div>

    <div class="streak-c">
      <div style="font-size:34px">${S.progress.streak >= 7 ? '🔥' : '⚡'}</div>
      <div class="si">
        <strong style="color:var(--gold)">${S.progress.streak}</strong>
        <span>Day streak${S.progress.bestStreak > 1 ? ' · Best: ' + S.progress.bestStreak + 'd' : ''}</span>
      </div>
    </div>

    <div class="qcard">
      <div class="qtag">DAILY QUEST</div>
      <div class="qn">${q.name}</div>
      <div class="qd">${q.desc}</div>
      <div class="qbar"><div class="qfill" style="width:${q.pct}%"></div></div>
      <div style="font-size:10px;color:var(--text3);margin-top:4px;text-align:right">${q.pct}% complete</div>
    </div>

    <div class="action-c" onclick="tab('workout')">
      <div class="act">
        <strong>${wod && wod.type !== 'rest' ? wod.name : 'Rest Day'}</strong>
        <span>${wod && wod.type !== 'rest'
          ? wod.exercises.length + ' exercises ready'
          : 'Recovery is part of training'}</span>
      </div>
      <div style="font-size:20px">→</div>
    </div>
  </div>`;

  setTimeout(() => {
    const xb = document.getElementById('xb');
    if (xb) xb.style.width = lvlPct() + '%';
  }, 80);
}
