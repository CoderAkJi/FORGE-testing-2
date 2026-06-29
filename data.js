// ============================================================
// RANKS
// ============================================================
const RANKS = [
  { r: 'E', name: 'E-Rank', title: 'Awakened One',   c: '#9ca3af', min: 1,  max: 10  },
  { r: 'D', name: 'D-Rank', title: 'Iron Hunter',    c: '#34d399', min: 11, max: 20  },
  { r: 'C', name: 'C-Rank', title: 'Steel Hunter',   c: '#60a5fa', min: 21, max: 35  },
  { r: 'B', name: 'B-Rank', title: 'Shadow Hunter',  c: '#c084fc', min: 36, max: 50  },
  { r: 'A', name: 'A-Rank', title: 'Elite Hunter',   c: '#fbbf24', min: 51, max: 70  },
  { r: 'S', name: 'S-Rank', title: 'Shadow Monarch', c: '#f87171', min: 71, max: 100 }
];
const XPL = 500; // XP per level

// ============================================================
// WORKOUT PLANS
// ============================================================
const PLANS = {
  athletic: {
    name: 'Athletic',
    days: [
      {
        d: 1, name: 'Upper Power', type: 'strength',
        exercises: [
          { n: 'Push-ups',          s: 4, r: '15-20',          m: 'Chest · Triceps', t: 'Keep core tight, full range of motion' },
          { n: 'Pike Push-ups',     s: 3, r: '10-12',          m: 'Shoulders',       t: 'Form an inverted V, head toward floor' },
          { n: 'Pull-ups / Door Rows', s: 4, r: '8-12',        m: 'Back · Biceps',   t: 'Full hang, chin clears the bar' },
          { n: 'Chair Dips',        s: 3, r: '12-15',          m: 'Triceps',         t: 'Elbows close to body, slow descent' },
          { n: 'Plank Hold',        s: 3, r: '45 sec',         m: 'Core',            t: 'Neutral spine, breathe evenly' }
        ]
      },
      {
        d: 2, name: 'Speed Run', type: 'cardio', gps: true,
        exercises: [
          { n: 'Warm-up Jog',       s: 1, r: '5 min',          m: 'Full body',  t: 'Easy pace, warm up joints and lungs' },
          { n: 'Sprint Intervals',  s: 8, r: '30s fast / 30s walk', m: 'Legs · Cardio', t: 'Maximum effort on each sprint' },
          { n: 'Cool-down Walk',    s: 1, r: '5 min',          m: 'Full body',  t: 'Gradually slow down, let heart rate drop' }
        ]
      },
      {
        d: 3, name: 'Lower Power', type: 'strength',
        exercises: [
          { n: 'Squats',            s: 4, r: '15-20',          m: 'Quads · Glutes',       t: 'Knees over toes, chest tall' },
          { n: 'Jump Lunges',       s: 3, r: '10 each side',   m: 'Quads · Glutes',       t: 'Land softly, absorb through knees' },
          { n: 'Glute Bridge',      s: 4, r: '20',             m: 'Glutes · Hamstrings',  t: 'Drive hips up, squeeze at the top' },
          { n: 'Calf Raises',       s: 3, r: '25',             m: 'Calves',               t: 'Full range, slow on the way down' },
          { n: 'Wall Sit',          s: 3, r: '45 sec',         m: 'Quads',                t: '90° angle, back flat against wall' }
        ]
      },
      { d: 4, name: 'Rest Day', type: 'rest', exercises: [] },
      {
        d: 5, name: 'Full Body Blast', type: 'circuit',
        exercises: [
          { n: 'Burpees',           s: 3, r: '10',             m: 'Full body',  t: 'Explosive jump at the top' },
          { n: 'Mountain Climbers', s: 3, r: '20 each',        m: 'Core · Cardio', t: 'Hips level, drive knees fast' },
          { n: 'Push-ups',          s: 3, r: '12',             m: 'Chest',      t: 'Controlled tempo, full range' },
          { n: 'Jump Squats',       s: 3, r: '15',             m: 'Legs',       t: 'Land soft, absorb through quads' },
          { n: 'Plank to Push-up',  s: 3, r: '8',              m: 'Core · Arms', t: 'Alternate leading arm each rep' }
        ]
      },
      {
        d: 6, name: 'Long Run', type: 'cardio', gps: true,
        exercises: [
          { n: 'Warm-up Walk',      s: 1, r: '3 min',          m: 'Full body',  t: 'Get blood moving before you push' },
          { n: 'Steady Run',        s: 1, r: '20-25 min',      m: 'Cardio',     t: 'Comfortable pace, able to hold conversation' },
          { n: 'Cool-down Walk',    s: 1, r: '3 min',          m: 'Full body',  t: 'Slow down gradually' }
        ]
      },
      { d: 7, name: 'Rest Day', type: 'rest', exercises: [] }
    ]
  },

  lean: {
    name: 'Lean & Toned',
    days: [
      {
        d: 1, name: 'Upper Body', type: 'strength',
        exercises: [
          { n: 'Wide Push-ups',     s: 3, r: '12-15',          m: 'Chest',           t: 'Wide grip emphasizes the chest' },
          { n: 'Chair Dips',        s: 3, r: '12',             m: 'Triceps',         t: 'Elbows pointing straight back' },
          { n: 'Superman Hold',     s: 3, r: '30 sec',         m: 'Back',            t: 'Squeeze shoulder blades at the top' },
          { n: 'Plank Hold',        s: 3, r: '30 sec',         m: 'Core',            t: 'Breathe steadily, hips neutral' },
          { n: 'Side Plank',        s: 3, r: '20 sec each',    m: 'Obliques',        t: 'Hips up, body in a straight line' }
        ]
      },
      {
        d: 2, name: 'Cardio Burn', type: 'cardio', gps: true,
        exercises: [
          { n: 'Jumping Jacks',     s: 3, r: '30 sec',         m: 'Full body',  t: 'Arms fully overhead each rep' },
          { n: 'High Knees',        s: 3, r: '30 sec',         m: 'Legs · Cardio', t: 'Drive knees to hip height, fast pace' },
          { n: 'Butt Kicks',        s: 3, r: '30 sec',         m: 'Hamstrings', t: 'Heels to glutes, keep fast rhythm' },
          { n: 'Jump Squats',       s: 3, r: '12',             m: 'Legs',       t: 'Deep squat then explosive jump' }
        ]
      },
      {
        d: 3, name: 'Lower Body', type: 'strength',
        exercises: [
          { n: 'Sumo Squats',       s: 3, r: '15',             m: 'Inner Thighs · Glutes', t: 'Feet wide, toes out 45°' },
          { n: 'Reverse Lunges',    s: 3, r: '12 each',        m: 'Quads · Glutes',        t: 'Back knee to floor, front stable' },
          { n: 'Glute Kickbacks',   s: 3, r: '15 each',        m: 'Glutes',                t: 'Squeeze hard at full extension' },
          { n: 'Calf Raises',       s: 3, r: '20',             m: 'Calves',                t: 'Full range, slow controlled descent' }
        ]
      },
      { d: 4, name: 'Rest Day', type: 'rest', exercises: [] },
      {
        d: 5, name: 'Full Body Blast', type: 'circuit',
        exercises: [
          { n: 'Jump Rope (air)',   s: 3, r: '1 min',          m: 'Cardio',  t: 'Light on feet, consistent rhythm' },
          { n: 'Push-ups',          s: 3, r: '10',             m: 'Chest',   t: 'Quality over speed' },
          { n: 'Squats',            s: 3, r: '15',             m: 'Legs',    t: 'Thighs parallel to floor' },
          { n: 'Mountain Climbers', s: 3, r: '20',             m: 'Core',    t: 'Fast alternating legs' }
        ]
      },
      {
        d: 6, name: 'Active Day', type: 'cardio', gps: true,
        exercises: [
          { n: 'Brisk Walk',        s: 1, r: '10 min',         m: 'Cardio',  t: 'Get heart rate up' },
          { n: 'Jog or Run',        s: 1, r: '20 min',         m: 'Cardio',  t: 'Moderate sustained pace' },
          { n: 'Cool-down Walk',    s: 1, r: '5 min',          m: 'Full body', t: 'Bring it down slowly' }
        ]
      },
      { d: 7, name: 'Rest Day', type: 'rest', exercises: [] }
    ]
  },

  strong: {
    name: 'Strength & Mass',
    days: [
      {
        d: 1, name: 'Chest & Triceps', type: 'strength',
        exercises: [
          { n: 'Push-ups',          s: 4, r: '15',             m: 'Chest · Triceps', t: '3-second negative phase for growth' },
          { n: 'Diamond Push-ups',  s: 4, r: '10-12',          m: 'Triceps',         t: 'Hands form diamond, elbows in' },
          { n: 'Wide Push-ups',     s: 3, r: '12',             m: 'Chest',           t: 'Chest to floor for full stretch' },
          { n: 'Pike Push-ups',     s: 3, r: '10',             m: 'Shoulders',       t: 'Inverted V, head toward floor' },
          { n: 'Chair Dips',        s: 3, r: '12',             m: 'Triceps',         t: 'Slow controlled dip, full range' }
        ]
      },
      {
        d: 2, name: 'Back & Biceps', type: 'strength',
        exercises: [
          { n: 'Pull-ups',          s: 4, r: '8-10',           m: 'Back · Biceps',  t: 'Dead hang start, chin clears bar' },
          { n: 'Superman',          s: 4, r: '15',             m: 'Lower Back',     t: 'Hold 2 seconds at the top' },
          { n: 'Inverted Rows',     s: 3, r: '10-12',          m: 'Upper Back',     t: 'Body straight, pull chest to bar' },
          { n: 'Curl to Press',     s: 3, r: '10',             m: 'Biceps · Shoulders', t: 'Control both up and down' }
        ]
      },
      { d: 3, name: 'Rest Day', type: 'rest', exercises: [] },
      {
        d: 4, name: 'Legs & Glutes', type: 'strength',
        exercises: [
          { n: 'Deep Squats',       s: 4, r: '20',             m: 'Quads · Glutes',      t: 'Below parallel, chest up' },
          { n: 'Split Squats',      s: 3, r: '10 each',        m: 'Quads · Glutes',      t: 'Rear foot elevated on chair' },
          { n: 'Glute Bridge',      s: 4, r: '20',             m: 'Glutes · Hamstrings', t: 'Drive hips high, hold 2 seconds' },
          { n: 'Calf Raises',       s: 4, r: '25',             m: 'Calves',              t: 'Slow down phase, full extension' }
        ]
      },
      {
        d: 5, name: 'Shoulders & Arms', type: 'strength',
        exercises: [
          { n: 'Pike Push-ups',     s: 4, r: '12',             m: 'Shoulders',  t: 'Hips high, controlled descent' },
          { n: 'Wall Handstand Hold', s: 3, r: '20-30 sec',    m: 'Shoulders',  t: 'Kick up safely, core braced' },
          { n: 'Chair Dips',        s: 4, r: '15',             m: 'Triceps',    t: 'Slow eccentric for more muscle' },
          { n: 'Diamond Push-ups',  s: 3, r: '10',             m: 'Triceps',    t: 'Elbows tucked close throughout' },
          { n: 'Plank Hold',        s: 3, r: '60 sec',         m: 'Core',       t: 'Neutral spine, hips level' }
        ]
      },
      {
        d: 6, name: 'Full Body Power', type: 'circuit',
        exercises: [
          { n: 'Burpees',           s: 4, r: '8',              m: 'Full body',  t: 'Explosive, treat each as max effort' },
          { n: 'Push-ups',          s: 4, r: '15',             m: 'Chest',      t: 'As fast as control allows' },
          { n: 'Deep Squats',       s: 4, r: '20',             m: 'Legs',       t: 'Fast up, controlled down' },
          { n: 'Mountain Climbers', s: 3, r: '20',             m: 'Core',       t: 'Maximum speed, hips level' }
        ]
      },
      { d: 7, name: 'Rest Day', type: 'rest', exercises: [] }
    ]
  },

  balanced: {
    name: 'Balanced Wellness',
    days: [
      {
        d: 1, name: 'Upper Body', type: 'strength',
        exercises: [
          { n: 'Push-ups',          s: 3, r: '10-12',          m: 'Chest · Triceps', t: 'Controlled movement' },
          { n: 'Pike Push-ups',     s: 3, r: '8-10',           m: 'Shoulders',       t: 'V-shape with your body' },
          { n: 'Door Row',          s: 3, r: '8',              m: 'Back',            t: 'Full pull, squeeze shoulder blades' },
          { n: 'Plank Hold',        s: 3, r: '30 sec',         m: 'Core',            t: 'Breathe evenly, stay tense' }
        ]
      },
      {
        d: 2, name: 'Lower Body', type: 'strength',
        exercises: [
          { n: 'Squats',            s: 3, r: '12-15',          m: 'Quads · Glutes',      t: 'Chest tall, knees tracking' },
          { n: 'Lunges',            s: 3, r: '10 each',        m: 'Quads · Glutes',      t: 'Back knee to floor' },
          { n: 'Glute Bridge',      s: 3, r: '15',             m: 'Glutes',              t: 'Hold 2s at the top' },
          { n: 'Calf Raises',       s: 3, r: '15',             m: 'Calves',              t: 'Slow down phase' }
        ]
      },
      { d: 3, name: 'Rest Day', type: 'rest', exercises: [] },
      {
        d: 4, name: 'Upper Body', type: 'strength',
        exercises: [
          { n: 'Push-ups',          s: 3, r: '12',             m: 'Chest · Triceps', t: 'Add a 1-second pause at bottom' },
          { n: 'Chair Dips',        s: 3, r: '10',             m: 'Triceps',         t: 'Elbows pointing back' },
          { n: 'Superman',          s: 3, r: '12',             m: 'Back',            t: 'Hold 3 seconds at top' },
          { n: 'Side Plank',        s: 2, r: '20 sec each',    m: 'Obliques',        t: 'Stack feet, hips lifted' }
        ]
      },
      {
        d: 5, name: 'Lower Body', type: 'strength',
        exercises: [
          { n: 'Sumo Squats',       s: 3, r: '15',             m: 'Inner Thighs · Glutes', t: 'Slow and controlled' },
          { n: 'Step-ups',          s: 3, r: '10 each',        m: 'Quads · Glutes',        t: 'Drive through heel' },
          { n: 'Reverse Lunges',    s: 3, r: '10 each',        m: 'Quads',                 t: 'Back straight, controlled' },
          { n: 'Wall Sit',          s: 3, r: '30 sec',         m: 'Quads',                 t: 'Back flat on wall' }
        ]
      },
      {
        d: 6, name: 'Cardio & Core', type: 'cardio', gps: true,
        exercises: [
          { n: 'Walk or Light Jog', s: 1, r: '20-25 min',      m: 'Cardio',  t: 'Comfortable pace, enjoy it' },
          { n: 'Crunches',          s: 3, r: '15',             m: 'Abs',     t: "Chin to chest, don't pull neck" },
          { n: 'Leg Raises',        s: 3, r: '12',             m: 'Lower Abs', t: 'Lower back flat throughout' }
        ]
      },
      { d: 7, name: 'Rest Day', type: 'rest', exercises: [] }
    ]
  }
};

// ============================================================
// FOOD DATABASE
// ============================================================
const FOODS = [
  // Indian staples
  { id: 1,  n: 'Chapati / Roti',      srv: '1 medium',       c: 70,  p: 2.5, cb: 15,   f: 0.4,  cat: 'indian' },
  { id: 2,  n: 'Paratha (plain)',      srv: '1 medium',       c: 150, p: 3.5, cb: 25,   f: 4.5,  cat: 'indian' },
  { id: 3,  n: 'Paratha (aloo)',       srv: '1 medium',       c: 200, p: 4,   cb: 32,   f: 6,    cat: 'indian' },
  { id: 4,  n: 'Dal (cooked)',         srv: '100g',           c: 116, p: 9,   cb: 20,   f: 0.4,  cat: 'indian' },
  { id: 5,  n: 'Rajma (cooked)',       srv: '100g',           c: 127, p: 8.7, cb: 22,   f: 0.5,  cat: 'indian' },
  { id: 6,  n: 'Chole (cooked)',       srv: '100g',           c: 164, p: 8.9, cb: 27,   f: 2.6,  cat: 'indian' },
  { id: 7,  n: 'Paneer',              srv: '100g',           c: 265, p: 18,  cb: 1.2,  f: 20,   cat: 'indian' },
  { id: 8,  n: 'Idli',               srv: '2 pieces',       c: 78,  p: 2.4, cb: 16,   f: 0.3,  cat: 'indian' },
  { id: 9,  n: 'Dosa (plain)',         srv: '1 large',        c: 133, p: 3.5, cb: 25,   f: 2,    cat: 'indian' },
  { id: 10, n: 'Upma',               srv: '100g cooked',    c: 130, p: 3.5, cb: 22,   f: 3.5,  cat: 'indian' },
  { id: 11, n: 'Poha',               srv: '100g cooked',    c: 76,  p: 2.1, cb: 16,   f: 0.6,  cat: 'indian' },
  { id: 12, n: 'Curd (dahi)',          srv: '100g',           c: 61,  p: 3.1, cb: 4.7,  f: 3.4,  cat: 'indian' },
  { id: 13, n: 'Lassi (plain)',        srv: '250ml',          c: 125, p: 6,   cb: 18,   f: 3,    cat: 'indian' },
  { id: 14, n: 'Buttermilk (chaas)',   srv: '250ml',          c: 40,  p: 3,   cb: 5,    f: 0.9,  cat: 'indian' },
  { id: 15, n: 'Aloo Sabzi',          srv: '100g',           c: 97,  p: 2.2, cb: 18,   f: 2.5,  cat: 'indian' },
  { id: 16, n: 'Mixed Veg Curry',     srv: '100g',           c: 70,  p: 2.5, cb: 10,   f: 2.5,  cat: 'indian' },
  { id: 17, n: 'Sambar',             srv: '100ml',          c: 50,  p: 2.5, cb: 8,    f: 1,    cat: 'indian' },
  { id: 18, n: 'Moong Dal Sprouts',   srv: '100g',           c: 30,  p: 3,   cb: 5.7,  f: 0.2,  cat: 'indian' },
  { id: 19, n: 'Peanuts',            srv: '30g',            c: 170, p: 7.7, cb: 4.7,  f: 14,   cat: 'indian' },
  { id: 20, n: 'Ghee',              srv: '1 tsp (5g)',     c: 45,  p: 0,   cb: 0,    f: 5,    cat: 'indian' },
  { id: 21, n: 'Makhana (fox nuts)',  srv: '30g',            c: 104, p: 2.9, cb: 23,   f: 0.1,  cat: 'indian' },
  { id: 22, n: 'Besan Chilla',        srv: '1 piece',        c: 180, p: 10,  cb: 22,   f: 4,    cat: 'indian' },
  { id: 23, n: 'Egg Bhurji',          srv: '2 eggs',         c: 180, p: 12,  cb: 4,    f: 13,   cat: 'indian' },
  { id: 24, n: 'Sabzi (generic)',     srv: '100g',           c: 65,  p: 2,   cb: 8,    f: 2.5,  cat: 'indian' },
  // Proteins
  { id: 25, n: 'Chicken Breast',      srv: '100g',           c: 165, p: 31,  cb: 0,    f: 3.6,  cat: 'protein' },
  { id: 26, n: 'Egg (whole)',          srv: '1 large',        c: 72,  p: 6.3, cb: 0.4,  f: 5,    cat: 'protein' },
  { id: 27, n: 'Tuna (canned)',        srv: '100g',           c: 116, p: 25.5,cb: 0,    f: 1,    cat: 'protein' },
  { id: 28, n: 'Salmon',             srv: '100g',           c: 208, p: 20,  cb: 0,    f: 13,   cat: 'protein' },
  { id: 29, n: 'Greek Yogurt',        srv: '100g',           c: 59,  p: 10,  cb: 3.6,  f: 0.4,  cat: 'protein' },
  { id: 30, n: 'Cottage Cheese',      srv: '100g',           c: 98,  p: 11,  cb: 3.4,  f: 4.3,  cat: 'protein' },
  { id: 31, n: 'Tofu',              srv: '100g',           c: 76,  p: 8,   cb: 1.9,  f: 4.2,  cat: 'protein' },
  { id: 32, n: 'Whey Protein',        srv: '1 scoop (30g)',  c: 120, p: 24,  cb: 3,    f: 2,    cat: 'protein' },
  // Carbs
  { id: 33, n: 'White Rice',          srv: '100g cooked',    c: 130, p: 2.7, cb: 28,   f: 0.3,  cat: 'carb' },
  { id: 34, n: 'Brown Rice',          srv: '100g cooked',    c: 112, p: 2.6, cb: 23.5, f: 0.9,  cat: 'carb' },
  { id: 35, n: 'Oats',              srv: '100g dry',       c: 389, p: 17,  cb: 66,   f: 7,    cat: 'carb' },
  { id: 36, n: 'Banana',             srv: '1 medium',       c: 89,  p: 1.1, cb: 23,   f: 0.3,  cat: 'carb' },
  { id: 37, n: 'Sweet Potato',        srv: '100g',           c: 86,  p: 1.6, cb: 20,   f: 0.1,  cat: 'carb' },
  { id: 38, n: 'Whole Wheat Bread',   srv: '1 slice',        c: 69,  p: 3.6, cb: 12,   f: 1.1,  cat: 'carb' },
  { id: 39, n: 'Apple',             srv: '1 medium',       c: 52,  p: 0.3, cb: 14,   f: 0.2,  cat: 'carb' },
  // Fats
  { id: 40, n: 'Almonds',            srv: '30g',            c: 174, p: 6,   cb: 6,    f: 15,   cat: 'fat' },
  { id: 41, n: 'Peanut Butter',       srv: '1 tbsp',         c: 94,  p: 4,   cb: 3,    f: 8,    cat: 'fat' },
  { id: 42, n: 'Avocado',            srv: 'half (75g)',     c: 120, p: 1.5, cb: 6.4,  f: 11,   cat: 'fat' },
  // Veggies
  { id: 43, n: 'Broccoli',           srv: '100g',           c: 34,  p: 2.8, cb: 7,    f: 0.4,  cat: 'veggie' },
  { id: 44, n: 'Spinach',            srv: '100g',           c: 23,  p: 2.9, cb: 3.6,  f: 0.4,  cat: 'veggie' },
  { id: 45, n: 'Carrot',             srv: '1 medium',       c: 25,  p: 0.6, cb: 6,    f: 0.1,  cat: 'veggie' },
  { id: 46, n: 'Cucumber',           srv: '100g',           c: 16,  p: 0.7, cb: 3.6,  f: 0.1,  cat: 'veggie' }
];

// Runtime: filled from Supabase custom_foods table
let customFoods = [];

function getAllFoods() {
  return [...FOODS, ...customFoods];
}
