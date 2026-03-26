App.registerModule('dashboard', {
  label: 'Dashboard',
  icon: 'grid',
  render: function() {
    return `
<div class="page-header">
  <div class="page-header-left">
    <h1>Dashboard</h1>
    <p>Overzicht van jouw LLM brand performance</p>
  </div>
  <div class="page-header-actions">
    <button class="btn" onclick="App.navigate('brand-tracker')">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      Nieuwe test
    </button>
  </div>
</div>

<div class="stat-grid">
  <div class="stat-card">
    <div class="stat-label">Tests uitgevoerd</div>
    <div class="stat-value" id="dash-runs">—</div>
    <div class="stat-delta delta-neutral" id="dash-last">Nog geen tests</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Gem. mention rate</div>
    <div class="stat-value" id="dash-rate">—</div>
    <div class="stat-delta delta-neutral">Over alle LLMs en brands</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Gevolgde brands</div>
    <div class="stat-value" id="dash-brands">—</div>
    <div class="stat-delta delta-neutral">Unieke brand namen</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Actieve alerts</div>
    <div class="stat-value" id="dash-alerts">0</div>
    <div class="stat-delta delta-neutral" id="dash-alerts-sub">Geen openstaande alerts</div>
  </div>
</div>

<div class="grid2">
  <div class="card">
    <div class="flex-between" style="margin-bottom:14px;">
      <div>
        <div class="card-title">Recente tests</div>
        <div class="card-sub">Laatste 5 uitgevoerde tests</div>
      </div>
      <button class="btn-ghost btn-sm" onclick="App.navigate('brand-tracker')">Alle tests →</button>
    </div>
    <div id="dash-recent"></div>
  </div>

  <div class="card">
    <div class="card-title" style="margin-bottom:16px;">Snelle acties</div>
    <div class="dash-actions" id="dash-actions-list"></div>
  </div>
</div>
    `;
  },
  init: function() {
    var actions = [
      { module: 'brand-tracker', icon: 'play',     cls: 'dash-icon-primary', title: 'Nieuwe test',    sub: 'Test brand mentions nu' },
      { module: 'analytics',    icon: 'barChart',  cls: 'dash-icon-blue',    title: 'Analytics',      sub: 'Bekijk performance trends' },
      { module: 'competitors',  icon: 'users',     cls: 'dash-icon-purple',  title: 'Competitors',    sub: 'Vergelijk concurrenten' },
      { module: 'alerts',       icon: 'bell',      cls: 'dash-icon-orange',  title: 'Alerts',         sub: 'Bekijk actieve meldingen' },
    ];
    var actionsEl = document.getElementById('dash-actions-list');
    if (actionsEl) {
      actionsEl.innerHTML = actions.map(function(a) {
        return '<div class="dash-action-card" onclick="App.navigate(\'' + a.module + '\')">'
          + '<div class="dash-action-icon ' + a.cls + '">' + App.icon(a.icon, 18) + '</div>'
          + '<div><div class="dash-action-title">' + a.title + '</div><div class="dash-action-sub">' + a.sub + '</div></div>'
          + '</div>';
      }).join('');
    }
    DashboardModule.refresh();
  }
});

window.DashboardModule = {
  refresh: function() {
    var history = ApiService.getHistory();
    var alerts = JSON.parse(localStorage.getItem('llm_tracker_alerts') || '[]');
    var activeAlerts = alerts.filter(function(a) { return !a.dismissed; }).length;

    // Stat: runs
    var runsEl = document.getElementById('dash-runs');
    if (runsEl) runsEl.textContent = history.length || '—';

    // Stat: last test date
    if (history.length) {
      var lastEl = document.getElementById('dash-last');
      if (lastEl) {
        var d = new Date(history[0].timestamp);
        lastEl.textContent = 'Laatste: ' + d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' }) + ' ' + d.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
      }
    }

    // Stat: avg mention rate
    var totalHits = 0, totalResp = 0;
    history.forEach(function(entry) {
      var brands = entry.brands || [];
      Object.keys(entry.results || {}).forEach(function(llm) {
        Object.values(entry.results[llm]).forEach(function(r) {
          totalResp++;
          brands.forEach(function(b) {
            if (r && r.toLowerCase().includes(b.toLowerCase())) totalHits++;
          });
        });
      });
    });
    var rateEl = document.getElementById('dash-rate');
    if (rateEl) rateEl.textContent = totalResp ? Math.round(totalHits / totalResp * 100) + '%' : '—';

    // Stat: unique brands
    var allBrands = {};
    history.forEach(function(e) { (e.brands || []).forEach(function(b) { allBrands[b.toLowerCase()] = true; }); });
    var brandsEl = document.getElementById('dash-brands');
    if (brandsEl) brandsEl.textContent = Object.keys(allBrands).length || '—';

    // Stat: alerts
    var alertsEl = document.getElementById('dash-alerts');
    var alertsSubEl = document.getElementById('dash-alerts-sub');
    if (alertsEl) alertsEl.textContent = activeAlerts;
    if (alertsSubEl) alertsSubEl.textContent = activeAlerts > 0 ? activeAlerts + ' vereisen aandacht' : 'Geen openstaande alerts';

    // Recent tests list
    var recentEl = document.getElementById('dash-recent');
    if (!recentEl) return;

    if (!history.length) {
      recentEl.innerHTML = '<div class="empty-state" style="padding:24px 0;">'
        + '<div class="empty-state-icon">' + App.icon('clock', 28) + '</div>'
        + '<h3 style="font-size:14px; margin-bottom:6px;">Nog geen tests uitgevoerd</h3>'
        + '<p style="font-size:13px;">Voer je eerste test uit om je brand performance te meten.</p>'
        + '<button class="btn btn-sm mt-16" onclick="App.navigate(\'brand-tracker\')">Test uitvoeren</button>'
        + '</div>';
      return;
    }

    recentEl.innerHTML = history.slice(0, 5).map(function(entry) {
      var brands = entry.brands || [];
      var llmNames = Object.keys(entry.results || {});
      var hits = 0, total = 0;
      llmNames.forEach(function(llm) {
        Object.values(entry.results[llm] || {}).forEach(function(r) {
          total++;
          brands.forEach(function(b) {
            if (r && r.toLowerCase().includes(b.toLowerCase())) hits++;
          });
        });
      });
      var rate = total ? Math.round(hits / total * 100) : null;
      var rateCls = rate !== null ? (rate >= 50 ? 'green' : rate > 0 ? '' : 'red') : '';
      var d = new Date(entry.timestamp);
      var dateStr = d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' }) + ' ' + d.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });

      return '<div class="dash-test-row">'
        + '<div class="dash-test-info">'
        + '<div class="dash-test-brands">'
        + brands.slice(0, 2).map(function(b) { return ApiService.escapeHtml(b); }).join(', ')
        + (brands.length > 2 ? ' <span style="color:var(--text-3)">+' + (brands.length - 2) + '</span>' : '')
        + '</div>'
        + '<div class="dash-test-meta">'
        + ApiService.escapeHtml(entry.treatment || '') + (entry.city ? ' · ' + ApiService.escapeHtml(entry.city) : '') + ' · ' + dateStr
        + '</div>'
        + '</div>'
        + '<span class="dash-test-rate ' + rateCls + '">' + (rate !== null ? rate + '%' : '—') + '</span>'
        + '</div>';
    }).join('');
  }
};
