
const PLANS = [
    {
        id: 'essential',
        name: 'Essential',
        basePrice: 49,
        maxPayout: 500,
        coverageCap: 1000,
        description: 'Great for part-time workers with predictable city routes.',
        features: ['Heavy Rain coverage', 'Basic AQI alerts', 'Up to ₹500/event', 'Weekly cap ₹1,000'],
    },
    {
        id: 'growth',
        name: 'Growth',
        basePrice: 69,
        maxPayout: 850,
        coverageCap: 1500,
        description: 'Balanced protection for full-time riders across mixed zones.',
        featured: true,
        features: ['All Essential benefits', 'Extreme Heat coverage', 'Up to ₹850/event', 'Weekly cap ₹1,500'],
    },
    {
        id: 'shield_max',
        name: 'Shield Max',
        basePrice: 99,
        maxPayout: 1500,
        coverageCap: 2500,
        description: 'Highest cover for high-intensity metro and monsoon exposure.',
        features: ['All Growth benefits', 'App Outage coverage', 'Up to ₹1,500/event', 'Weekly cap ₹2,500', 'Priority payouts'],
    },
];

const CITY_RISK = {
    Chennai: { multiplier: 1.5, level: 'high', weather: { temp: 34, humidity: 72, rain: 12, aqi: 145 } },
    Mumbai: { multiplier: 1.4, level: 'high', weather: { temp: 31, humidity: 78, rain: 8, aqi: 130 } },
    Delhi: { multiplier: 1.3, level: 'medium', weather: { temp: 38, humidity: 45, rain: 2, aqi: 280 } },
    Bengaluru: { multiplier: 1.2, level: 'medium', weather: { temp: 28, humidity: 60, rain: 5, aqi: 95 } },
    Hyderabad: { multiplier: 1.1, level: 'low', weather: { temp: 35, humidity: 55, rain: 3, aqi: 110 } },
    Coimbatore: { multiplier: 1.0, level: 'low', weather: { temp: 30, humidity: 58, rain: 4, aqi: 75 } },
};

const TRIGGERS = {
    rain: { name: 'Heavy Rain', icon: '🌧️', basePayout: 800, condition: 'Rainfall > 50mm/day', threshold: 50 },
    heat: { name: 'Extreme Heat', icon: '🔥', basePayout: 600, condition: 'Temperature > 42°C for 3+ hrs', threshold: 42 },
    aqi: { name: 'Severe AQI', icon: '😷', basePayout: 500, condition: 'AQI > 300 for 4+ hrs', threshold: 300 },
    outage: { name: 'App Outage', icon: '📱', basePayout: 400, condition: 'Platform down for 2+ hrs', threshold: 0 },
};

const STORAGE_KEY = 'rideshield_data';


function getAppData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return { users: [], currentUser: null };
}

function saveAppData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getCurrentUser() {
    const data = getAppData();
    if (!data.currentUser) return null;
    return data.users.find(u => u.email === data.currentUser) || null;
}

function updateCurrentUser(updates) {
    const data = getAppData();
    const idx = data.users.findIndex(u => u.email === data.currentUser);
    if (idx >= 0) {
        data.users[idx] = { ...data.users[idx], ...updates };
        saveAppData(data);
        return data.users[idx];
    }
    return null;
}


let currentPage = 'landing';

function navigate(page) {
    document.querySelectorAll('.page-container').forEach(el => el.classList.add('hidden'));
    const target = document.getElementById(`page-${page}`);
    if (target) {
        target.classList.remove('hidden');
        // Re-trigger animation
        target.style.animation = 'none';
        target.offsetHeight; // Force reflow
        target.style.animation = '';
    }
    currentPage = page;

    
    if (page === 'plans') renderPlans();
    if (page === 'dashboard') renderDashboard();
    if (page === 'admin') renderAdmin();

    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


let authMode = 'login';

function switchAuthMode(mode) {
    authMode = mode;
    document.getElementById('loginTab').className = mode === 'login' ? 'switch-active' : 'switch-idle';
    document.getElementById('signupTab').className = mode === 'signup' ? 'switch-active' : 'switch-idle';
    document.getElementById('signupFields').classList.toggle('hidden', mode === 'login');
    document.getElementById('authTitle').textContent = mode === 'login' ? 'Welcome back' : 'Create your account';
    document.getElementById('authSubmitBtn').textContent = mode === 'login' ? 'Login to Dashboard' : 'Create Account';
    document.getElementById('authError').classList.add('hidden');
}

function handleAuth(e) {
    e.preventDefault();
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value;
    const errorEl = document.getElementById('authError');

    if (authMode === 'signup') {
        const name = document.getElementById('authName').value.trim();
        const phone = document.getElementById('authPhone').value.trim();
        const city = document.getElementById('authCity').value;
        const platform = document.getElementById('authPlatform').value;
        const income = parseInt(document.getElementById('authIncome').value) || 1000;

        if (!name || !phone || !email || !password) {
            errorEl.textContent = 'Please fill all fields.';
            errorEl.classList.remove('hidden');
            return;
        }

        const data = getAppData();
        if (data.users.find(u => u.email === email)) {
            errorEl.textContent = 'Email already registered. Please login.';
            errorEl.classList.remove('hidden');
            return;
        }

        const newUser = {
            name, phone, email, password, city, platform,
            avgDailyIncome: income,
            wallet: 0,
            policy: null,
            claims: [],
            transactions: [],
            registeredAt: new Date().toISOString(),
        };

        data.users.push(newUser);
        data.currentUser = email;
        saveAppData(data);

        showToast(`Welcome to RideShield, ${name}! 🎉`);
        updateHeader();
        navigate('plans');
    } else {
        // Login
        const data = getAppData();
        const user = data.users.find(u => u.email === email && u.password === password);

        if (!user) {
            errorEl.textContent = 'Invalid email or password.';
            errorEl.classList.remove('hidden');
            return;
        }

        data.currentUser = email;
        saveAppData(data);

        showToast(`Welcome back, ${user.name}! 🛡️`);
        updateHeader();
        navigate('dashboard');
    }
}

function logout() {
    const data = getAppData();
    data.currentUser = null;
    saveAppData(data);
    updateHeader();
    navigate('landing');
    showToast('Logged out successfully.');
}

function updateHeader() {
    const user = getCurrentUser();
    const actionsEl = document.getElementById('userActions');

    if (user) {
        actionsEl.innerHTML = `
      <span class="welcome-text">Hi, ${user.name}</span>
      <button type="button" onclick="logout()" class="logout-btn">Logout</button>
    `;
    } else {
        actionsEl.innerHTML = `<a href="#" class="login-link" onclick="navigate('auth')" id="headerLoginBtn">Login</a>`;
    }
}

function renderPlans() {
    const user = getCurrentUser();
    const city = user?.city || 'Chennai';
    const riskData = CITY_RISK[city] || CITY_RISK.Chennai;

    const grid = document.getElementById('plansGrid');
    grid.innerHTML = PLANS.map(plan => {
        const adjustedPrice = Math.round(plan.basePrice * riskData.multiplier);
        const isActive = user?.policy?.planId === plan.id;

        return `
      <article class="plan-card${plan.featured ? ' featured' : ''}">
        <h2>${plan.name}</h2>
        <p class="plan-price">₹${adjustedPrice}/week</p>
        <p class="plan-payout">Up to ₹${plan.maxPayout} per event</p>
        <p>${plan.description}</p>
        <ul class="plan-features">
          ${plan.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
        ${isActive
                ? '<button type="button" disabled>✅ Active Plan</button>'
                : `<button type="button" onclick="buyPlan('${plan.id}', ${adjustedPrice})">
              ${user ? 'Choose Plan' : 'Login to Subscribe'}
            </button>`
            }
      </article>
    `;
    }).join('');
}

function buyPlan(planId, price) {
    const user = getCurrentUser();
    if (!user) {
        navigate('auth');
        return;
    }

    const plan = PLANS.find(p => p.id === planId);
    const now = new Date();
    const endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const policy = {
        planId: plan.id,
        planName: plan.name,
        weeklyPremium: price,
        maxPayout: plan.maxPayout,
        coverageCap: plan.coverageCap,
        startDate: now.toISOString(),
        endDate: endDate.toISOString(),
        status: 'active',
    };

   
    const transaction = {
        id: Date.now(),
        date: now.toISOString(),
        type: 'debit',
        description: `${plan.name} plan — weekly premium`,
        amount: -price,
    };

    const updatedUser = updateCurrentUser({
        policy,
        transactions: [...(user.transactions || []), transaction],
    });

    showToast(`${plan.name} plan activated! You're now protected. 🛡️`);
    renderPlans();
}


function renderDashboard() {
    const user = getCurrentUser();
    if (!user) {
        document.getElementById('dashboardWelcome').textContent = 'Welcome to RideShield';
        document.getElementById('policyStatusChip').textContent = 'Login to view your dashboard';
        return;
    }

    const city = user.city || 'Chennai';
    const riskData = CITY_RISK[city] || CITY_RISK.Chennai;

    
    document.getElementById('dashboardWelcome').textContent = `Welcome, ${user.name} 👋`;

    
    if (user.policy) {
        document.getElementById('policyStatusChip').textContent =
            `Policy: ${user.policy.planName} • ₹${user.policy.weeklyPremium}/week • Active ✅`;
        document.getElementById('policyStatusChip').className = 'api-chip';
    } else {
        document.getElementById('policyStatusChip').textContent = 'No active policy — Buy a plan to get covered';
    }

    
    const totalEarned = (user.claims || [])
        .filter(c => c.status === 'approved')
        .reduce((sum, c) => sum + c.payout, 0);

    document.getElementById('walletBalanceMetric').textContent = `₹${user.wallet || 0}`;
    document.getElementById('policyPlanMetric').textContent = user.policy ? user.policy.planName : 'None';
    document.getElementById('claimsCountMetric').textContent = (user.claims || []).length;
    document.getElementById('totalEarnedMetric').textContent = `₹${totalEarned}`;

    
    document.getElementById('weatherCity').textContent = city;
    document.getElementById('weatherTemp').textContent = `${riskData.weather.temp}°C`;
    document.getElementById('weatherRain').textContent = `${riskData.weather.rain} mm`;
    document.getElementById('weatherHumidity').textContent = `${riskData.weather.humidity}%`;
    document.getElementById('weatherAQI').textContent = riskData.weather.aqi;

   
    updateWeatherStatus(riskData.weather);

   
    renderCoverage(user);

    
    renderClaimsTable(user);

  
    renderWalletTable(user);
}

function updateWeatherStatus(weather) {
    const statusEl = document.getElementById('weatherStatus');
    let statusClass = 'status-safe';
    let statusText = '✅ All Clear — No disruptions detected';

    if (weather.rain > 50) {
        statusClass = 'status-danger';
        statusText = '🌧️ Heavy Rain Alert — Trigger active!';
    } else if (weather.temp > 42) {
        statusClass = 'status-danger';
        statusText = '🔥 Extreme Heat Alert — Trigger active!';
    } else if (weather.aqi > 300) {
        statusClass = 'status-danger';
        statusText = '😷 Severe AQI — Trigger active!';
    } else if (weather.rain > 30 || weather.temp > 38 || weather.aqi > 200) {
        statusClass = 'status-warning';
        statusText = '⚠️ Elevated Risk — Monitoring conditions';
    }

    statusEl.innerHTML = `<span class="status-badge ${statusClass}">${statusText}</span>`;
}

function renderCoverage(user) {
    const el = document.getElementById('coverageDetails');

    if (!user.policy) {
        el.innerHTML = `<p class="coverage-empty">No active policy. <a href="#" onclick="navigate('plans')">Buy a plan</a> to get started.</p>`;
        return;
    }

    el.innerHTML = `
    <div style="margin-bottom: 0.5rem;">
      <strong>${user.policy.planName}</strong> • ₹${user.policy.weeklyPremium}/week
    </div>
    <ul class="coverage-list">
      <li><span>🌧️ Heavy Rain (&gt;50mm)</span> <span class="coverage-payout">₹${Math.min(800, user.policy.maxPayout)}</span></li>
      <li><span>🔥 Extreme Heat (&gt;42°C)</span> <span class="coverage-payout">₹${Math.min(600, user.policy.maxPayout)}</span></li>
      <li><span>😷 Severe AQI (&gt;300)</span> <span class="coverage-payout">₹${Math.min(500, user.policy.maxPayout)}</span></li>
      <li><span>📱 App Outage</span> <span class="coverage-payout">₹${Math.min(400, user.policy.maxPayout)}</span></li>
    </ul>
    <p style="font-size: 0.78rem; color: rgba(26,30,36,0.55); margin-top: 0.5rem;">
      Weekly cap: ₹${user.policy.coverageCap} • Valid until ${new Date(user.policy.endDate).toLocaleDateString('en-IN')}
    </p>
  `;
}

function renderClaimsTable(user) {
    const tbody = document.getElementById('claimsTableBody');
    const claims = user.claims || [];

    if (claims.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">No claims yet — disruptions will trigger them automatically.</td></tr>';
        return;
    }

    tbody.innerHTML = claims
        .slice()
        .reverse()
        .map(c => `
      <tr>
        <td>${new Date(c.date).toLocaleDateString('en-IN')}</td>
        <td>${TRIGGERS[c.trigger]?.icon || ''} ${TRIGGERS[c.trigger]?.name || c.trigger}</td>
        <td>${c.severity}/5</td>
        <td class="cap"><span class="status-badge ${c.status === 'approved' ? 'status-approved' : 'status-danger'}">${c.status}</span></td>
        <td>₹${c.payout}</td>
        <td>Score: ${c.fraudScore}/100</td>
      </tr>
    `).join('');
}

function renderWalletTable(user) {
    const tbody = document.getElementById('walletTableBody');
    const txns = user.transactions || [];

    if (txns.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">No transactions yet.</td></tr>';
        return;
    }

    let balance = 0;
    const rows = txns.map(t => {
        balance += t.amount;
        return `
      <tr>
        <td>${new Date(t.date).toLocaleDateString('en-IN')}</td>
        <td style="color: ${t.amount >= 0 ? 'var(--green)' : 'var(--red)'}">
          ${t.amount >= 0 ? '💰 Credit' : '💳 Debit'}
        </td>
        <td>${t.description}</td>
        <td style="font-weight: 600; color: ${t.amount >= 0 ? 'var(--green)' : 'var(--red)'}">
          ${t.amount >= 0 ? '+' : ''}₹${t.amount}
        </td>
        <td>₹${balance}</td>
      </tr>
    `;
    });

    tbody.innerHTML = rows.reverse().join('');
}


function simulateDisruption() {
    const user = getCurrentUser();
    if (!user) {
        showToast('Please login first to simulate disruptions.');
        navigate('auth');
        return;
    }

    if (!user.policy) {
        showToast('No active policy! Buy a plan first.');
        navigate('plans');
        return;
    }

    const eventType = document.getElementById('simEventType').value;
    const severity = parseInt(document.getElementById('simSeverity').value) || 4;
    const trigger = TRIGGERS[eventType];
    const city = user.city || 'Chennai';
    const riskData = CITY_RISK[city] || CITY_RISK.Chennai;

    
    const fraudResult = runFraudDetection(user, eventType, severity);

    
    let payout = Math.round(trigger.basePayout * (severity / 5));
    payout = Math.min(payout, user.policy.maxPayout);

  
    const weekClaims = (user.claims || []).filter(c => {
        const claimDate = new Date(c.date);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return claimDate > weekAgo && c.status === 'approved';
    });
    const weekTotal = weekClaims.reduce((sum, c) => sum + c.payout, 0);
    const remaining = user.policy.coverageCap - weekTotal;
    payout = Math.min(payout, Math.max(0, remaining));

    const now = new Date();
    let status = 'approved';
    let statusText = 'Claim Auto-Approved ✅';
    let statusBadgeClass = 'status-approved';

    
    if (fraudResult.score >= 70) {
        status = 'rejected';
        statusText = 'Claim Rejected — Fraud Detected 🚫';
        statusBadgeClass = 'status-danger';
        payout = 0;
    } else if (fraudResult.score >= 40) {
        status = 'review';
        statusText = 'Under Review — Needs Verification ⚠️';
        statusBadgeClass = 'status-warning';
        payout = Math.round(payout * 0.5); 
    }

   
    const claim = {
        id: Date.now(),
        date: now.toISOString(),
        trigger: eventType,
        severity,
        status,
        payout,
        fraudScore: fraudResult.score,
        fraudChecks: fraudResult.checks,
    };

    // Create transaction
    const transactions = [...(user.transactions || [])];
    if (payout > 0) {
        transactions.push({
            id: Date.now() + 1,
            date: now.toISOString(),
            type: 'credit',
            description: `${trigger.name} disruption payout`,
            amount: payout,
        });
    }

    // Update user
    updateCurrentUser({
        claims: [...(user.claims || []), claim],
        wallet: (user.wallet || 0) + payout,
        transactions,
    });

    
    const simulatedWeather = { ...riskData.weather };
    if (eventType === 'rain') simulatedWeather.rain = 65 + Math.random() * 30;
    if (eventType === 'heat') simulatedWeather.temp = 43 + Math.random() * 4;
    if (eventType === 'aqi') simulatedWeather.aqi = 320 + Math.floor(Math.random() * 80);

    document.getElementById('weatherTemp').textContent = `${Math.round(simulatedWeather.temp)}°C`;
    document.getElementById('weatherRain').textContent = `${Math.round(simulatedWeather.rain)} mm`;
    document.getElementById('weatherAQI').textContent = Math.round(simulatedWeather.aqi);
    updateWeatherStatus(simulatedWeather);

    // Show payout overlay
    showPayoutOverlay({
        icon: trigger.icon,
        title: 'Disruption Detected!',
        subtitle: `${trigger.name} Alert — ${city}`,
        status: statusText,
        statusClass: statusBadgeClass,
        amount: payout,
        fraudScore: fraudResult.score,
        fraudChecks: fraudResult.checks,
        time: now.toLocaleString('en-IN'),
    });

    // Refresh dashboard
    setTimeout(() => renderDashboard(), 300);
}


function runFraudDetection(user, eventType, severity) {
    const checks = [];
    let score = 0;

    
    const today = new Date().toDateString();
    const duplicateToday = (user.claims || []).find(
        c => new Date(c.date).toDateString() === today && c.trigger === eventType
    );
    if (duplicateToday) {
        score += 35;
        checks.push('⚠️ Duplicate: Same trigger already fired today');
    } else {
        checks.push('✅ No duplicate claims today');
    }

    
    const recentClaims = (user.claims || []).filter(c => {
        return Date.now() - new Date(c.date).getTime() < 7 * 24 * 60 * 60 * 1000;
    });
    if (recentClaims.length >= 5) {
        score += 25;
        checks.push(`⚠️ High velocity: ${recentClaims.length} claims in 7 days`);
    } else {
        checks.push(`✅ Normal claim frequency (${recentClaims.length}/7 days)`);
    }

    
    const locationMatch = Math.random() > 0.08; 
    if (!locationMatch) {
        score += 20;
        checks.push('⚠️ GPS mismatch: Location outside registered city zone');
    } else {
        checks.push('✅ GPS location verified — within delivery zone');
    }

    
    const wasActive = Math.random() > 0.05; 
    if (!wasActive) {
        score += 15;
        checks.push('⚠️ No recent activity detected before disruption');
    } else {
        checks.push('✅ Worker was active before disruption event');
    }

    
    const earningsOk = Math.random() > 0.03;
    if (!earningsOk) {
        score += 10;
        checks.push('⚠️ Declared earnings deviate >40% from platform estimate');
    } else {
        checks.push('✅ Earnings declaration consistent');
    }

    return { score: Math.min(score, 100), checks };
}


function showPayoutOverlay(data) {
    const overlay = document.getElementById('payoutOverlay');
    document.getElementById('payoutIcon').textContent = data.icon;
    document.getElementById('payoutTitle').textContent = data.title;
    document.getElementById('payoutSubtitle').textContent = data.subtitle;
    document.getElementById('payoutStatus').textContent = data.status;
    document.getElementById('payoutStatus').className = `status-badge ${data.statusClass}`;
    document.getElementById('payoutAmount').textContent = `₹${data.amount}`;
    document.getElementById('payoutDetail').textContent = data.amount > 0 ? 'Credited to Wallet' : 'No payout';
    document.getElementById('payoutTime').textContent = data.time;

   
    document.getElementById('payoutFraudFill').style.width = `${data.fraudScore}%`;
    document.getElementById('payoutFraudFill').style.background =
        data.fraudScore >= 70 ? '#d32f2f' :
            data.fraudScore >= 40 ? '#ed6c02' : 'var(--green)';

    const riskLabel = data.fraudScore >= 70 ? 'High Risk' :
        data.fraudScore >= 40 ? 'Medium Risk' : 'Low Risk';
    document.getElementById('payoutFraudScore').textContent =
        `Fraud Score: ${data.fraudScore}/100 — ${riskLabel}`;
    document.getElementById('payoutFraudChecks').innerHTML =
        data.fraudChecks.map(c => `<span style="display:block;font-size:0.78rem;margin:2px 0;">${c}</span>`).join('');

    overlay.classList.remove('hidden');

    // Show toast
    if (data.amount > 0) {
        setTimeout(() => showToast(`💰 ₹${data.amount} added to your wallet!`), 500);
    }
}

function closePayoutOverlay() {
    document.getElementById('payoutOverlay').classList.add('hidden');
}


function renderAdmin() {
    const data = getAppData();
    const users = data.users || [];
    const allClaims = users.flatMap(u => (u.claims || []).map(c => ({ ...c, userName: u.name, userCity: u.city })));
    const activePolicies = users.filter(u => u.policy?.status === 'active').length;
    const fraudFlags = allClaims.filter(c => c.fraudScore >= 40).length;

   
    document.getElementById('adminTotalUsers').textContent = users.length;
    document.getElementById('adminActivePolicies').textContent = activePolicies;
    document.getElementById('adminTotalClaims').textContent = allClaims.length;
    document.getElementById('adminFraudFlags').textContent = fraudFlags;

    
    renderRiskMap();

    
    renderAdminUsersTable(users);

   
    renderFraudAlerts(allClaims);

   
    renderAdminCharts(users, allClaims);
}

function renderRiskMap() {
    const grid = document.getElementById('riskMapGrid');
    grid.innerHTML = Object.entries(CITY_RISK).map(([city, data]) => {
        const pct = Math.round(data.multiplier * 60);
        const levelClass = data.level === 'high' ? 'risk-high-text' :
            data.level === 'medium' ? 'risk-medium-text' : 'risk-low-text';
        const barColor = data.level === 'high' ? '#f25c3a' :
            data.level === 'medium' ? '#ffc107' : '#0a6625';

        return `
      <div class="risk-map-item" style="background: ${data.level === 'high' ? 'rgba(242,92,58,0.06)' :
                data.level === 'medium' ? 'rgba(255,193,7,0.06)' : 'rgba(10,102,37,0.04)'
            }">
        <h4>${city}</h4>
        <span class="risk-level ${levelClass}">${data.level} risk • ${data.multiplier}×</span>
        <div class="risk-bar">
          <div class="risk-bar-fill" style="width: ${pct}%; background: ${barColor};"></div>
        </div>
        <span style="font-size:0.72rem; color:rgba(26,30,36,0.5);">
          🌡️${data.weather.temp}°C • 💧${data.weather.rain}mm • 🌫️AQI ${data.weather.aqi}
        </span>
      </div>
    `;
    }).join('');
}

function renderAdminUsersTable(users) {
    const tbody = document.getElementById('adminUsersBody');
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7">No users registered yet.</td></tr>';
        return;
    }

    tbody.innerHTML = users.map(u => `
    <tr>
      <td>${u.name}</td>
      <td>${u.city}</td>
      <td>${u.platform}</td>
      <td>${u.policy ? u.policy.planName : '—'}</td>
      <td>${u.policy ? '₹' + u.policy.weeklyPremium : '—'}</td>
      <td>${(u.claims || []).length}</td>
      <td>₹${u.wallet || 0}</td>
    </tr>
  `).join('');
}

function renderFraudAlerts(allClaims) {
    const tbody = document.getElementById('fraudAlertsBody');
    const flagged = allClaims.filter(c => c.fraudScore >= 30);

    if (flagged.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">No fraud alerts.</td></tr>';
        return;
    }

    tbody.innerHTML = flagged
        .slice()
        .reverse()
        .map(c => {
            const alertType = c.fraudScore >= 70 ? '🚫 Rejected' :
                c.fraudScore >= 40 ? '⚠️ Review' : '🔍 Watch';
            const action = c.status === 'rejected' ? 'Blocked' :
                c.status === 'review' ? 'Pending' : 'Passed';

            return `
        <tr>
          <td>${c.userName || 'Unknown'}</td>
          <td>${alertType}</td>
          <td style="font-weight:600; color: ${c.fraudScore >= 70 ? 'var(--red)' : c.fraudScore >= 40 ? '#b8860b' : 'var(--green)'}">
            ${c.fraudScore}/100
          </td>
          <td class="cap">${action}</td>
          <td>${new Date(c.date).toLocaleString('en-IN')}</td>
        </tr>
      `;
        }).join('');
}

function renderAdminCharts(users, allClaims) {
   
    const claimsByType = {};
    Object.keys(TRIGGERS).forEach(k => { claimsByType[k] = 0; });
    allClaims.forEach(c => { claimsByType[c.trigger] = (claimsByType[c.trigger] || 0) + 1; });

    const typeCtx = document.getElementById('claimsByTypeChart');
    if (typeCtx._chart) typeCtx._chart.destroy();

    if (typeof Chart !== 'undefined') {
        typeCtx._chart = new Chart(typeCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(TRIGGERS).map(k => TRIGGERS[k].name),
                datasets: [{
                    data: Object.keys(TRIGGERS).map(k => claimsByType[k] || 0),
                    backgroundColor: ['#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'],
                    borderWidth: 0,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { font: { family: "'Space Grotesk', sans-serif", size: 11 } } },
                },
            },
        });

        
        const revCtx = document.getElementById('revenueChart');
        if (revCtx._chart) revCtx._chart.destroy();

        const totalPremiums = users.reduce((sum, u) => sum + (u.policy?.weeklyPremium || 0), 0);
        const totalPayouts = allClaims.filter(c => c.status === 'approved').reduce((sum, c) => sum + c.payout, 0);

        revCtx._chart = new Chart(revCtx, {
            type: 'bar',
            data: {
                labels: ['Revenue (Premiums)', 'Payouts (Claims)', 'Net Margin'],
                datasets: [{
                    data: [totalPremiums, totalPayouts, totalPremiums - totalPayouts],
                    backgroundColor: ['#0e5a8a', '#f25c3a', totalPremiums - totalPayouts >= 0 ? '#0a6625' : '#8a1f0e'],
                    borderRadius: 8,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, ticks: { font: { family: "'Space Grotesk', sans-serif" } } },
                    x: { ticks: { font: { family: "'Space Grotesk', sans-serif", size: 11 } } },
                },
            },
        });
    }
}


function calculateDynamicPremium(baseRate, city, avgIncome) {
    const riskData = CITY_RISK[city] || CITY_RISK.Chennai;
    const zoneMultiplier = riskData.multiplier;

   
    let earningsFactor = 1.0;
    if (avgIncome <= 600) earningsFactor = 0.9;
    else if (avgIncome <= 800) earningsFactor = 1.0;
    else if (avgIncome <= 1000) earningsFactor = 1.1;
    else earningsFactor = 1.2;

    
    const month = new Date().getMonth();
    const seasonFactor = (month >= 5 && month <= 8) ? 1.15 : 1.0;

    return Math.round(baseRate * zoneMultiplier * earningsFactor * seasonFactor);
}


function predictNextWeekRisk(city) {
    const riskData = CITY_RISK[city] || CITY_RISK.Chennai;
    const baseRisk = riskData.multiplier * 40;
    const randomVariation = (Math.random() - 0.5) * 20;
    return Math.max(0, Math.min(100, Math.round(baseRisk + randomVariation)));
}


function showToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toastText').textContent = message;
    toast.classList.remove('hidden');
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => toast.classList.add('hidden'), 3500);
}


document.addEventListener('DOMContentLoaded', function () {
    updateHeader();

    
    const data = getAppData();
    if (data.users.length === 0) {
        seedDemoData();
    }

   
    navigate('landing');
});

function seedDemoData() {
    const data = getAppData();

    
    const demoUsers = [
        {
            name: 'Ravi Kumar', phone: '9876543210', email: 'ravi@sample.com', password: 'test123',
            city: 'Chennai', platform: 'Swiggy', avgDailyIncome: 1000, wallet: 1400,
            policy: { planId: 'growth', planName: 'Growth', weeklyPremium: 104, maxPayout: 850, coverageCap: 1500, startDate: new Date().toISOString(), endDate: new Date(Date.now() + 7 * 86400000).toISOString(), status: 'active' },
            claims: [
                { id: 1, date: new Date(Date.now() - 2 * 86400000).toISOString(), trigger: 'rain', severity: 4, status: 'approved', payout: 700, fraudScore: 5, fraudChecks: ['✅ All checks passed'] },
                { id: 2, date: new Date(Date.now() - 5 * 86400000).toISOString(), trigger: 'heat', severity: 3, status: 'approved', payout: 360, fraudScore: 12, fraudChecks: ['✅ All checks passed'] },
                { id: 3, date: new Date(Date.now() - 1 * 86400000).toISOString(), trigger: 'aqi', severity: 4, status: 'approved', payout: 340, fraudScore: 8, fraudChecks: ['✅ All checks passed'] },
            ],
            transactions: [
                { id: 10, date: new Date(Date.now() - 6 * 86400000).toISOString(), type: 'debit', description: 'Growth plan — weekly premium', amount: -104 },
                { id: 11, date: new Date(Date.now() - 5 * 86400000).toISOString(), type: 'credit', description: 'Extreme Heat disruption payout', amount: 360 },
                { id: 12, date: new Date(Date.now() - 2 * 86400000).toISOString(), type: 'credit', description: 'Heavy Rain disruption payout', amount: 700 },
                { id: 13, date: new Date(Date.now() - 1 * 86400000).toISOString(), type: 'credit', description: 'Severe AQI disruption payout', amount: 340 },
            ],
            registeredAt: new Date(Date.now() - 14 * 86400000).toISOString(),
        },
        {
            name: 'Priya Sharma', phone: '9876543211', email: 'priya@sample.com', password: 'test123',
            city: 'Delhi', platform: 'Zomato', avgDailyIncome: 900, wallet: 500,
            policy: { planId: 'essential', planName: 'Essential', weeklyPremium: 64, maxPayout: 500, coverageCap: 1000, startDate: new Date().toISOString(), endDate: new Date(Date.now() + 7 * 86400000).toISOString(), status: 'active' },
            claims: [
                { id: 4, date: new Date(Date.now() - 3 * 86400000).toISOString(), trigger: 'aqi', severity: 5, status: 'approved', payout: 500, fraudScore: 10, fraudChecks: ['✅ All checks passed'] },
            ],
            transactions: [
                { id: 20, date: new Date(Date.now() - 7 * 86400000).toISOString(), type: 'debit', description: 'Essential plan — weekly premium', amount: -64 },
                { id: 21, date: new Date(Date.now() - 3 * 86400000).toISOString(), type: 'credit', description: 'Severe AQI disruption payout', amount: 500 },
            ],
            registeredAt: new Date(Date.now() - 10 * 86400000).toISOString(),
        },
        {
            name: 'Arjun Reddy', phone: '9876543212', email: 'arjun@sample.com', password: 'test123',
            city: 'Mumbai', platform: 'Swiggy', avgDailyIncome: 1200, wallet: 1500,
            policy: { planId: 'shield_max', planName: 'Shield Max', weeklyPremium: 139, maxPayout: 1500, coverageCap: 2500, startDate: new Date().toISOString(), endDate: new Date(Date.now() + 7 * 86400000).toISOString(), status: 'active' },
            claims: [
                { id: 5, date: new Date(Date.now() - 1 * 86400000).toISOString(), trigger: 'rain', severity: 5, status: 'approved', payout: 800, fraudScore: 3, fraudChecks: ['✅ All checks passed'] },
                { id: 6, date: new Date(Date.now() - 4 * 86400000).toISOString(), trigger: 'outage', severity: 3, status: 'approved', payout: 240, fraudScore: 15, fraudChecks: ['✅ All checks passed'] },
                { id: 7, date: new Date(Date.now() - 2 * 86400000).toISOString(), trigger: 'rain', severity: 4, status: 'review', payout: 320, fraudScore: 45, fraudChecks: ['⚠️ High velocity: 3 claims in 5 days', '✅ GPS verified'] },
            ],
            transactions: [
                { id: 30, date: new Date(Date.now() - 7 * 86400000).toISOString(), type: 'debit', description: 'Shield Max plan — weekly premium', amount: -139 },
                { id: 31, date: new Date(Date.now() - 4 * 86400000).toISOString(), type: 'credit', description: 'App Outage disruption payout', amount: 240 },
                { id: 32, date: new Date(Date.now() - 2 * 86400000).toISOString(), type: 'credit', description: 'Heavy Rain disruption payout (partial)', amount: 320 },
                { id: 33, date: new Date(Date.now() - 1 * 86400000).toISOString(), type: 'credit', description: 'Heavy Rain disruption payout', amount: 800 },
            ],
            registeredAt: new Date(Date.now() - 21 * 86400000).toISOString(),
        },
    ];

    data.users = demoUsers;
    saveAppData(data);
}
