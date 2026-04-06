const root = document.documentElement;
const themeButtons = document.querySelectorAll('.theme-btn');
const billingButtons = document.querySelectorAll('.billing-btn');
const priceValue = document.querySelector('.price-value');
const priceUnit = document.querySelector('.price-unit');
const heroScore = document.getElementById('heroScore');
const scoreRing = document.querySelector('.score-ring');
const outputScore = document.getElementById('outputScore');

const outputTitle = document.getElementById('outputTitle');
const outputSummary = document.getElementById('outputSummary');
const outputDo = document.getElementById('outputDo');
const outputAvoid = document.getElementById('outputAvoid');
const outputRecover = document.getElementById('outputRecover');
const energyForm = document.getElementById('energyForm');
const waitlistForm = document.getElementById('waitlistForm');
const formNote = document.getElementById('formNote');
const footerYear = document.getElementById('footerYear');
const reveals = document.querySelectorAll('.reveal');
const themeQuery = window.matchMedia('(prefers-color-scheme: light)');

const plans = {
  deep: {
    high: {
      title: 'Use this window for focused execution.',
      summary: 'You have enough mental bandwidth for one meaningful task. Protect attention now and push reactive work later.',
      doNow: 'Strategy, writing, product thinking',
      avoid: 'Inbox loops and status meetings',
      recover: '10-minute reset after 90 minutes'
    },
    mid: {
      title: 'Do one sharp task, then step away.',
      summary: 'You can still create value, but your day needs pacing. Finish one important block before switching contexts.',
      doNow: 'One scoped deep work sprint',
      avoid: 'Multitasking and back-to-back calls',
      recover: 'Hydration + sunlight break in 60 minutes'
    },
    low: {
      title: 'Lower the bar and reduce cognitive drag.',
      summary: 'Your system is asking for a simpler plan. Choose a lighter task and create room to recover first.',
      doNow: 'Outline, review, simplify',
      avoid: 'High-stakes decision making',
      recover: '15-minute walk before restarting'
    }
  },
  admin: {
    high: {
      title: 'Clear the clutter without losing momentum.',
      summary: 'Use your current energy to batch shallow work fast, then graduate into something more valuable.',
      doNow: 'Email cleanup, planning, approvals',
      avoid: 'Aimless context switching',
      recover: 'Stretch after your admin batch'
    },
    mid: {
      title: 'Perfect time for cleanup and follow-through.',
      summary: 'You do not need peak focus to move the day forward. Keep tasks finite and visible.',
      doNow: 'Scheduling, inbox, docs, follow-ups',
      avoid: 'Starting brand-new complex work',
      recover: 'Short breathing break every hour'
    },
    low: {
      title: 'Keep today functional, not heroic.',
      summary: 'This is a maintenance block. Protect your energy and move only the essentials.',
      doNow: 'Simple admin, triage, rescheduling',
      avoid: 'Big commitments and emotionally draining threads',
      recover: 'Tea, water, and a quiet 10-minute reset'
    }
  },
  meetings: {
    high: {
      title: 'Use your clarity for decisive collaboration.',
      summary: 'You can handle real discussion right now, especially if outcomes are concrete and time-boxed.',
      doNow: 'Decision meetings and collaborative planning',
      avoid: 'Rambling syncs without an agenda',
      recover: 'Solo decompression buffer afterward'
    },
    mid: {
      title: 'Keep meetings short and outcome-driven.',
      summary: 'Your social energy is usable, but fragile. Keep conversations structured and end with next steps.',
      doNow: 'Essential conversations only',
      avoid: 'Long brainstorms with no owner',
      recover: 'Quiet reset before the next block'
    },
    low: {
      title: 'Protect your attention from meeting sprawl.',
      summary: 'You are better off shortening or postponing anything optional. Keep communication asynchronous when you can.',
      doNow: 'One necessary sync at most',
      avoid: 'Back-to-back calls and heavy collaboration',
      recover: 'Silence, movement, and reduced notifications'
    }
  },
  reset: {
    high: {
      title: 'Bank your energy before you burn it.',
      summary: 'You feel capable, which is exactly why a planned reset helps prevent the crash later.',
      doNow: 'Short walk, meal, and protected buffer',
      avoid: 'Filling every open slot with work',
      recover: 'Schedule your next deep work block intentionally'
    },
    mid: {
      title: 'Choose active recovery over passive scroll.',
      summary: 'A structured reset will give you better output later than trying to push through friction now.',
      doNow: 'Walk, water, stretch, no-phone pause',
      avoid: 'Doomscrolling and fragmented rest',
      recover: 'Return with one clearly chosen task'
    },
    low: {
      title: 'Recovery is the real task right now.',
      summary: 'Do less, recover better, and stop pretending another productivity hack will fix exhaustion.',
      doNow: 'Meal, hydration, quiet rest, lower expectations',
      avoid: 'Forcing deep work while depleted',
      recover: 'Reassess in 30-45 minutes'
    }
  }
};

function getStoredTheme() {
  return localStorage.getItem('energypilot-theme') || 'system';
}

function applyTheme(theme) {
  root.dataset.theme = theme;
  themeButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.themeChoice === theme);
  });
}

function resolveTheme() {
  const stored = getStoredTheme();
  if (stored === 'system') {
    root.dataset.theme = themeQuery.matches ? 'light' : 'dark';
  } else {
    root.dataset.theme = stored;
  }
  themeButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.themeChoice === stored);
  });
}

function computeScore(sleep, stress, focus) {
  let score = 60;
  if (sleep === 'high') score += 15;
  if (sleep === 'mid') score += 6;
  if (sleep === 'low') score -= 10;
  if (stress === 'low') score += 12;
  if (stress === 'mid') score += 2;
  if (stress === 'high') score -= 10;
  if (focus === 'high') score += 15;
  if (focus === 'mid') score += 6;
  if (focus === 'low') score -= 12;
  return Math.max(28, Math.min(94, score));
}

function getBand(score) {
  if (score >= 76) return 'high';
  if (score >= 58) return 'mid';
  return 'low';
}

function updatePlan(data) {
  const score = computeScore(data.sleep, data.stress, data.focus);
  const band = getBand(score);
  const plan = plans[data.goal][band];

  heroScore.textContent = score;
  if (scoreRing) scoreRing.style.setProperty('--score-progress', `${score}`);
  outputScore.textContent = score;

  outputTitle.textContent = plan.title;
  outputSummary.textContent = plan.summary;
  outputDo.textContent = plan.doNow;
  outputAvoid.textContent = plan.avoid;
  outputRecover.textContent = plan.recover;
}

function updatePricing(mode) {
  billingButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.billing === mode);
  });
  priceValue.textContent = priceValue.dataset[mode];
  priceUnit.textContent = priceUnit.dataset[mode];
}

function persistLead(formData) {
  const leads = JSON.parse(localStorage.getItem('energypilot-leads') || '[]');
  leads.push({
    email: formData.email,
    intent: formData.intent,
    submittedAt: new Date().toISOString()
  });
  localStorage.setItem('energypilot-leads', JSON.stringify(leads));
}

function revealOnScroll() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  reveals.forEach((element) => observer.observe(element));
}

themeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const choice = button.dataset.themeChoice;
    localStorage.setItem('energypilot-theme', choice);
    if (choice === 'system') {
      resolveTheme();
      return;
    }
    applyTheme(choice);
  });
});

themeQuery.addEventListener('change', () => {
  if (getStoredTheme() === 'system') resolveTheme();
});

billingButtons.forEach((button) => {
  button.addEventListener('click', () => updatePricing(button.dataset.billing));
});

energyForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = Object.fromEntries(new FormData(event.currentTarget).entries());
  updatePlan(formData);
});

waitlistForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = Object.fromEntries(new FormData(event.currentTarget).entries());
  persistLead(formData);
  formNote.textContent = `Saved ${formData.email} with intent: ${formData.intent}. For a real launch, connect this form to your backend or email tool.`;
  event.currentTarget.reset();
});

footerYear.textContent = `Built for global beta · ${new Date().getFullYear()}`;

resolveTheme();
updatePricing('monthly');
updatePlan({ sleep: 'mid', stress: 'mid', focus: 'high', goal: 'deep' });
revealOnScroll();