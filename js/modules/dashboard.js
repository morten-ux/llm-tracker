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
    <button class="btn-ghost" id="dash-rerun-btn" style="display:none;">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-5"/></svg>
      Herhaal laatste
    </button>
    <button class="btn" onclick="App.navigate('brand-tracker')">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      Nieuwe test
    </button>
  </div>
</div>

<div class="dash-hero">
  <div class="dash-hero-metric">
    <div class="dash-hero-label">Gem. mention rate</div>
    <div class="dash-hero-value" id="dash-rate">—</div>
    <div id="dash-trend-wrap" style="margin-bottom:10px;"></div>
    <div class="dash-hero-sub" id="dash-last-info">Voer je eerste test uit om te beginnen</div>
  </div>
  <div class="dash-hero-divider"></div>
  <div class="dash-hero-chart">
    <div class="dash-chart-header">
      <span class="dash-chart-label">Trend — laatste tests</span>
      <span class="dash-chart-sub" id="dash-spark-sub"></span>
    </div>
    <div class="dash-sparkline" id="dash-sparkline">
      <div class="dash-spark-empty">Nog geen data</div>
    </div>
  </div>
</div>

<div class="stat-grid">
  <div class="stat-card">
    <div class="stat-label">Tests uitgevoerd</div>
    <div class="stat-value" id="dash-runs">—</div>
    <div class="stat-delta delta-neutral" id="dash-last-date">Nog geen tests</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Gevolgde brands</div>
    <div class="stat-value" id="dash-brands">—</div>
    <div class="stat-delta delta-neutral">Unieke brand namen</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Beste LLM</div>
    <div class="stat-value" style="font-size:18px;" id="dash-best-llm">—</div>
    <div class="stat-delta delta-neutral" id="dash-best-llm-sub">Hoogste mention rate</div>
  </div>
  <div class="stat-card" id="dash-alerts-card">
    <div class="stat-label">Actieve alerts</div>
    <div class="stat-value" id="dash-alerts">0</div>
    <div class="stat-delta delta-neutral" id="dash-alerts-sub">Geen openstaande alerts</div>
  </div>
</div>

<div class="dash-bottom-grid">
  <div class="card">
    <div class="flex-between" style="margin-bottom:16px;">
      <div>
        <div class="card-title">Recente tests</div>
        <div class="card-sub">Laatste 5 uitgevoerde tests</div>
      </div>
      <button class="btn-ghost btn-sm" onclick="App.navigate('brand-tracker')">Bekijk history →</button>
    </div>
    <div id="dash-recent"></div>
  </div>

  <div style="display:flex; flex-direction:column; gap:16px;">
    <div class="card" id="dash-llm-card">
      <div class="card-title" style="margin-bottom:14px;">Per LLM</div>
      <div id="dash-llm-bars"><div style="font-size:13px;color:var(--text-3);">Nog geen data</div></div>
    </div>
    <div class="card">
      <div class="card-title" style="margin-bottom:14px;">Snelle acties</div>
      <div class="dash-actions" id="dash-actions-list"></div>
    </div>
  </div>
</div>
    `;
  },

  init: function() {
    var actions = [
      { module: 'brand-tracker', icon: 'play',    cls: 'dash-icon-primary', title: 'Nieuwe test',   sub: 'Test brand mentions nu' },
      { module: 'analytics',    icon: 'barChart', cls: 'dash-icon-blue',    title: 'Analytics',     sub: 'Bekijk performance' },
      { module: 'competitors',  icon: 'users',    cls: 'dash-icon-purple',  title: 'Competitors',   sub: 'Vergelijk concurrenten' },
      { module: 'alerts',       icon: 'bell',     cls: 'dash-icon-orange',  title: 'Alerts',        sub: 'Bekijk meldingen' },
    ];
    var actionsEl = document.getElementById('dash-actions-list');
    if (actionsEl) {
      actionsEl.innerHTML = actions.map(function(a) {
        return '<div class="dash-action-card" onclick="App.navigate(\'' + a.module + '\')">'
          + '<div class="dash-action-icon ' + a.cls + '">' + App.icon(a.icon, 16) + '</div>'
          + '<div><div class="dash-action-title">' + a.title + '</div><div class="dash-action-sub">' + a.sub + '</div></div>'
          + '</div>';
      }).join('');
    }

    var rerunBtn = document.getElementById('dash-rerun-btn');
    if (rerunBtn) {
      var lastEntry = ApiService.getHistory()[0];
      if (lastEntry) {
        rerunBtn.style.display = '';
        rerunBtn.addEventListener('click', function() {
          App.navigate('brand-tracker');
          setTimeout(function() { if (window.BrandTracker) BrandTracker.rerunTest(lastEntry.id); }, 80);
        });
      }
    }

    DashboardModule.refresh();
  }
});

window.DashboardModule = {

  _entryRate: function(entry) {
    var brands = entry.brands || [];
    var hits = 0, total = 0;
    Object.keys(entry.results || {}).forEach(function(llm) {
      Object.values(entry.results[llm] || {}).forEach(function(r) {
        total++;
        brands.forEach(function(b) {
          if (r && r.toLowerCase().includes(b.toLowerCase())) hits++;
        });
      });
    });
    return total ? Math.round(hits / total * 100) : null;
  },

  refresh: function() {
    var history = ApiService.getHistory();
    var alerts = JSON.parse(localStorage.getItem('llm_tracker_alerts') || '[]');
    var activeAlerts = alerts.filter(function(a) { return !a.dismissed; }).length;

    // ── Stat: runs ──
    var el = document.getElementById('dash-runs');
    if (el) el.textContent = history.length || '—';

    if (history.length) {
      var lastDateEl = document.getElementById('dash-last-date');
      if (lastDateEl) {
        var d = new Date(history[0].timestamp);
        lastDateEl.textContent = 'Laatste: ' + d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' }) + ' ' + d.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
      }
    }

    // ── Avg mention rate ──
    var totalHits = 0, totalResp = 0;
    var llmMap = {};
    history.forEach(function(entry) {
      var brands = entry.brands || [];
      Object.keys(entry.results || {}).forEach(function(llm) {
        if (!llmMap[llm]) llmMap[llm] = { hits: 0, total: 0 };
        Object.values(entry.results[llm]).forEach(function(r) {
          totalResp++; llmMap[llm].total++;
          brands.forEach(function(b) {
            if (r && r.toLowerCase().includes(b.toLowerCase())) {
              totalHits++; llmMap[llm].hits++;
            }
          });
        });
      });
    });
    var avgRate = totalResp ? Math.round(totalHits / totalResp * 100) : null;

    var rateEl = document.getElementById('dash-rate');
    if (rateEl) {
      rateEl.textContent = avgRate !== null ? avgRate + '%' : '—';
      rateEl.style.color = avgRate === null ? '' : avgRate >= 50 ? 'var(--green)' : avgRate >= 25 ? 'var(--yellow)' : 'var(--red)';
    }

    // ── Hero sub text ──
    var lastInfoEl = document.getElementById('dash-last-info');
    if (lastInfoEl && history.length) {
      var ld = new Date(history[0].timestamp);
      lastInfoEl.textContent = 'Gebaseerd op ' + totalResp + ' LLM responses · Laatste test ' + ld.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long' });
    }

    // ── Trend badge ──
    var trendWrap = document.getElementById('dash-trend-wrap');
    if (trendWrap && history.length >= 2) {
      var lastRate = DashboardModule._entryRate(history[0]);
      var prevRates = history.slice(1, 6).map(DashboardModule._entryRate).filter(function(r) { return r !== null; });
      var prevAvg = prevRates.length ? Math.round(prevRates.reduce(function(a, v) { return a + v; }, 0) / prevRates.length) : null;
      if (lastRate !== null && prevAvg !== null) {
        var diff = lastRate - prevAvg;
        var cls = diff > 3 ? 'up' : diff < -3 ? 'down' : 'neutral';
        var arrow = diff > 3 ? '↑' : diff < -3 ? '↓' : '→';
        var label = (diff > 0 ? '+' : '') + diff + 'pp vs vorige tests';
        trendWrap.innerHTML = '<span class="dash-trend ' + cls + '">' + arrow + ' ' + label + '</span>';
      }
    }

    // ── Sparkline ──
    var sparkEl = document.getElementById('dash-sparkline');
    var sparkSubEl = document.getElementById('dash-spark-sub');
    if (sparkEl && history.length) {
      var sparkData = history.slice(0, 10).reverse().map(function(e) {
        return { rate: DashboardModule._entryRate(e), brands: (e.brands || []).join(', '), date: new Date(e.timestamp).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' }) };
      });
      var validRates = sparkData.filter(function(d) { return d.rate !== null; });
      if (validRates.length) {
        var maxRate = Math.max.apply(null, validRates.map(function(d) { return d.rate; }));
        sparkEl.innerHTML = sparkData.map(function(d) {
          var h = d.rate !== null ? Math.max(8, Math.round((d.rate / Math.max(maxRate, 1)) * 56)) : 8;
          var color = d.rate === null ? 'var(--border)' : d.rate >= 50 ? 'var(--green)' : d.rate >= 25 ? 'var(--yellow)' : 'var(--red)';
          var tip = d.rate !== null ? d.date + ': ' + d.rate + '%' : d.date + ': geen data';
          return '<div class="dash-spark-bar" style="height:' + h + 'px; background:' + color + ';" title="' + ApiService.escapeHtml(tip) + '"></div>';
        }).join('');
        if (sparkSubEl) sparkSubEl.textContent = validRates.length + ' tests weergegeven';
      }
    }

    // ── Unique brands ──
    var allBrands = {};
    history.forEach(function(e) { (e.brands || []).forEach(function(b) { allBrands[b.toLowerCase()] = true; }); });
    var brandsEl = document.getElementById('dash-brands');
    if (brandsEl) brandsEl.textContent = Object.keys(allBrands).length || '—';

    // ── Best LLM ──
    var llmsSorted = Object.keys(llmMap).map(function(llm) {
      var v = llmMap[llm];
      return { name: llm, rate: v.total ? Math.round(v.hits / v.total * 100) : 0 };
    }).sort(function(a, b) { return b.rate - a.rate; });
    var bestLlmEl = document.getElementById('dash-best-llm');
    var bestLlmSubEl = document.getElementById('dash-best-llm-sub');
    if (bestLlmEl) bestLlmEl.textContent = llmsSorted.length ? llmsSorted[0].name : '—';
    if (bestLlmSubEl) bestLlmSubEl.textContent = llmsSorted.length ? llmsSorted[0].rate + '% mention rate' : 'Nog geen data';

    // ── Per-LLM bars ──
    var llmBarsEl = document.getElementById('dash-llm-bars');
    if (llmBarsEl) {
      if (!llmsSorted.length) {
        llmBarsEl.innerHTML = '<div style="font-size:13px;color:var(--text-3);">Nog geen data</div>';
      } else {
        var llmColors = { Claude: 'var(--primary)', ChatGPT: '#10a37f', Gemini: '#4285f4' };
        llmBarsEl.innerHTML = llmsSorted.map(function(l) {
          var color = llmColors[l.name] || 'var(--primary)';
          var rateCls = l.rate >= 50 ? 'green' : l.rate < 25 ? 'red' : '';
          return '<div class="prog-row">'
            + '<div class="prog-label"><span>' + ApiService.escapeHtml(l.name) + '</span><span class="' + rateCls + '">' + l.rate + '%</span></div>'
            + '<div class="prog-track"><div class="prog-fill" style="width:' + l.rate + '%; background:' + color + ';"></div></div>'
            + '</div>';
        }).join('');
      }
    }

    // ── Alerts ──
    var alertsEl = document.getElementById('dash-alerts');
    var alertsSubEl = document.getElementById('dash-alerts-sub');
    var alertsCard = document.getElementById('dash-alerts-card');
    if (alertsEl) alertsEl.textContent = activeAlerts;
    if (alertsSubEl) alertsSubEl.textContent = activeAlerts > 0 ? activeAlerts + ' vereisen aandacht' : 'Geen openstaande alerts';
    if (alertsCard && activeAlerts > 0) {
      alertsCard.style.borderColor = 'var(--red)';
      if (alertsEl) alertsEl.style.color = 'var(--red)';
      if (alertsSubEl) alertsSubEl.className = 'stat-delta delta-down';
    }

    // ── Recent tests ──
    var recentEl = document.getElementById('dash-recent');
    if (!recentEl) return;

    if (!history.length) {
      recentEl.innerHTML = '<div class="empty-state" style="padding:28px 0;">'
        + '<div class="empty-state-icon">' + App.icon('clock', 28) + '</div>'
        + '<h3 style="font-size:14px; margin-bottom:6px;">Nog geen tests uitgevoerd</h3>'
        + '<p style="font-size:13px; color:var(--text-3);">Voer je eerste test uit om performance te meten.</p>'
        + '<button class="btn btn-sm mt-16" onclick="App.navigate(\'brand-tracker\')">Start eerste test</button>'
        + '</div>';
      return;
    }

    recentEl.innerHTML = history.slice(0, 5).map(function(entry) {
      var rate = DashboardModule._entryRate(entry);
      var rateCls = rate !== null ? (rate >= 50 ? 'green' : rate > 0 ? '' : 'red') : '';
      var barColor = rate !== null ? (rate >= 50 ? 'var(--green)' : rate >= 25 ? 'var(--yellow)' : 'var(--red)') : 'var(--border)';
      var d = new Date(entry.timestamp);
      var dateStr = d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' }) + ' ' + d.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
      var brands = entry.brands || [];
      return '<div class="dash-test-row">'
        + '<div class="dash-test-info">'
        + '<div class="dash-test-brands">'
        + brands.slice(0, 2).map(function(b) { return ApiService.escapeHtml(b); }).join(', ')
        + (brands.length > 2 ? ' <span style="color:var(--text-3)">+' + (brands.length - 2) + '</span>' : '')
        + '</div>'
        + '<div class="dash-test-meta">' + ApiService.escapeHtml(entry.treatment || '') + (entry.city ? ' · ' + ApiService.escapeHtml(entry.city) : '') + ' · ' + dateStr + '</div>'
        + '<div class="dash-test-bar-wrap"><div class="dash-test-bar" style="width:' + (rate || 0) + '%; background:' + barColor + ';"></div></div>'
        + '</div>'
        + '<span class="dash-test-rate ' + rateCls + '">' + (rate !== null ? rate + '%' : '—') + '</span>'
        + '</div>';
    }).join('');
  }
};
