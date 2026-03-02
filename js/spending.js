// Spending tracker module — Plaid integration

let spendingInitialized = false;
let plaidConnected = false;

async function initSpendingTab() {
  if (spendingInitialized) {
    renderSpendingTab();
    return;
  }
  spendingInitialized = true;

  const online = await checkBackend();
  if (!online) {
    renderSpendingOffline();
    return;
  }

  try {
    const status = await apiGet('/api/plaid/status');
    plaidConnected = status.connected;
  } catch {
    plaidConnected = false;
  }

  renderSpendingTab();

  if (plaidConnected) {
    await refreshSpendingIfNeeded();
  }
}

function renderSpendingOffline() {
  document.getElementById('spending-content').innerHTML = `
    <div class="offline-msg">
      <p>Backend server is not running</p>
      <p>Start it with:</p>
      <code>cd server && npm run dev</code>
    </div>
  `;
}

function renderSpendingTab() {
  const el = document.getElementById('spending-content');

  if (!plaidConnected) {
    el.innerHTML = `
      <div class="connect-card">
        <div class="section-title">Chase Bank</div>
        <p>Connect your Chase bank account to track spending</p>
        <button class="btn" onclick="connectPlaid()">Connect Chase Bank</button>
      </div>
    `;
    return;
  }

  const cache = localStorage.getItem('lifeos-spending-cache');
  if (!cache) {
    el.innerHTML = `
      <div class="skeleton skeleton-block"></div>
      <div class="skeleton skeleton-block"></div>
      <div class="skeleton skeleton-line"></div>
      <div class="skeleton skeleton-line short"></div>
    `;
    return;
  }

  const data = JSON.parse(cache);
  renderSpendingData(data);
}

function renderSpendingData(data) {
  const el = document.getElementById('spending-content');

  // Balance
  let balanceHtml = '';
  if (data.balances && data.balances.length > 0) {
    balanceHtml = data.balances.map(b => `
      <div class="balance-card">
        <div class="balance-label">${b.name}</div>
        <div class="balance-amount">$${(b.current || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
      </div>
    `).join('');
  }

  // Summary
  const total = data.total || 0;
  const txCount = data.transactions ? data.transactions.length : 0;

  // Category breakdown
  const categories = {};
  const categoryColors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];
  if (data.transactions) {
    data.transactions.forEach(tx => {
      const cat = tx.category || 'Other';
      categories[cat] = (categories[cat] || 0) + Math.abs(tx.amount);
    });
  }

  const sortedCats = Object.entries(categories).sort((a, b) => b[1] - a[1]);
  const maxCat = sortedCats.length > 0 ? sortedCats[0][1] : 1;

  let categoryHtml = sortedCats.map(([cat, amt], i) => `
    <div class="category-bar">
      <span class="category-name">${cat}</span>
      <div class="category-track">
        <div class="category-fill" style="width:${(amt / maxCat * 100).toFixed(0)}%;background:${categoryColors[i % categoryColors.length]}"></div>
      </div>
      <span class="category-amount">$${amt.toFixed(0)}</span>
    </div>
  `).join('');

  // Transactions
  let txHtml = '';
  if (data.transactions && data.transactions.length > 0) {
    txHtml = data.transactions.slice(0, 20).map(tx => `
      <div class="transaction-item">
        <div>
          <div class="transaction-name">${tx.name}</div>
          <div class="transaction-cat">${tx.category || 'Other'}</div>
        </div>
        <div>
          <div class="transaction-amount">-$${Math.abs(tx.amount).toFixed(2)}</div>
          <div class="transaction-date">${tx.date}</div>
        </div>
      </div>
    `).join('');
  }

  el.innerHTML = `
    ${balanceHtml}
    <div class="spending-summary">
      <div class="spending-stat">
        <div class="spending-stat-value">$${total.toFixed(0)}</div>
        <div class="spending-stat-label">30-day total</div>
      </div>
      <div class="spending-stat">
        <div class="spending-stat-value">${txCount}</div>
        <div class="spending-stat-label">Transactions</div>
      </div>
    </div>
    <div class="category-chart">
      <div class="section-title">Spending by Category</div>
      ${categoryHtml}
    </div>
    <div class="section-title">Recent Transactions</div>
    <div class="transaction-list">${txHtml}</div>
    <div style="text-align:center;margin-top:16px">
      <button class="btn-outline btn-sm" onclick="refreshSpending()">Refresh</button>
      <button class="btn-outline btn-sm btn-danger" onclick="disconnectPlaid()" style="margin-left:8px">Disconnect</button>
    </div>
  `;
}

async function connectPlaid() {
  try {
    const { link_token } = await apiPost('/api/plaid/create-link-token', {});

    const handler = Plaid.create({
      token: link_token,
      onSuccess: async (public_token) => {
        await apiPost('/api/plaid/exchange-token', { public_token });
        plaidConnected = true;
        await refreshSpending();
      },
      onExit: () => {},
    });

    handler.open();
  } catch (err) {
    alert('Failed to connect: ' + err.message);
  }
}

async function refreshSpendingIfNeeded() {
  const cache = localStorage.getItem('lifeos-spending-cache');
  if (cache) {
    const data = JSON.parse(cache);
    if (data._ts && Date.now() - data._ts < 3600000) return; // <1hr old
  }
  await refreshSpending();
}

async function refreshSpending() {
  try {
    const [txRes, balRes] = await Promise.all([
      apiGet('/api/plaid/transactions'),
      apiGet('/api/plaid/balance'),
    ]);

    const total = txRes.transactions.reduce((a, t) => a + Math.abs(t.amount), 0);

    const cache = {
      transactions: txRes.transactions,
      balances: balRes.accounts,
      total,
      _ts: Date.now(),
    };

    localStorage.setItem('lifeos-spending-cache', JSON.stringify(cache));
    renderSpendingData(cache);
    updateQuickStats();
  } catch (err) {
    if (err.message.includes('401') || err.message.includes('403')) {
      document.getElementById('spending-content').innerHTML = `
        <div class="connect-card">
          <p>Session expired</p>
          <button class="btn-reconnect" onclick="connectPlaid()">Reconnect</button>
        </div>
      `;
    }
  }
}

async function disconnectPlaid() {
  plaidConnected = false;
  localStorage.removeItem('lifeos-spending-cache');
  spendingInitialized = false;
  renderSpendingTab();
}
