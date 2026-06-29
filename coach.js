// ============================================================
// COACH TAB
// ============================================================
const SUGGESTED_QUESTIONS = [
  'How many reps should I do for muscle growth?',
  'What should I eat after a workout?',
  'I feel sore — should I still train today?',
  'How much water should I drink daily?',
  'What Indian foods are good for protein?',
  'How do I break through a plateau?'
];

function renderCoach() {
  const msgs = S.coach.msgs || [];

  document.getElementById('content').innerHTML = `
  <div>
    <div class="ch-row">
      <div>
        <div class="tt">Coach</div>
        <div style="font-size:12px;color:var(--text2)">Personal fitness guidance</div>
      </div>
    </div>

    <div class="chat-area" id="ca">
      ${msgs.length === 0 ? welcomeUI() : ''}
      ${msgs.map(m => `<div class="msg ${m.r}">${m.t}</div>`).join('')}
    </div>

    ${msgs.length === 0 ? suggestionsUI() : ''}

    <div class="cin-area">
      <textarea class="ci" id="ci" placeholder="Ask your coach..." rows="1"
        onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendMsg();}">
      </textarea>
      <button class="cs" onclick="sendMsg()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff"
          stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </button>
    </div>
  </div>`;

  const ca = document.getElementById('ca');
  if (ca) ca.scrollTop = ca.scrollHeight;
}

function welcomeUI() {
  return `
  <div class="cw">
    <div class="cwi">🤖</div>
    <div class="cwt">I'm your FORGE Coach</div>
    <div class="cws">
      I know your goals, rank, and progress.<br>
      Ask me anything about training, nutrition, or recovery.
    </div>
  </div>`;
}

function suggestionsUI() {
  return `
  <div class="sq-wrap">
    <div style="font-size:10px;color:var(--text3);letter-spacing:1px;margin-bottom:3px">SUGGESTED</div>
    ${SUGGESTED_QUESTIONS.map(q => `
    <button class="sq" onclick="sendMsg('${q.replace(/'/g, "\\'")}')">${q}</button>`).join('')}
  </div>`;
}

// ============================================================
// SEND MESSAGE
// ============================================================
async function sendMsg(txt) {
  const inp = document.getElementById('ci');
  const q   = (txt || inp?.value || '').trim();
  if (!q) return;
  if (inp) inp.value = '';

  if (!S.coach.msgs) S.coach.msgs = [];
  S.coach.msgs.push({ r: 'u', t: q });
  save();

  // Show typing indicator
  const ca = document.getElementById('ca');
  if (ca) {
    const el = document.createElement('div');
    el.className = 'msg ai typ'; el.id = 'typ-ind';
    el.innerHTML = '<div class="td"></div><div class="td"></div><div class="td"></div>';
    ca.appendChild(el);
    ca.scrollTop = ca.scrollHeight;
  }

  // Simulate thinking time (feels more natural)
  await new Promise(r => setTimeout(r, 700 + Math.random() * 500));

  document.getElementById('typ-ind')?.remove();
  const resp = coachResp(q);
  S.coach.msgs.push({ r: 'ai', t: resp });
  save();
  renderCoach();
}

// ============================================================
// RULE-BASED RESPONSES (personalised with user data)
// ============================================================
function coachResp(q) {
  const ql = q.toLowerCase();
  const u  = S.user;
  const ri = getRank(S.progress.level);
  const t  = S.nutrition.targets;
  const n  = getTodayNut();

  // Reps / sets
  if (ql.includes('rep') && (ql.includes('muscle') || ql.includes('grow') || ql.includes('size')))
    return `For muscle growth at ${ri.name}, target 8-12 reps per set at high effort. 3-4 sets, 60-90 seconds rest. The real driver is progressive overload — add one more rep or shorten rest time each week before increasing difficulty.`;

  // Protein
  if (ql.includes('how much protein') || ql.includes('protein intake') || ql.includes('protein goal'))
    return `At ${u.weight}kg, aim for ${Math.round(u.weight * 1.8)}-${Math.round(u.weight * 2.2)}g protein daily. Your current target is ${t.p}g. You've hit ${Math.round(n.p)}g so far today — ${Math.round(t.p - n.p) > 0 ? Math.round(t.p - n.p) + 'g still to go' : 'target reached!'}. Dal, paneer, curd, eggs, and chicken are great daily sources.`;

  // Post-workout
  if (ql.includes('post-workout') || ql.includes('after workout') || ql.includes('after training'))
    return `Within 30-45 minutes after training: 25-40g protein + fast carbs. Good options: curd with banana, 2 eggs with rice, dal-rice, or paneer with roti. This window is real — don't skip it.`;

  // Soreness
  if (ql.includes('sore') || ql.includes('doms'))
    return `Soreness means muscles adapted — that's progress. Light training on non-sore muscle groups is fine. Don't hammer the same muscles at high intensity while still sore. Protein, sleep, and hydration are your fastest recovery tools.`;

  // Water
  if (ql.includes('water') || ql.includes('hydrat'))
    return `Aim for ${(u.weight * 0.033).toFixed(1)}-${(u.weight * 0.04).toFixed(1)} litres daily at ${u.weight}kg. Add 500ml per hour of training. Dehydration of just 2% drops performance noticeably — your muscles are 75% water.`;

  // Sleep
  if (ql.includes('sleep') || ql.includes('rest') || ql.includes('recover'))
    return `7-9 hours is non-negotiable. Growth hormone peaks during deep sleep. Poor sleep raises cortisol, increases fat storage, kills motivation, and slows recovery. Sleep is the most underrated performance tool — protect it above everything else.`;

  // Plateau
  if (ql.includes('plateau') || ql.includes('stuck') || ql.includes('not seeing'))
    return `Plateaus mean your body adapted. Break it: change rep ranges, reduce rest time by 10 seconds, or swap exercise variations. Also check the Fuel tab — people underestimate food intake constantly. Track 3 days honestly and you'll find the gap.`;

  // Cardio
  if (ql.includes('cardio') || ql.includes('run') || ql.includes('running'))
    return u.goal === 'lose_fat'
      ? `For fat loss: 20-30 min moderate cardio 3-4x/week, or 15 min high-intensity 2-3x. Don't overdo it — too much cardio without enough food eats muscle along with fat.`
      : `For muscle building: 2-3 cardio sessions per week, 20 min moderate intensity. Enough for heart health without cutting into your recovery capacity.`;

  // Indian food
  if (ql.includes('chapati') || ql.includes('roti') || ql.includes('dal') || ql.includes('indian') || ql.includes('desi'))
    return `Indian food works well for fitness. Chapati + dal is a solid protein-carb combo. Paneer and curd are excellent protein sources. Rajma and chole are underrated — high protein, high fibre. Watch the ghee and oil quantity; that's where calories silently add up. Use the Fuel tab to log it and see where you actually stand.`;

  // Motivation
  if (ql.includes('motivat') || ql.includes('give up') || ql.includes('hard time') || ql.includes("can't"))
    return `${u.name}, you're a ${ri.name} — ${ri.title}. Every S-Rank started at E-Rank. The gap is just showing up consistently when you don't feel like it. Your streak is ${S.progress.streak} days. That's real discipline. Don't break it now.`;

  // Weight loss
  if (ql.includes('lose weight') || ql.includes('fat loss') || ql.includes('lose fat'))
    return `Fat loss comes down to one thing: consistent calorie deficit over weeks, not days. Aim for ${Math.round(u.weight * 0.5 * 10) / 10}-${Math.round(u.weight * 1 * 10) / 10}kg per month — faster than that and you lose muscle too. Hit your protein target every day to protect your muscle while losing fat.`;

  // Fallback
  return `${u.name}, as a ${ri.name} ${ri.title} going for "${u.goal.replace(/_/g, ' ')}", the fundamentals are: hit your protein (${t.p}g/day), train consistently, sleep 7-9 hours. You've logged ${Math.round(n.cal)} kcal today. What specific part of your training or nutrition can I help you with?`;
}
