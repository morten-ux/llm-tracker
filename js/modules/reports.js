App.registerModule('reports', {
  label: 'Reports',
  icon: 'fileText',
  render: function() {
    return `
<div class="page-header">
  <div class="page-header-left">
    <h1>Reports</h1>
    <p>Gegenereerde rapporten op basis van je testdata</p>
  </div>
  <div class="page-header-actions">
    <button class="btn-ghost" id="report-export-btn">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      Exporteer CSV
    </button>
  </div>
</div>

<div id="reports-cards" class="grid2"></div>

<div class="card mb-20">
  <div class="card-title" style="margin-bottom:16px;">Geplande rapporten</div>
  <div>
    <div class="toggle-row">
      <div>
        <div class="toggle-label">Maandelijks rapport</div>
        <div class="toggle-sub">Automatisch aangemaakt op de 1e van elke maand</div>
      </div>
      <label class="toggle">
        <input type="checkbox" checked />
        <span class="toggle-slider"></span>
      </label>
    </div>
    <div class="toggle-row">
      <div>
        <div class="toggle-label">Wekelijks snapshot</div>
        <div class="toggle-sub">Elke maandag een beknopt overzicht</div>
      </div>
      <label class="toggle">
        <input type="checkbox" />
        <span class="toggle-slider"></span>
      </label>
    </div>
    <div class="toggle-row">
      <div>
        <div class="toggle-label">Concurrent analyse includen</div>
        <div class="toggle-sub">Voeg benchmarkdata toe aan rapporten</div>
      </div>
      <label class="toggle">
        <input type="checkbox" checked />
        <span class="toggle-slider"></span>
      </label>
    </div>
  </div>
</div>

<div class="table-card">
  <table class="data-table">
    <thead>
      <tr>
        <th>Periode</th>
        <th>Brands</th>
        <th>Runs</th>
        <th>Gem. score</th>
        <th>Export</th>
      </tr>
    </thead>
    <tbody id="reports-tbody"></tbody>
  </table>
</div>
    `;
  },
  init: function() {
    var exportBtn = document.getElementById('report-export-btn');
    if (exportBtn) exportBtn.addEventListener('click', function() { ReportsModule.exportCSV(); });
    ReportsModule.render();
  }
});

window.ReportsModule = {
  _groupByMonth: function(history) {
    var months = {};
    history.forEach(function(entry) {
      var d = new Date(entry.timestamp);
      var key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
      if (!months[key]) months[key] = [];
      months[key].push(entry);
    });
    return months;
  },

  _computeMonthStats: function(entries) {
    var brandSet = {};
    var totalHits = 0, totalResp = 0;
    entries.forEach(function(entry) {
      (entry.brands || []).forEach(function(b) { brandSet[b] = true; });
      Object.keys(entry.results || {}).forEach(function(llm) {
        var responses = Object.values(entry.results[llm]);
        responses.forEach(function(r) {
          totalResp++;
          if (r && (entry.brands || []).some(function(b) { return r.toLowerCase().includes(b.toLowerCase()); })) totalHits++;
        });
      });
    });
    var avgRate = totalResp ? Math.round(totalHits / totalResp * 100) : 0;
    var brands = Object.keys(brandSet);

    // Best brand
    var brandRates = brands.map(function(brand) {
      var hits = 0, total = 0;
      entries.forEach(function(entry) {
        if (!(entry.brands || []).includes(brand)) return;
        Object.values(entry.results || {}).forEach(function(llmResp) {
          Object.values(llmResp).forEach(function(r) {
            total++;
            if (r && r.toLowerCase().includes(brand.toLowerCase())) hits++;
          });
        });
      });
      return { brand: brand, rate: total ? Math.round(hits / total * 100) : 0 };
    }).sort(function(a, b) { return b.rate - a.rate; });

    return { runs: entries.length, brands: brands, avgRate: avgRate, bestBrand: brandRates[0] || null };
  },

  _monthLabel: function(key) {
    var parts = key.split('-');
    var months = ['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec'];
    return months[parseInt(parts[1]) - 1] + ' ' + parts[0];
  },

  render: function() {
    var history = ApiService.getHistory();
    var months = this._groupByMonth(history);
    var keys = Object.keys(months).sort().reverse();

    var cardsEl = document.getElementById('reports-cards');
    var tbody = document.getElementById('reports-tbody');
    if (!cardsEl || !tbody) return;

    if (!keys.length) {
      cardsEl.innerHTML = '<div class="card"><div class="card-title">Geen data</div><div class="card-sub">Voer eerst tests uit in de Brand Tracker.</div></div>';
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--text-3); padding:20px;">Nog geen testdata</td></tr>';
      return;
    }

    // Top 2 month cards
    var top2 = keys.slice(0, 2);
    cardsEl.innerHTML = top2.map(function(key, idx) {
      var stats = ReportsModule._computeMonthStats(months[key]);
      var label = ReportsModule._monthLabel(key);
      var isFeatured = idx === 0;
      return '<div class="card' + (isFeatured ? '" style="border-color:var(--primary); border-width:2px;' : '') + '">'
        + '<div class="flex-between mb-16"><div>'
        + '<div class="card-title">Rapport ' + label + '</div>'
        + '<div class="card-sub">' + stats.brands.length + ' brand' + (stats.brands.length !== 1 ? 's' : '') + ' &middot; ' + stats.runs + ' runs</div>'
        + '</div>' + (isFeatured ? '<span class="badge badge-blue">Laatste</span>' : '') + '</div>'
        + '<div style="background:var(--bg); border-radius:10px; padding:12px 14px; margin-bottom:16px;">'
        + '<div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:6px;"><span class="text-muted">Gem. mention rate</span><strong style="color:' + (stats.avgRate >= 50 ? 'var(--green)' : stats.avgRate < 30 ? 'var(--red)' : 'var(--yellow)') + ';">' + stats.avgRate + '%</strong></div>'
        + '<div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:6px;"><span class="text-muted">Brands getracked</span><strong>' + stats.brands.join(', ') + '</strong></div>'
        + (stats.bestBrand ? '<div style="display:flex; justify-content:space-between; font-size:13px;"><span class="text-muted">Beste brand</span><strong>' + ApiService.escapeHtml(stats.bestBrand.brand) + ' (' + stats.bestBrand.rate + '%)</strong></div>' : '')
        + '</div>'
        + '<button class="' + (isFeatured ? 'btn' : 'btn-ghost') + '" style="width:100%; justify-content:center;" onclick="ReportsModule.exportCSVForMonth(\'' + key + '\')">'
        + '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>'
        + ' Download CSV</button>'
        + '</div>';
    }).join('');

    // Table
    tbody.innerHTML = keys.map(function(key) {
      var stats = ReportsModule._computeMonthStats(months[key]);
      var label = ReportsModule._monthLabel(key);
      var cls = stats.avgRate >= 50 ? 'green' : stats.avgRate < 30 ? 'red' : '';
      return '<tr>'
        + '<td><strong>' + label + '</strong></td>'
        + '<td>' + stats.brands.map(function(b) { return ApiService.escapeHtml(b); }).join(', ') + '</td>'
        + '<td style="text-align:center;">' + stats.runs + '</td>'
        + '<td style="text-align:center;" class="' + cls + '"><strong>' + stats.avgRate + '%</strong></td>'
        + '<td style="text-align:center;"><button class="btn-ghost btn-sm" onclick="ReportsModule.exportCSVForMonth(\'' + key + '\')">'
        + '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>'
        + ' CSV</button></td>'
        + '</tr>';
    }).join('');
  },

  _buildCSV: function(entries) {
    var llms = [];
    entries.forEach(function(e) { Object.keys(e.results || {}).forEach(function(llm) { if (!llms.includes(llm)) llms.push(llm); }); });
    var rows = [['Datum', 'Brands', 'Behandeling', 'Stad'].concat(llms.map(function(l) { return l + ' mention rate'; })).concat(['Gem. rate'])];
    entries.forEach(function(entry) {
      var brands = entry.brands || [];
      var date = new Date(entry.timestamp).toLocaleDateString('nl-NL');
      var perLLM = {};
      llms.forEach(function(llm) {
        var responses = Object.values(entry.results[llm] || {});
        if (!responses.length) { perLLM[llm] = '—'; return; }
        var hits = responses.filter(function(r) {
          return r && brands.some(function(b) { return r.toLowerCase().includes(b.toLowerCase()); });
        }).length;
        perLLM[llm] = Math.round(hits / responses.length * 100) + '%';
      });
      var rates = llms.map(function(l) { return perLLM[l]; }).filter(function(r) { return r !== '—'; });
      var avg = rates.length ? Math.round(rates.reduce(function(s, r) { return s + parseInt(r); }, 0) / rates.length) + '%' : '—';
      rows.push([date, brands.join('; '), entry.treatment || '', entry.city || ''].concat(llms.map(function(l) { return perLLM[l]; })).concat([avg]));
    });
    return rows.map(function(r) { return r.map(function(cell) { return '"' + String(cell).replace(/"/g, '""') + '"'; }).join(','); }).join('\n');
  },

  exportCSV: function() {
    var history = ApiService.getHistory();
    if (!history.length) { App.toast('Geen data om te exporteren', 'error'); return; }
    this._download('llm-tracker-export.csv', this._buildCSV(history));
    App.toast('CSV wordt gedownload', 'success');
  },

  exportCSVForMonth: function(key) {
    var months = this._groupByMonth(ApiService.getHistory());
    var entries = months[key] || [];
    if (!entries.length) { App.toast('Geen data voor deze periode', 'error'); return; }
    var label = this._monthLabel(key);
    this._download('llm-tracker-' + key + '.csv', this._buildCSV(entries));
    App.toast('CSV voor ' + label + ' wordt gedownload', 'success');
  },

  _download: function(filename, csv) {
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function() { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
  }
};
