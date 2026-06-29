// ============================================================
// WORKOUT TAB
// ============================================================
function renderWorkout() {
  const wod  = getTodayWOD();
  const done = S.workout.todayDone && S.workout.todayDate === today();
  const logs = (S.workout.logs || []).slice(-5).reverse();

  // Build session exercise list once per day
  if (wod.type !== 'rest' && (!sessEx.length || sessEx[0].sessDate !== today())) {
    sessEx = wod.exercises.map(e => ({ ...e, done: false, ls: e.s, lr: e.r, sessDate: today() }));
  }

  const doneCount = sessEx.filter(e => e.done).length;
  const total     = sessEx.length;
  const allDone   = total > 0 && doneCount === total;

  document.getElementById('content').innerHTML = `
  <div>
    <div class="th">
      <div class="tt">Train</div>
      <div class="ts">${new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
    </div>

    <div style="padding:0 20px;margin-top:10px">
      <div class="day-pill ${wod.type}">
        <span>${wod.type === 'rest' ? '😴' : wod.type === 'cardio' ? '🏃' : wod.type === 'circuit' ? '⚡' : '🏋️'}</span>
        <span style="font-weight:600">${wod.name}</span>
        ${wod.type !== 'rest' ? `<span style="color:var(--text3)">· ${wod.exercises.length} exercises</span>` : ''}
      </div>
    </div>

    ${wod.type === 'rest'
      ? restDayUI()
      : activeWorkoutUI(wod, done, doneCount, total, allDone, logs)}

    ${logs.length ? recentSessionsUI(logs) : ''}
  </div>`;

  startGPSUpdater();
}

function restDayUI() {
  return `
  <div style="padding:48px 20px;text-align:center">
    <div style="font-size:52px;margin-bottom:14px">😴</div>
    <div style="font-size:18px;font-weight:700;margin-bottom:7px">Rest Day</div>
    <div style="font-size:13px;color:var(--text2);line-height:1.65">
      Recovery is where growth actually happens.<br>Eat well, sleep well, come back stronger.
    </div>
  </div>`;
}

function activeWorkoutUI(wod, done, doneCount, total, allDone, logs) {
  return `
    ${wod.gps ? gpsCardUI() : ''}

    ${done
      ? `<div class="done-state">
          <div style="font-size:36px;margin-bottom:8px">✅</div>
          <div style="font-size:17px;font-weight:700;color:var(--green)">Workout Complete!</div>
          <div style="font-size:12px;color:var(--text2);margin-top:4px">Come back tomorrow. The next level awaits.</div>
        </div>`
      : `
        ${progressBannerUI(doneCount, total)}
        ${exerciseListUI(wod)}
        ${allDone ? ratingCardUI() : ''}
      `}`;
}

function progressBannerUI(doneCount, total) {
  const pct = total > 0 ? Math.round(doneCount / total * 100) : 0;
  return `
  <div class="prog-banner">
    <div>
      <div class="prog-nums">${doneCount}<span> / ${total}</span></div>
      <div class="prog-label">exercises done</div>
    </div>
    <div class="prog-bar-wrap">
      <div style="font-size:11px;color:var(--text2);text-align:right;margin-bottom:4px">${pct}%</div>
      <div class="prog-bar"><div class="prog-bar-fill" style="width:${pct}%"></div></div>
    </div>
  </div>`;
}

function exerciseListUI(wod) {
  return `
  <div class="ex-list">
    ${sessEx.map((ex, i) => `
    <div class="ex-card ${ex.done ? 'done' : ''} ${wod.type + '-card'}">
      <div class="ex-chk ${ex.done ? 'done' : ''}" onclick="togEx(${i})">${ex.done ? '✓' : ''}</div>
      <div class="ex-inf">
        <div class="ex-n">${ex.n}</div>
        <div class="ex-sets">${ex.ls} sets × ${ex.lr}</div>
        <div class="ex-muscle">${ex.m}</div>
        ${!ex.done ? `<div class="ex-tip">💡 ${ex.t}</div>` : ''}
        ${!ex.done ? `<button class="ex-log-btn" onclick="openExLog(${i})">Edit sets & reps</button>` : ''}
      </div>
    </div>`).join('')}
  </div>`;
}

function ratingCardUI() {
  return `
  <div class="rate-card">
    <div class="rate-title">How was that session?</div>
    <div class="rate-sub">Your rating determines XP earned.</div>
    <div class="rate-grid">
      ${[['😌','Easy','light','1.0×'], ['😤','Moderate','moderate','1.4×'], ['💪','Hard','hard','1.7×'], ['🔥','Beast','beast','2.0×']]
        .map(([e, l, v, x]) => `
        <div class="rate-btn ${ratingSelected === v ? 'on' : ''}" onclick="setRating('${v}', this)">
          <span class="rate-emoji">${e}</span>${l}
          <div style="font-size:10px;color:var(--text3);margin-top:2px">${x} XP</div>
        </div>`).join('')}
    </div>
    <button class="btn btn-p" style="margin-top:14px" onclick="cmpSession()">Complete & Earn XP</button>
  </div>`;
}

function gpsCardUI() {
  return `
  <div class="gps-c">
    <div class="gps-r">
      <div>
        <div style="font-size:14px;font-weight:600">GPS Distance</div>
        <div style="font-size:11px;color:var(--text2)">Keep screen on to track</div>
      </div>
      <div style="display:flex;align-items:center;gap:10px">
        <div class="gps-dot ${gpsW ? 'on' : ''}" id="gd"></div>
        <button style="padding:7px 14px;border-radius:8px;font-size:12px;font-weight:600;
          ${gpsW
            ? 'background:rgba(248,113,113,.12);color:var(--red);border:1px solid rgba(248,113,113,.3)'
            : 'background:rgba(74,222,128,.1);color:var(--green);border:1px solid rgba(74,222,128,.3)'}
          " onclick="${gpsW ? 'stopGPS()' : 'startGPS()'}">
          ${gpsW ? 'Stop' : 'Start'}
        </button>
      </div>
    </div>
    <div class="gps-stats">
      <div class="gst"><div class="gsv" id="gd-dist">${fmtKm(getKm())}</div><div class="gsl">KM</div></div>
      <div class="gst"><div class="gsv" id="gd-time">${gpsT0 ? elapsed() : '0:00'}</div><div class="gsl">TIME</div></div>
      <div class="gst"><div class="gsv" id="gd-pace">${pace()}</div><div class="gsl">MIN/KM</div></div>
    </div>
  </div>`;
}

function recentSessionsUI(logs) {
  return `
  <div class="sec" style="margin-top:16px">
    <div class="sl">Recent Sessions</div>
    <div class="card">
      ${logs.map(h => `
      <div class="hist-item">
        <div class="hist-dot"></div>
        <div class="hist-inf">
          <div class="hist-n">${h.name}</div>
          <div class="hist-m">${fmtD(h.date)} · ${h.intensity}</div>
        </div>
        <div class="hist-xp">+${h.xp} XP</div>
      </div>`).join('')}
    </div>
  </div>`;
}

// ============================================================
// EXERCISE INTERACTIONS
// ============================================================
function togEx(i) {
  sessEx[i].done = !sessEx[i].done;
  haptic('light');
  renderWorkout();
}

function setRating(v, el) {
  ratingSelected = v;
  document.querySelectorAll('.rate-btn').forEach(b => b.classList.remove('on'));
  el.classList.add('on');
  haptic('light');
}

function openExLog(i) {
  const ex = sessEx[i];
  openMod(`
    <div class="mod-t">Edit: ${ex.n}</div>
    <div class="log-row">
      <div class="lw"><label>SETS</label><input class="ln" type="number" id="ls" value="${ex.ls}" min="1" max="20" inputmode="numeric"></div>
      <div class="lw"><label>REPS / TIME</label><input class="ln" type="text" id="lr" value="${ex.lr}" placeholder="12"></div>
    </div>
    <div style="background:var(--card);border-radius:10px;padding:11px 13px;font-size:12px;color:var(--text2);margin-bottom:14px">
      💡 ${ex.t}
    </div>
    <button class="btn btn-p" onclick="saveExLog(${i})">Save & Mark Done</button>`);
}

function saveExLog(i) {
  sessEx[i].ls   = document.getElementById('ls').value  || sessEx[i].ls;
  sessEx[i].lr   = document.getElementById('lr').value  || sessEx[i].lr;
  sessEx[i].done = true;
  closeMod(); haptic('success'); renderWorkout();
}

function cmpSession() {
  const wod  = getTodayWOD();
  const mult = { light: 1, moderate: 1.4, hard: 1.7, beast: 2 }[ratingSelected] || 1.4;
  const xp   = Math.round(60 * mult) + (S.progress.streak > 3 ? 15 : 0);

  S.workout.todayDone = true;
  S.workout.todayDate = today();
  if (!S.workout.logs) S.workout.logs = [];

  const log = { name: wod.name, type: wod.type, date: today(), intensity: ratingSelected, xp };
  S.workout.logs.push(log);
  if (S.workout.logs.length > 60) S.workout.logs = S.workout.logs.slice(-60);

  // Advance plan day (stays on rest days — they are shown naturally)
  S.user.planDay = (S.user.planDay + 1) % 7;

  save();
  syncWorkoutLog(log);
  scheduleSyncLater();
  addXP(xp);
  toast('Session complete! +' + xp + ' XP 🔥', 'ok');
  haptic('success');
  sessEx = [];
  renderWorkout();
}

// ============================================================
// GPS
// ============================================================
function startGPS() {
  if (!navigator.geolocation) { toast('GPS not available on this device', 'err'); return; }
  gpsPos = []; gpsT0 = Date.now();
  gpsW = navigator.geolocation.watchPosition(
    pos => gpsPos.push({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
    () => {},
    { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
  );
  toast('GPS tracking started', 'ok');
  renderWorkout();
}

function stopGPS() {
  if (gpsW) navigator.geolocation.clearWatch(gpsW);
  gpsW = null; gpsT0 = null;
  toast('GPS stopped · ' + fmtKm(getKm()) + ' km', '');
  renderWorkout();
}

function getKm() {
  if (gpsPos.length < 2) return 0;
  let d = 0;
  for (let i = 1; i < gpsPos.length; i++)
    d += hvs(gpsPos[i-1].lat, gpsPos[i-1].lng, gpsPos[i].lat, gpsPos[i].lng);
  return d;
}

function hvs(la1, lo1, la2, lo2) {
  const R = 6371;
  const dLa = (la2 - la1) * Math.PI / 180;
  const dLo = (lo2 - lo1) * Math.PI / 180;
  const a = Math.sin(dLa/2)**2 + Math.cos(la1*Math.PI/180) * Math.cos(la2*Math.PI/180) * Math.sin(dLo/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function fmtKm(d) { return d.toFixed(2); }

function elapsed() {
  if (!gpsT0) return '0:00';
  const s = Math.floor((Date.now() - gpsT0) / 1000);
  return Math.floor(s / 60) + ':' + (s % 60).toString().padStart(2, '0');
}

function pace() {
  const d = getKm();
  if (!d || !gpsT0) return '—';
  const m = (Date.now() - gpsT0) / 60000;
  const p = m / d;
  return Math.floor(p) + ':' + (Math.floor((p % 1) * 60)).toString().padStart(2, '0');
}

let gpsInterval = null;
function startGPSUpdater() {
  clearInterval(gpsInterval);
  if (!gpsW) return;
  gpsInterval = setInterval(() => {
    const dd = document.getElementById('gd-dist');
    if (!dd) { clearInterval(gpsInterval); return; }
    dd.textContent = fmtKm(getKm());
    const dt = document.getElementById('gd-time'); if (dt) dt.textContent = elapsed();
    const dp = document.getElementById('gd-pace'); if (dp) dp.textContent = pace();
  }, 1000);
}
