// ============================================================
// NUTRITION TAB
// ============================================================
function getSmartSuggestion(n, t) {
  const calLeft = t.cal - n.cal;
  const pLeft   = Math.max(0, t.p - n.p);
  const eaten   = (S.nutrition.todayLog || []).map(i => i.name.toLowerCase());
  const pPct    = n.p  / t.p;
  const calPct  = n.cal / t.cal;

  if (calLeft < -200)
    return `You're ${Math.abs(Math.round(calLeft))} kcal over today. Skip the next snack and focus on protein only.`;

  if (calPct < 0.3 && new Date().getHours() > 12)
    return `Only ${Math.round(n.cal)} kcal logged so far. Make sure you're eating enough — undereating hurts your training as much as overeating.`;

  if (pPct < 0.5) {
    const opts = getAllFoods()
      .filter(f => (f.cat === 'protein' || (f.cat === 'indian' && f.p >= 7)))
      .filter(f => !eaten.some(e => e.includes(f.n.toLowerCase())))
      .slice(0, 2)
      .map(f => f.n);
    return `Protein at ${Math.round(pPct * 100)}% — ${Math.round(pLeft)}g to go. Try ${opts.join(' or ') || 'any protein source'} with your next meal.`;
  }

  if (pPct >= 0.9 && calPct >= 0.85)
    return `Strong day — macros on point. Train hard, sleep well, recover fully.`;

  return `${Math.round(pLeft)}g protein and ${Math.round(Math.max(0, calLeft))} kcal remaining. ${pLeft > 30 ? 'Prioritise protein first.' : "You're close — finish strong."}`;
}

function renderNutrition() {
  const t    = S.nutrition.targets;
  const n    = getTodayNut();
  const C    = 213.6; // circumference of r=34 circle
  const calP = Math.min(100, Math.round((n.cal / t.cal) * 100));
  const pP   = Math.min(100, Math.round((n.p   / t.p)   * 100));
  const cbP  = Math.min(100, Math.round((n.cb  / t.cb)  * 100));
  const fP   = Math.min(100, Math.round((n.f   / t.f)   * 100));
  const logs = S.nutrition.todayLog || [];

  document.getElementById('content').innerHTML = `
  <div>
    <div class="th">
      <div class="tt">Fuel</div>
      <div class="ts">${new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
    </div>

    <div class="card" style="margin:10px 20px">
      <div class="macro-rings">
        ${mRing('cal', '#ff6b2b', Math.round(n.cal), t.cal, 'Calories', 'kcal', C)}
        ${mRing('pr',  '#60a5fa', Math.round(n.p),   t.p,   'Protein',  'g',    C)}
        ${mRing('cb',  '#f5a623', Math.round(n.cb),  t.cb,  'Carbs',    'g',    C)}
        ${mRing('ft',  '#4ade80', Math.round(n.f),   t.f,   'Fat',      'g',    C)}
      </div>
    </div>

    <div class="ai-s">
      <div class="ai-tag">⚡ FORGE COACH</div>
      <div class="ai-txt">${getSmartSuggestion(n, t)}</div>
    </div>

    <button class="add-f" onclick="openFoodS()">
      <span style="font-size:18px">+</span> Add Food
    </button>

    <div class="sec">
      <div class="sl">Today's Log</div>
      ${logs.length === 0
        ? `<div class="card"><div class="es">
            <div class="esi">🍽️</div>
            <div class="est">No food logged yet.<br>Tap "Add Food" to start tracking.</div>
           </div></div>`
        : `<div class="card">
            ${logs.map((it, i) => `
            <div class="fl-item">
              <div class="fl-inf">
                <div class="fl-n">${it.name}</div>
                <div class="fl-m">P: ${it.p}g · C: ${it.cb}g · F: ${it.f}g</div>
              </div>
              <div style="display:flex;align-items:center">
                <div class="fl-c">${it.cal} kcal</div>
                <button class="fl-del" onclick="delFood(${i})">×</button>
              </div>
            </div>`).join('')}
           </div>`}
    </div>
  </div>`;

  setTimeout(() => {
    animRing('cal', calP, C);
    animRing('pr',  pP,   C);
    animRing('cb',  cbP,  C);
    animRing('ft',  fP,   C);
  }, 80);
}

// ============================================================
// MACRO RINGS
// ============================================================
function mRing(id, color, val, total, label, unit, C) {
  return `
  <div class="mr-wrap">
    <svg viewBox="0 0 80 80">
      <circle class="rt" cx="40" cy="40" r="34"/>
      <circle id="r-${id}" class="rf" cx="40" cy="40" r="34"
        stroke="${color}" stroke-dasharray="${C}" stroke-dashoffset="${C}"/>
    </svg>
    <div class="mrv" style="color:${color}">${val}</div>
    <div class="mrl">${label}</div>
    <div class="mrs">/ ${total}${unit}</div>
  </div>`;
}

function animRing(id, pct, C) {
  const el = document.getElementById('r-' + id);
  if (el) el.style.strokeDashoffset = C - (pct / 100 * C);
}

// ============================================================
// FOOD SEARCH MODAL
// ============================================================
function openFoodS() {
  openMod(`
    <div class="mod-t">Add Food</div>
    <input class="fs-inp" id="fs-q" type="text" placeholder="Search food..."
      oninput="filterFoods(this.value)" autocomplete="off">
    <div class="food-tabs" id="food-tabs">
      <div class="food-tab on"  onclick="filterFCat(null,   this)">All</div>
      <div class="food-tab"     onclick="filterFCat('indian',  this)">🇮🇳 Indian</div>
      <div class="food-tab"     onclick="filterFCat('protein', this)">Protein</div>
      <div class="food-tab"     onclick="filterFCat('carb',    this)">Carbs</div>
      <div class="food-tab"     onclick="filterFCat('fat',     this)">Fats</div>
      <div class="food-tab"     onclick="filterFCat('veggie',  this)">Veggies</div>
      ${customFoods.length ? `<div class="food-tab" onclick="filterFCat('custom', this)">My Foods</div>` : ''}
    </div>
    <div class="fr-list" id="fr-list">
      ${getAllFoods().slice(0, 12).map(fRI).join('')}
    </div>
    <button class="btn btn-g" style="margin-top:14px" onclick="openCustomFoodForm()">
      + Create Custom Food
    </button>`);
  setTimeout(() => { const el = document.getElementById('fs-q'); if (el) el.focus(); }, 200);
}

function filterFoods(q) {
  const res = getAllFoods().filter(f => f.n.toLowerCase().includes(q.toLowerCase())).slice(0, 15);
  const el  = document.getElementById('fr-list');
  if (el) el.innerHTML = res.length ? res.map(fRI).join('') : '<div style="text-align:center;padding:18px;color:var(--text2)">No results</div>';
}

function filterFCat(cat, el) {
  document.querySelectorAll('.food-tab').forEach(t => t.classList.remove('on'));
  el.classList.add('on');
  const res = cat ? getAllFoods().filter(f => f.cat === cat) : getAllFoods();
  const list = document.getElementById('fr-list');
  if (list) list.innerHTML = res.slice(0, 15).map(fRI).join('');
}

function fRI(f) {
  return `
  <div class="fri" onclick="openSrv('${f.id}')">
    <div class="fin">${f.n}</div>
    <div class="fim">${f.c} kcal · P ${f.p}g · C ${f.cb}g · F ${f.f}g · ${f.srv}</div>
  </div>`;
}

// ============================================================
// SERVING SELECTOR
// ============================================================
function openSrv(id) {
  const f = getAllFoods().find(x => String(x.id) === String(id));
  if (!f) return;
  openMod(`
    <div class="mod-t">${f.n}</div>
    <div style="font-size:12px;color:var(--text2);margin-bottom:14px">Per serving: ${f.srv}</div>
    <div style="font-size:12px;color:var(--text2);margin-bottom:6px">Number of servings</div>
    <input class="srv-inp" type="number" id="srv-n" value="1" min="0.25" step="0.25" inputmode="decimal">
    <div class="srv-prev" id="srv-p">${f.c} kcal · P ${f.p}g · C ${f.cb}g · F ${f.f}g</div>
    <button class="btn btn-p" onclick="addFood('${f.id}')">Add to Log</button>`);

  document.getElementById('srv-n').addEventListener('input', function () {
    const s  = +this.value || 1;
    const el = document.getElementById('srv-p');
    if (el) el.textContent =
      `${Math.round(f.c * s)} kcal · P ${(f.p * s).toFixed(1)}g · C ${(f.cb * s).toFixed(1)}g · F ${(f.f * s).toFixed(1)}g`;
  });
}

function addFood(id) {
  const f = getAllFoods().find(x => String(x.id) === String(id));
  if (!f) return;
  const s = +document.getElementById('srv-n').value || 1;
  const entry = {
    name: f.n + (s !== 1 ? ' ×' + s : ''),
    cal:  Math.round(f.c  * s),
    p:    +((f.p  * s).toFixed(1)),
    cb:   +((f.cb * s).toFixed(1)),
    f:    +((f.f  * s).toFixed(1))
  };
  if (!S.nutrition.todayLog) S.nutrition.todayLog = [];
  S.nutrition.todayLog.push(entry);
  S.nutrition.todayDate = today();
  save();
  syncFoodLog(entry);
  closeMod(); haptic('success');
  addXP(5);
  renderNutrition();
  toast(f.n + ' added ✓', 'ok');
}

function delFood(i) {
  S.nutrition.todayLog.splice(i, 1);
  save(); renderNutrition(); haptic('light');
}

// ============================================================
// CUSTOM FOOD
// ============================================================
function openCustomFoodForm() {
  openMod(`
    <div class="mod-t">Create Custom Food</div>
    <div class="custom-food-form">
      <div>
        <div class="cf-label">FOOD NAME</div>
        <input class="cf-inp" id="cf-name" placeholder="e.g. Maa ki dal, Homemade paratha">
      </div>
      <div>
        <div class="cf-label">SERVING SIZE</div>
        <input class="cf-inp" id="cf-srv" placeholder="e.g. 1 bowl, 2 pieces, 100g">
      </div>
      <div class="cf-row">
        <div style="flex:1">
          <div class="cf-label">CALORIES</div>
          <input class="cf-inp" id="cf-cal" type="number" placeholder="0" inputmode="numeric">
        </div>
        <div style="flex:1">
          <div class="cf-label">PROTEIN (g)</div>
          <input class="cf-inp" id="cf-p" type="number" placeholder="0" inputmode="decimal">
        </div>
      </div>
      <div class="cf-row">
        <div style="flex:1">
          <div class="cf-label">CARBS (g)</div>
          <input class="cf-inp" id="cf-cb" type="number" placeholder="0" inputmode="decimal">
        </div>
        <div style="flex:1">
          <div class="cf-label">FAT (g)</div>
          <input class="cf-inp" id="cf-f" type="number" placeholder="0" inputmode="decimal">
        </div>
      </div>
      <div style="font-size:11px;color:var(--text3);margin-top:-4px">
        Not sure about macros? Google "[food name] nutrition per 100g"
      </div>
      <button class="btn btn-p" style="margin-top:8px" onclick="saveCustomFood()">Save Food</button>
    </div>`);
}

async function saveCustomFood() {
  const name = (document.getElementById('cf-name').value || '').trim();
  const srv  = (document.getElementById('cf-srv').value  || '').trim() || '1 serving';
  const cal  = +document.getElementById('cf-cal').value || 0;
  const p    = +document.getElementById('cf-p').value   || 0;
  const cb   = +document.getElementById('cf-cb').value  || 0;
  const f    = +document.getElementById('cf-f').value   || 0;

  if (!name) { toast('Enter a food name', 'err'); return; }
  if (!cal)  { toast('Enter calories',    'err'); return; }

  // Save to Supabase if online
  try {
    const { data } = await db.from('custom_foods').insert({
      user_id: currentUser.id, name, serving: srv,
      calories: cal, protein: p, carbs: cb, fat: f
    }).select().single();
    if (data) {
      customFoods.push({ id: 'c' + data.id, n: data.name, srv: data.serving, c: data.calories, p: data.protein, cb: data.carbs, f: data.fat, cat: 'custom' });
    }
  } catch (e) {
    // Offline — add locally with temp id
    customFoods.push({ id: 'c_' + Date.now(), n: name, srv, c: cal, p, cb, f, cat: 'custom' });
  }

  closeMod(); haptic('success'); toast(name + ' saved to My Foods ✓', 'ok');
}
