// ============================================================
// GLOBAL STATE
// ============================================================
let S = {
  user: {
    name: '', age: 0, weight: 0, height: 0,
    gender: 'male', goal: '', physique: '', activity: '',
    joined: '', planDay: 0
  },
  progress: {
    xp: 0, level: 1, streak: 0, bestStreak: 0, lastActive: ''
  },
  nutrition: {
    targets: { cal: 2000, p: 150, cb: 200, f: 67 },
    todayDate: '', todayLog: [], weightLog: []
  },
  workout: {
    todayDone: false, todayDate: '', logs: []
  },
  coach: { msgs: [] }
};

// Runtime flags (not persisted)
let curTab       = 'home';
let obScr        = 1;
let selGoal      = '';
let selPhys      = '';
let selAct       = '';
let selGend      = 'male';
let sessEx       = [];        // current workout session exercises
let ratingSelected = 'moderate';
let gpsW         = null;      // geolocation watchPosition id
let gpsPos       = [];        // array of {lat, lng}
let gpsT0        = null;      // start timestamp
let photoDB      = null;      // IndexedDB instance
let syncTimer    = null;      // debounce timer for cloud sync

// ============================================================
// LOCAL STORAGE
// ============================================================
function save() {
  try { localStorage.setItem('forge4', JSON.stringify(S)); } catch (e) {}
}

function load() {
  try {
    const d = localStorage.getItem('forge4');
    if (d) S = dMerge(S, JSON.parse(d));
  } catch (e) {}
}

function dMerge(a, b) {
  const r = { ...a };
  for (const k in b) {
    if (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k]))
      r[k] = dMerge(a[k] || {}, b[k]);
    else
      r[k] = b[k];
  }
  return r;
}

// ============================================================
// INDEXEDDB — PROGRESS PHOTOS
// ============================================================
function openPDB() {
  return new Promise((res, rej) => {
    const req = indexedDB.open('forge_ph', 1);
    req.onupgradeneeded = e => {
      e.target.result.createObjectStore('photos', { keyPath: 'id', autoIncrement: true });
    };
    req.onsuccess = e => res(e.target.result);
    req.onerror   = rej;
  });
}

async function savePhoto(dataUrl) {
  if (!photoDB) photoDB = await openPDB();
  return new Promise((res, rej) => {
    const t = photoDB.transaction('photos', 'readwrite');
    t.objectStore('photos').add({ data: dataUrl, date: today() }).onsuccess = e => res(e.target.result);
    t.onerror = rej;
  });
}

async function getPhotos() {
  if (!photoDB) photoDB = await openPDB();
  return new Promise((res, rej) => {
    const t = photoDB.transaction('photos', 'readonly');
    t.objectStore('photos').getAll().onsuccess = e => res(e.target.result);
    t.onerror = rej;
  });
}

async function delPhoto(id) {
  if (!photoDB) photoDB = await openPDB();
  return new Promise((res, rej) => {
    const t = photoDB.transaction('photos', 'readwrite');
    t.objectStore('photos').delete(id).onsuccess = res;
    t.onerror = rej;
  });
}
