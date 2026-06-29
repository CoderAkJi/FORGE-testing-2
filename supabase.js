// ============================================================
// SUPABASE CLIENT
// ============================================================
const SB_URL = 'https://jfgmtyvjiioftitbzndk.supabase.co';
const SB_KEY = 'sb_publishable_9Ykjdx16DA_DfxIxTzlMyg_XPyn-lAL';

const { createClient } = window.supabase;
const db = createClient(SB_URL, SB_KEY);

let currentUser = null;

// ============================================================
// SYNC DOT INDICATOR
// ============================================================
function setSyncDot(state) {
  const d = document.getElementById('sync-dot');
  if (d) d.className = state;
}

// ============================================================
// WRITE TO CLOUD (background, never blocks UI)
// ============================================================
async function syncProfile() {
  if (!currentUser) return;
  await db.from('profiles').upsert({
    id: currentUser.id,
    name: S.user.name, age: S.user.age,
    weight: S.user.weight, height: S.user.height,
    gender: S.user.gender, goal: S.user.goal,
    physique: S.user.physique, activity: S.user.activity,
    joined: S.user.joined, plan_day: S.user.planDay,
    updated_at: new Date().toISOString()
  });
}

async function syncProgress() {
  if (!currentUser) return;
  await db.from('progress').upsert({
    id: currentUser.id,
    xp: S.progress.xp, level: S.progress.level,
    streak: S.progress.streak, best_streak: S.progress.bestStreak,
    last_active: S.progress.lastActive,
    updated_at: new Date().toISOString()
  });
}

async function syncTargets() {
  if (!currentUser) return;
  await db.from('nutrition_targets').upsert({
    id: currentUser.id,
    calories: S.nutrition.targets.cal,
    protein:  S.nutrition.targets.p,
    carbs:    S.nutrition.targets.cb,
    fat:      S.nutrition.targets.f,
    updated_at: new Date().toISOString()
  });
}

async function syncToCloud() {
  if (!currentUser) return;
  setSyncDot('syncing');
  try {
    await Promise.all([syncProfile(), syncProgress(), syncTargets()]);
    setSyncDot('synced');
    setTimeout(() => setSyncDot(''), 3000);
  } catch (e) {
    setSyncDot('');
  }
}

// Debounced: called after any state change, waits 2s before syncing
function scheduleSyncLater() {
  clearTimeout(syncTimer);
  syncTimer = setTimeout(syncToCloud, 2000);
}

// ============================================================
// LOG INDIVIDUAL EVENTS TO SUPABASE
// ============================================================
async function syncWorkoutLog(log) {
  if (!currentUser) return;
  try {
    await db.from('workout_logs').insert({
      user_id: currentUser.id,
      workout_name: log.name,
      workout_type: log.type || 'strength',
      intensity:    log.intensity,
      xp_earned:    log.xp,
      logged_at:    log.date
    });
  } catch (e) {}
}

async function syncFoodLog(entry) {
  if (!currentUser) return;
  try {
    await db.from('nutrition_logs').insert({
      user_id:   currentUser.id,
      food_name: entry.name,
      calories:  entry.cal,
      protein:   entry.p,
      carbs:     entry.cb,
      fat:       entry.f,
      logged_at: today()
    });
  } catch (e) {}
}

async function syncWeightLog(w) {
  if (!currentUser) return;
  try {
    await db.from('weight_logs').insert({
      user_id:   currentUser.id,
      weight:    w,
      logged_at: today()
    });
  } catch (e) {}
}

// ============================================================
// READ FROM CLOUD (on login / new device)
// ============================================================
async function hydrateFromCloud() {
  if (!currentUser) return;
  try {
    const [{ data: prof }, { data: prog }, { data: tgt }, { data: cf }, { data: wl }] =
      await Promise.all([
        db.from('profiles').select('*').eq('id', currentUser.id).single(),
        db.from('progress').select('*').eq('id', currentUser.id).single(),
        db.from('nutrition_targets').select('*').eq('id', currentUser.id).single(),
        db.from('custom_foods').select('*').eq('user_id', currentUser.id),
        db.from('weight_logs').select('*').eq('user_id', currentUser.id)
          .order('logged_at', { ascending: false }).limit(30)
      ]);

    if (prof) {
      S.user = {
        ...S.user,
        name: prof.name, age: prof.age, weight: prof.weight,
        height: prof.height, gender: prof.gender, goal: prof.goal,
        physique: prof.physique, activity: prof.activity,
        joined: prof.joined, planDay: prof.plan_day || 0
      };
    }
    if (prog) {
      S.progress = {
        xp: prog.xp, level: prog.level,
        streak: prog.streak, bestStreak: prog.best_streak,
        lastActive: prog.last_active
      };
    }
    if (tgt) {
      S.nutrition.targets = {
        cal: tgt.calories, p: tgt.protein, cb: tgt.carbs, f: tgt.fat
      };
    }
    if (cf) {
      customFoods = cf.map(f => ({
        id: 'c' + f.id, n: f.name, srv: f.serving,
        c: f.calories, p: f.protein, cb: f.carbs, f: f.fat, cat: 'custom'
      }));
    }
    if (wl) {
      S.nutrition.weightLog = wl.map(w => ({ d: w.logged_at, w: w.weight }));
    }
    save();
  } catch (e) {
    // Offline — use whatever is in localStorage
  }
}

// ============================================================
// AUTH
// ============================================================
async function checkAuth() {
  load();
  try {
    const { data: { session } } = await db.auth.getSession();
    if (session) {
      currentUser = session.user;
      await hydrateFromCloud();
      checkDecay();
      updStreak();
      showApp();
    } else {
      // No session — first time or new device
      if (S.user.name) showLogin();
      else showOb();
    }
  } catch (e) {
    // Network error — fall back to local data
    if (S.user.name) { checkDecay(); updStreak(); showApp(); }
    else showOb();
  }
  document.getElementById('loading').classList.add('hidden');
}

async function doLogin() {
  const email = document.getElementById('ls-email').value.trim();
  const pass  = document.getElementById('ls-pass').value;
  const errEl = document.getElementById('ls-err');
  const btn   = document.getElementById('ls-btn');
  if (!email || !pass) { errEl.textContent = 'Fill in both fields'; return; }
  btn.textContent = 'Signing in...'; btn.disabled = true;
  try {
    const { data, error } = await db.auth.signInWithPassword({ email, password: pass });
    if (error) {
      errEl.textContent = error.message;
      btn.textContent = 'Sign In'; btn.disabled = false;
      return;
    }
    currentUser = data.user;
    await hydrateFromCloud();
    checkDecay(); updStreak();
    document.getElementById('login-screen').classList.add('hidden');
    showApp();
  } catch (e) {
    errEl.textContent = 'Connection error. Check your internet.';
    btn.textContent = 'Sign In'; btn.disabled = false;
  }
}

async function createAccount(name, email, pass) {
  const { data, error } = await db.auth.signUp({ email, password: pass });
  if (error) throw error;
  currentUser = data.user;

  // Push initial profile & progress to Supabase
  await Promise.all([syncProfile(), syncProgress(), syncTargets()]);
}

async function signOut() {
  await db.auth.signOut();
  currentUser = null;
  localStorage.removeItem('forge4');
  location.reload();
}

async function deleteAccount() {
  if (currentUser) {
    try {
      const uid = currentUser.id;
      await Promise.all([
        db.from('profiles').delete().eq('id', uid),
        db.from('progress').delete().eq('id', uid),
        db.from('nutrition_targets').delete().eq('id', uid),
        db.from('workout_logs').delete().eq('user_id', uid),
        db.from('nutrition_logs').delete().eq('user_id', uid),
        db.from('weight_logs').delete().eq('user_id', uid),
        db.from('custom_foods').delete().eq('user_id', uid)
      ]);
    } catch (e) {}
    await db.auth.signOut();
  }
  localStorage.removeItem('forge4');
  try { indexedDB.deleteDatabase('forge_ph'); } catch (e) {}
  location.reload();
}
