App.registerModule('analytics', {
  label: 'Analytics',
  icon: 'barChart',

  _computeStats: function(history) {
    var brandMap = {};
    var llmMap = {};

    history.forEach(function(entry) {
      var brands = entry.brands || [];
      Object.keys(entry.results || {}).forEach(function(llm) {
        var responses = Object.values(entry.results[llm]);
        responses.forEach(function(r) {
          if (!llmMap[llm]) llmMap[llm] = { total: 0, hits: 0 };
          llmMap[llm].total++;
          brands.forEach(function(brand) {
            if (!brandMap[brand]) brandMap[brand] = { total: 0, hits: 0, perLLM: {} };
            if (!brandMap[brand].perLLM[llm]) brandMap[brand].perLLM[llm] = { total: 0, hits: 0 };
            brandMap[brand].total++;
            brandMap[brand].perLLM[llm].total++;
            if (r && r.toLowerCase().includes(brand.toLowerCase())) {
              brandMap[brand].hits++;
              brandMap[brand].perLLM[llm].hits++;
              llmMap[llm].hits++;
            }
          });
        });
      });
    });

    var totalHits = Object.values(llmMap).reduce(function(s, v) { return s + v.hits; }, 0);
    var totalResp = Object.values(llmMap).reduce(function(s, v) { return s + v.total; }, 0);
    var avgRate = totalResp ? Math.round(totalHits / totalResp * 100) : 0;

    var llms = Object.keys(llmMap).map(function(llm) {
      var v = llmMap[llm];
      return { name: llm, rate: v.total ? Math.round(v.hits / v.total * 100) : 0 };
    }).sort(function(a, b) { return b.rate - a.rate; });

    var brands = Object.keys(brandMap).map(function(brand) {
      var v = brandMap[brand];
      var perLLM = {};
      Object.keys(v.perLLM).forEach(function(llm) {
        var lv = v.perLLM[llm];
        perLLM[llm] = lv.total ? Math.round(lv.hits / lv.total * 100) : 0;
      });
      return { name: brand, rate: v.total ? Math.round(v.hits / v.total * 100) : 0, perLLM: perLLM };
    }).sort(function(a, b) { return b.rate - a.rate; });

    return { totalHits: totalHits, avgRate: avgRate, runs: history.length, llms: llms, brands: brands };
  },

  _filterHistory: function(days) {
    var history = ApiService.getHistory();
    if (!days) return history;
    var cutoff = Date.now() - days * 86400000;
    return history.filter(function(e) { return new Date(e.timestamp).getTime() >= cutoff; });
  },

  _renderStats: function(days) {
    var history = this._filterHistory(days);
    var stats = this._computeStats(history);

    document.getElementById('an-total').textContent = stats.totalHits;
    document.getElementById('an-rate').textContent = stats.avgRate + '%';
    document.getElementById('an-runs').textContent = stats.runs;

    var bestLLM = stats.llms[0];
    document.getElementById('an-best-llm').textContent = bestLLM ? bestLLM.name : '—';
    document.getElementById('an-best-llm-sub').textContent = bestLLM ? bestLLM.rate + '% mention rate' : 'Nog geen data';

    var llmColors = { Claude: '', ChatGPT: 'prog-fill-blue', Gemini: 'prog-fill-orange' };
    var llmHtml = stats.llms.length ? stats.llms.map(function(l) {
      return '<div class="prog-row"><div class="prog-label"><span>' + ApiService.escapeHtml(l.name) + '</span><span>' + l.rate + '%</span></div>'
        + '<div class="prog-track"><div class="prog-fill ' + (llmColors[l.name] || '') + '" style="width:' + l.rate + '%;"></div></div></div>';
    }).join('') : '<div style="font-size:13px; color:var(--text-3); margin-top:12px;">Nog geen data</div>';
    document.getElementById('an-llm-bars').innerHTML = llmHtml;

    var llmNames = stats.llms.map(function(l) { return l.name; });
    document.getElementById('an-thead').innerHTML = '<tr><th>Brand</th>'
      + llmNames.map(function(n) { return '<th>' + ApiService.escapeHtml(n) + '</th>'; }).join('')
      + '<th>Gem. score</th></tr>';

    document.getElementById('an-tbody').innerHTML = stats.brands.length ? stats.brands.map(function(b) {
      var cls = b.rate >= 75 ? 'green' : b.rate < 30 ? 'red' : '';
      return '<tr><td><strong>' + ApiService.escapeHtml(b.name) + '</strong></td>'
        + llmNames.map(function(llm) {
          var r = b.perLLM[llm];
          if (r === undefined) return '<td>—</td>';
          return '<td class="' + (r >= 75 ? 'green' : r < 30 ? 'red' : '') + '">' + r + '%</td>';
        }).join('')
        + '<td class="' + cls + '"><strong>' + b.rate + '%</strong></td></tr>';
    }).join('') : '<tr><td colspan="' + (llmNames.length + 2) + '" style="text-align:center; color:var(--text-3); padding:20px;">Voer een test uit om data te zien</td></tr>';

    this._renderBarChart(history);
  },

  _renderBarChart: function(history) {
    var container = document.getElementById('an-bar-chart');
    var labelsEl = document.getElementById('an-bar-labels');
    if (!container) return;
    if (!history.length) {
      container.innerHTML = '<div style="font-size:13px; color:var(--text-3); text-align:center; padding:20px 0;">Nog geen data</div>';
      if (labelsEl) labelsEl.innerHTML = '';
      return;
    }
    var monthMap = {};
    history.forEach(function(e) {
      var d = new Date(e.timestamp);
      var key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
      monthMap[key] = (monthMap[key] || 0) + 1;
    });
    var keys = Object.keys(monthMap).sort().slice(-12);
    var max = Math.max.apply(null, keys.map(function(k) { return monthMap[k]; }));
    container.innerHTML = keys.map(function(k) {
      var h = max > 0 ? Math.max(4, Math.round((monthMap[k] / max) * 52)) : 4;
      return '<div class="bar" style="height:' + h + 'px;" title="' + monthMap[k] + ' runs"></div>';
    }).join('');
    if (labelsEl) {
      var months = ['Jan','Feb','Mrt','Apr','Mei','Jun','Jul','Aug','Sep','Okt','Nov','Dec'];
      labelsEl.innerHTML = keys.map(function(k) {
        return '<span>' + months[parseInt(k.split('-')[1]) - 1] + '</span>';
      }).join('');
    }
  },

  render: function() {
    return `
<div class="page-header">
  <div class="page-header-left">
    <h1>Analytics</h1>
    <p>Overzicht van brand mention performance over tijd</p>
  </div>
  <div class="page-header-actions">
    <div class="filter-chips" style="margin-bottom:0;">
      <button class="filter-chip" data-period="7">7 dagen</button>
      <button class="filter-chip active" data-period="30">30 dagen</button>
      <button class="filter-chip" data-period="90">90 dagen</button>
      <button class="filter-chip" data-period="0">Alles</button>
    </div>
  </div>
</div>

<div class="stat-grid">
  <div class="stat-card">
    <div class="stat-label">Totaal mentions</div>
    <div class="stat-value" id="an-total">—</div>
    <div class="stat-delta delta-neutral">Uit alle LLM responses</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Gem. mention rate</div>
    <div class="stat-value" id="an-rate">—</div>
    <div class="stat-delta delta-neutral">Over alle brands en LLMs</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Beste LLM</div>
    <div class="stat-value" style="font-size:20px;" id="an-best-llm">—</div>
    <div class="stat-delta delta-neutral" id="an-best-llm-sub">Nog geen data</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Runs</div>
    <div class="stat-value" id="an-runs">—</div>
    <div class="stat-delta delta-neutral">Uitgevoerde tests</div>
  </div>
</div>

<div class="grid2">
  <div class="card">
    <div class="card-title">Mention rate per LLM</div>
    <div class="card-sub">Gemiddeld over alle brands</div>
    <div style="margin-top:18px;" id="an-llm-bars"></div>
  </div>
  <div class="card">
    <div class="card-title">Runs over tijd</div>
    <div class="card-sub">Aantal tests per maand</div>
    <div style="margin-top:18px;">
      <div class="bar-chart" id="an-bar-chart"></div>
      <div class="bar-labels" id="an-bar-labels"></div>
    </div>
  </div>
</div>

<div class="table-card">
  <table class="data-table">
    <thead id="an-thead"><tr><th>Brand</th><th>Gem. score</th></tr></thead>
    <tbody id="an-tbody"></tbody>
  </table>
</div>
    `;
  },

  init: function() {
    var self = this;
    document.querySelectorAll('.filter-chip[data-period]').forEach(function(chip) {
      chip.addEventListener('click', function() {
        document.querySelectorAll('.filter-chip[data-period]').forEach(function(c) { c.classList.remove('active'); });
        chip.classList.add('active');
        self._renderStats(parseInt(chip.dataset.period));
      });
    });
    self._renderStats(30);
  }
});
