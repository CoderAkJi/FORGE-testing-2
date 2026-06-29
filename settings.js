// ============================================================
// SETTINGS TAB
// ============================================================
async function renderSettings() {
  const wl = S.nutrition.weightLog || [];
  let photos = [];
  try { photos = await getPhotos(); } catch (e) {}
  const ri = getRank(S.progress.level);

  document.getElementById('content').innerHTML = `
  <div>
    <div class="th">
      <div class="tt">Settings</div>
      <div class="ts">${S.user.name} · ${ri.name} · Lv.${S.progress.level}</div>
    </div>

    <!-- MY PLAN -->
    <div class="s-sec">
      <div class="sl" style="padding:14px 0 10px">My Plan</div>
      <div class="s-item">
        <div class="sr" onclick="openGoalMod()">
          <div class="srl">
            <div class="sri">🎯</div>
            <div class="srt"><strong>Goal</strong><span>${(S.user.goal || '').replace(/_/g, ' ')}</span></div>
          </div>
          <div class="srr">›</div>
        </div>
        <div class="sr" onclick="openPhysMod()">
          <div class="srl">
            <div class="sri">🏆</div>
            <div class="srt"><strong>Physique Target</strong><span>${S.user.physique || 'balanced'}</span></div>
          </div>
          <div class="srr">›</div>
        </div>
        <div class="sr" onclick="doRecalc()">
          <div class="srl">
            <div class="sri">🔄</div>
            <div class="srt"><strong>Recalculate Targets</strong><span>Update after weight change</span></div>
          </div>
          <div class="srr">›</div>
        </div>
      </div>
    </div>

    <!-- BODY TRACKING -->
    <div class="s-sec">
      <div class="sl" style="padding:0 0 10px">Body Tracking</div>
      <div class="s-item" style="margin-bottom:14px">
        <div class="sr" onclick="openWtLog()">
          <div class="srl">
            <div class="sri">⚖️</div>
            <div class="srt">
              <strong>Log Weight</strong>
              <span>${wl.length ? 'Last: ' + wl[0].w + 'kg on ' + fmtD(wl[0].d) : 'No entries yet'}</span>
            </div>
          </div>
          <div class="srr">›</div>
        </div>
      </div>
      <div class="sl" style="padding:0 0 10px">Progress Photos</div>
      <div class="pg">
        ${photos.slice(0, 8).map(p => `
        <div class="pt">
          <img src="${p.data}" loading="lazy">
          <div class="pt-del" onclick="doDelPhoto(${p.id})">×</div>
          <div class="pt-date">${fmtD(p.date)}</div>
        </div>`).join('')}
        <div class="pa" onclick="openPhotoMod()">
          <div class="pa-i">📷</div>
          <span>Add</span>
        </div>
      </div>
    </div>

    <!-- ACCOUNT -->
    <div class="s-sec">
      <div class="sl" style="padding:0 0 10px">Account</div>
      <div class="s-item">
        <div class="sr" onclick="openNameMod()">
          <div class="srl">
            <div class="sri">✏️</div>
            <div class="srt"><strong>Change Name</strong><span>${S.user.name}</span></div>
          </div>
          <div class="srr">›</div>
        </div>
        <div class="sr" onclick="confirmSignOut()">
          <div class="srl">
            <div class="sri">🚪</div>
            <div class="srt"><strong>Sign Out</strong><span>${currentUser?.email || ''}</span></div>
          </div>
          <div class="srr">›</div>
        </div>
        <div class="sr" onclick="confirmReset()">
          <div class="srl">
            <div class="sri" style="background:rgba(248,113,113,.1)">🗑️</div>
            <div class="srt">
              <strong style="color:var(--red)">Delete Account</strong>
              <span style="color:var(--red);opacity:.7">Permanently delete all data</span>
            </div>
          </div>
          <div class="srr" style="color:var(--red)">›</div>
        </div>
      </div>
    </div>

    <div style="text-align:center;padding:0 20px 40px;font-size:11px;color:var(--text3)">
      FORGE v2.0 · Cloud sync enabled<br>
      Joined ${fmtD(S.user.joined || today())}
    </div>
  </div>`;
}

// ============================================================
// PLAN SETTINGS
// ============================================================
function openGoalMod() {
  openMod(`
    <div class="mod-t">Change Goal</div>
    <div style="display:flex;flex-direction:column;gap:9px">
      ${[['lose_fat','🔥','Lose Fat','Cardio + calorie deficit'],
         ['build_muscle','💪','Build Muscle','Overload + caloric surplus'],
         ['health','❤️','Stay Healthy','Balanced approach']]
        .map(([v, i, l, d]) => `
        <div class="ob-card ${S.user.goal === v ? 'sel' : ''}" onclick="chGoal('${v}', this)">
          <div class="ob-ci">${i}</div>
          <div class="ob-ct"><strong>${l}</strong><span>${d}</span></div>
        </div>`).join('')}
    </div>`);
}

function chGoal(v, el) {
  document.querySelectorAll('.ob-card').forEach(c => c.classList.remove('sel'));
  el.classList.add('sel');
  S.user.goal = v;
  S.nutrition.targets = calcTargets(calcTDEE(calcBMR(S.user), S.user.activity), v);
  save(); scheduleSyncLater(); closeMod();
  toast('Goal updated & targets recalculated ✓', 'ok');
}

function openPhysMod() {
  openMod(`
    <div class="mod-t">Physique Target</div>
    <div style="display:flex;flex-direction:column;gap:9px">
      ${[['athletic','⚡','Athletic','Speed & functional power'],
         ['lean','🌿','Lean & Toned','Definition focus'],
         ['strong','🗿','Strong & Big','Raw strength & mass'],
         ['balanced','☯️','Balanced','Overall wellness']]
        .map(([v, i, l, d]) => `
        <div class="ob-card ${S.user.physique === v ? 'sel' : ''}" onclick="chPhys('${v}', this)">
          <div class="ob-ci">${i}</div>
          <div class="ob-ct"><strong>${l}</strong><span>${d}</span></div>
        </div>`).join('')}
    </div>`);
}

function chPhys(v, el) {
  document.querySelectorAll('.ob-card').forEach(c => c.classList.remove('sel'));
  el.classList.add('sel');
  S.user.physique = v;
  S.user.planDay  = 0; // reset plan to day 1
  sessEx = [];
  save(); scheduleSyncLater(); closeMod();
  toast('Plan updated for ' + v + ' physique ✓', 'ok');
}

function doRecalc() {
  S.nutrition.targets = calcTargets(calcTDEE(calcBMR(S.user), S.user.activity), S.user.goal);
  save(); scheduleSyncLater();
  toast('Targets recalculated: ' + S.nutrition.targets.cal + ' kcal/day ✓', 'ok');
}

// ============================================================
// WEIGHT LOG
// ============================================================
function openWtLog() {
  const wl = S.nutrition.weightLog || [];
  openMod(`
    <div class="mod-t">Weight Log</div>
    <div style="display:flex;gap:9px;margin-bottom:14px">
      <input class="fs-inp" style="margin:0;flex:1" type="number"
        id="nw" placeholder="Weight (kg)" inputmode="decimal">
      <button class="btn btn-p" style="width:auto;padding:10px 16px;font-size:13px"
        onclick="doLogWt()">Log</button>
    </div>
    ${wl.length
      ? `<div class="s-item" style="max-height:220px;overflow-y:auto">
          ${wl.slice(0, 20).map(w => `
          <div class="wli">
            <span class="wld">${fmtD(w.d)}</span>
            <span class="wlv">${w.w} kg</span>
          </div>`).join('')}
         </div>`
      : '<div style="text-align:center;padding:18px;color:var(--text2);font-size:13px">No entries yet</div>'}`);
}

function doLogWt() {
  const w = +document.getElementById('nw').value;
  if (!w || w < 30 || w > 300) { toast('Enter a valid weight', 'err'); return; }
  if (!S.nutrition.weightLog) S.nutrition.weightLog = [];
  S.nutrition.weightLog.unshift({ d: today(), w });
  S.user.weight = w;
  if (S.nutrition.weightLog.length > 100) S.nutrition.weightLog = S.nutrition.weightLog.slice(0, 100);
  save(); syncWeightLog(w); scheduleSyncLater();
  closeMod(); toast('Weight logged: ' + w + 'kg ✓', 'ok'); renderSettings();
}

// ============================================================
// PROGRESS PHOTOS
// ============================================================
function openPhotoMod() {
  openMod(`
    <div class="mod-t">Add Progress Photo</div>
    <div style="display:flex;flex-direction:column;gap:10px;margin-top:4px">
      <button class="btn btn-p" onclick="takePhoto()">📷 Take Photo</button>
      <button class="btn btn-g" onclick="pickPhoto()">🖼️ Choose from Gallery</button>
    </div>
    <div style="margin-top:14px;font-size:11px;color:var(--text3);text-align:center">
      Photos stored on this device
    </div>`);
}

function takePhoto() {
  document.getElementById('fi-photo').setAttribute('capture', 'environment');
  document.getElementById('fi-photo').click();
  closeMod();
}

function pickPhoto() {
  document.getElementById('fi-photo').removeAttribute('capture');
  document.getElementById('fi-photo').click();
  closeMod();
}

function handlePhoto(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  const r = new FileReader();
  r.onload = async ev => {
    try { await savePhoto(ev.target.result); toast('Photo saved ✓', 'ok'); renderSettings(); }
    catch (err) { toast('Failed to save photo', 'err'); }
  };
  r.readAsDataURL(file);
  e.target.value = '';
}

async function doDelPhoto(id) {
  try { await delPhoto(id); toast('Photo deleted', ''); renderSettings(); }
  catch (e) { toast('Error deleting photo', 'err'); }
}

// ============================================================
// ACCOUNT
// ============================================================
function openNameMod() {
  openMod(`
    <div class="mod-t">Change Name</div>
    <input class="fs-inp" style="margin-bottom:14px" type="text" id="nn" value="${S.user.name}">
    <button class="btn btn-p" onclick="saveName()">Save</button>`);
}

function saveName() {
  const n = (document.getElementById('nn').value || '').trim();
  if (!n) { toast('Name cannot be empty', 'err'); return; }
  S.user.name = n; save(); scheduleSyncLater();
  closeMod(); toast('Name updated ✓', 'ok'); renderSettings();
}

function confirmSignOut() {
  openMod(`
    <div class="mod-t">Sign Out</div>
    <div style="font-size:13px;color:var(--text2);line-height:1.65;margin-bottom:22px">
      Your data is saved to the cloud. Sign back in on any device to restore everything.
    </div>
    <button class="btn btn-p" style="margin-bottom:9px" onclick="signOut()">Sign Out</button>
    <button class="btn btn-g" onclick="closeMod()">Cancel</button>`);
}

function confirmReset() {
  openMod(`
    <div class="mod-t" style="color:var(--red)">Delete Account</div>
    <div style="font-size:13px;color:var(--text2);line-height:1.65;margin-bottom:22px">
      This permanently deletes all your data from the cloud and this device. Cannot be undone.
    </div>
    <button class="btn btn-p" style="background:var(--red);margin-bottom:9px"
      onclick="deleteAccount()">Yes, Delete Everything</button>
    <button class="btn btn-g" onclick="closeMod()">Cancel</button>`);
}
