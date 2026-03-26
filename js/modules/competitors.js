App.registerModule('competitors', {
  label: 'Competitors',
  icon: 'users',
  render: function() {
    return `
<div class="page-header">
  <div class="page-header-left">
    <h1>Competitors</h1>
    <p>Vergelijk jouw brand performance met concurrenten</p>
  </div>
  <div class="page-header-actions">
    <button class="btn-ghost" id="comp-add-btn">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      Concurrent toevoegen
    </button>
  </div>
</div>

<div class="stat-grid">
  <div class="stat-card">
    <div class="stat-label">Gevolgde concurrenten</div>
    <div class="stat-value" id="comp-count">—</div>
    <div class="stat-delta delta-neutral">Inclusief jezelf</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Jouw rank</div>
    <div class="stat-value" id="comp-rank">—</div>
    <div class="stat-delta delta-neutral" id="comp-rank-sub">Op basis van testdata</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Top concurrent</div>
    <div class="stat-value" style="font-size:18px;" id="comp-top">—</div>
    <div class="stat-delta delta-neutral" id="comp-top-rate">Nog geen data</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Gap to #1</div>
    <div class="stat-value" id="comp-gap">—</div>
    <div class="stat-delta delta-neutral">Verschil in mention rate</div>
  </div>
</div>

<div class="inline-form" id="comp-add-form" style="display:none;">
  <div class="form-grid2">
    <div class="field" style="margin-bottom:0;">
      <label for="comp-name">Naam concurrent</label>
      <input type="text" id="comp-name" placeholder="bijv. Kliniek ABC" />
    </div>
    <div class="field" style="margin-bottom:0;">
      <label for="comp-website">Website (optioneel)</label>
      <input type="text" id="comp-website" placeholder="bijv. kliniiekabc.nl" />
    </div>
  </div>
  <div style="display:flex; gap:8px; margin-top:12px;">
    <button class="btn btn-sm" id="comp-save-btn">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 20 4 15"/></svg>
      Opslaan
    </button>
    <button class="btn-ghost btn-sm" id="comp-cancel-btn">Annuleren</button>
  </div>
</div>

<div class="table-card">
  <table class="data-table">
    <thead id="comp-thead">
      <tr><th>Rang</th><th>Naam</th><th>Score</th><th>Actie</th></tr>
    </thead>
    <tbody id="comp-tbody"></tbody>
  </table>
</div>

<div class="grid3" id="comp-llm-cards" style="display:none;"></div>
    `;
  },
  init: function() {
    var addBtn = document.getElementById('comp-add-btn');
    var addForm = document.getElementById('comp-add-form');
    var cancelBtn = document.getElementById('comp-cancel-btn');
    var saveBtn = document.getElementById('comp-save-btn');

    if (addBtn && addForm) addBtn.addEventListener('click', function() {
      addForm.style.display = addForm.style.display === 'none' ? 'block' : 'none';
    });
    if (cancelBtn && addForm) cancelBtn.addEventListener('click', function() { addForm.style.display = 'none'; });
    if (saveBtn) saveBtn.addEventListener('click', function() { CompetitorsModule.addCompetitor(); });

    CompetitorsModule.renderTable();
  }
});

window.CompetitorsModule = {
  STORAGE_KEY: 'llm_tracker_competitors',

  _getCompetitors: function() {
    var stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) try { return JSON.parse(stored); } catch(e) {}
    var defaults = [
      { id: 1, name: 'Kliniek XYZ', website: '', isMe: false },
      { id: 2, name: 'Skinlab', website: '', isMe: true },
    ];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaults));
    return defaults;
  },

  _saveCompetitors: function(comps) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(comps));
  },

  _computeScores: function(name) {
    var history = ApiService.getHistory();
    var llmMap = {};
    history.forEach(function(entry) {
      var brands = entry.brands || [];
      if (!brands.some(function(b) { return b.toLowerCase() === name.toLowerCase(); })) return;
      Object.keys(entry.results || {}).forEach(function(llm) {
        var responses = Object.values(entry.results[llm]);
        if (!llmMap[llm]) llmMap[llm] = { total: 0, hits: 0 };
        responses.forEach(function(r) {
          llmMap[llm].total++;
          if (r && r.toLowerCase().includes(name.toLowerCase())) llmMap[llm].hits++;
        });
      });
    });
    var perLLM = {};
    Object.keys(llmMap).forEach(function(llm) {
      var v = llmMap[llm];
      perLLM[llm] = v.total ? Math.round(v.hits / v.total * 100) : 0;
    });
    var rates = Object.values(perLLM);
    var avg = rates.length ? Math.round(rates.reduce(function(s, r) { return s + r; }, 0) / rates.length) : null;
    return { perLLM: perLLM, avg: avg };
  },

  renderTable: function() {
    var tbody = document.getElementById('comp-tbody');
    var thead = document.getElementById('comp-thead');
    if (!tbody) return;

    var comps = this._getCompetitors();
    var history = ApiService.getHistory();
    var llms = [];
    history.forEach(function(e) { Object.keys(e.results || {}).forEach(function(llm) { if (!llms.includes(llm)) llms.push(llm); }); });

    var rows = comps.map(function(c) {
      return { comp: c, scores: CompetitorsModule._computeScores(c.name) };
    }).sort(function(a, b) {
      if (a.scores.avg === null && b.scores.avg === null) return 0;
      if (a.scores.avg === null) return 1;
      if (b.scores.avg === null) return -1;
      return b.scores.avg - a.scores.avg;
    });

    if (thead) {
      thead.innerHTML = '<tr><th>Rang</th><th>Naam</th>'
        + llms.map(function(l) { return '<th>' + ApiService.escapeHtml(l) + '</th>'; }).join('')
        + '<th>Score</th><th>Actie</th></tr>';
    }

    tbody.innerHTML = rows.map(function(row, i) {
      var c = row.comp;
      var s = row.scores;
      var avg = s.avg !== null ? s.avg + '%' : '—';
      var avgCls = s.avg !== null ? (s.avg >= 75 ? 'green' : s.avg < 30 ? 'red' : '') : '';
      return '<tr' + (c.isMe ? ' style="background:var(--primary-light);"' : '') + '>'
        + '<td style="text-align:center;"><strong>#' + (i + 1) + '</strong></td>'
        + '<td><strong>' + ApiService.escapeHtml(c.name) + '</strong>' + (c.isMe ? ' <span class="badge badge-green">Jij</span>' : '') + '</td>'
        + llms.map(function(llm) {
          var r = s.perLLM[llm];
          if (r === undefined) return '<td style="text-align:center;">—</td>';
          return '<td style="text-align:center;" class="' + (r >= 75 ? 'green' : r < 30 ? 'red' : '') + '">' + r + '%</td>';
        }).join('')
        + '<td style="text-align:center;" class="' + avgCls + '"><strong>' + avg + '</strong></td>'
        + '<td style="text-align:center;"><button class="btn-ghost btn-sm"'
        + (c.isMe ? ' disabled' : ' onclick="CompetitorsModule.deleteCompetitor(' + c.id + ')"') + '>Verwijderen</button></td>'
        + '</tr>';
    }).join('') || '<tr><td colspan="' + (llms.length + 4) + '" style="text-align:center; color:var(--text-3); padding:20px;">Geen concurrenten. Voeg er een toe.</td></tr>';

    // Stats
    document.getElementById('comp-count').textContent = comps.length;
    var meIdx = rows.findIndex(function(r) { return r.comp.isMe; });
    document.getElementById('comp-rank').textContent = meIdx >= 0 ? '#' + (meIdx + 1) : '—';
    var top = rows[0];
    document.getElementById('comp-top').textContent = top ? top.comp.name : '—';
    document.getElementById('comp-top-rate').textContent = top && top.scores.avg !== null ? top.scores.avg + '% mention rate' : 'Nog geen data';
    var meRow = meIdx >= 0 ? rows[meIdx] : null;
    var gap = (meRow && top && meIdx > 0 && meRow.scores.avg !== null && top.scores.avg !== null)
      ? (top.scores.avg - meRow.scores.avg) + 'pp' : (meIdx === 0 ? 'Je bent #1' : '—');
    document.getElementById('comp-gap').textContent = gap;

    // Per-LLM cards
    var cardsEl = document.getElementById('comp-llm-cards');
    if (cardsEl) {
      if (!llms.length) { cardsEl.style.display = 'none'; }
      else {
        cardsEl.style.display = '';
        var llmColors = { Claude: '', ChatGPT: 'prog-fill-blue', Gemini: 'prog-fill-orange' };
        cardsEl.innerHTML = llms.map(function(llm) {
          var sorted = rows.filter(function(r) { return r.scores.perLLM[llm] !== undefined; })
            .sort(function(a, b) { return b.scores.perLLM[b.comp.name in b.scores.perLLM ? llm : ''] - a.scores.perLLM[llm]; });
          var top3 = rows.filter(function(r) { return r.scores.perLLM[llm] !== undefined; })
            .sort(function(a, b) { return b.scores.perLLM[llm] - a.scores.perLLM[llm]; }).slice(0, 3);
          var cls = llmColors[llm] || '';
          return '<div class="card"><div class="card-title">' + ApiService.escapeHtml(llm) + '</div>'
            + '<div class="card-sub">Top ' + top3.length + ' concurrenten</div>'
            + '<div style="margin-top:16px;">'
            + top3.map(function(r) {
              var rate = r.scores.perLLM[llm];
              return '<div class="prog-row"><div class="prog-label"><span>' + ApiService.escapeHtml(r.comp.name) + '</span><span>' + rate + '%</span></div>'
                + '<div class="prog-track"><div class="prog-fill ' + cls + '" style="width:' + rate + '%;"></div></div></div>';
            }).join('')
            + '</div></div>';
        }).join('');
      }
    }
  },

  addCompetitor: function() {
    var nameEl = document.getElementById('comp-name');
    var websiteEl = document.getElementById('comp-website');
    if (!nameEl || !nameEl.value.trim()) { App.toast('Voer een naam in', 'error'); return; }
    var comps = this._getCompetitors();
    comps.push({ id: Date.now(), name: nameEl.value.trim(), website: websiteEl ? websiteEl.value.trim() : '', isMe: false });
    this._saveCompetitors(comps);
    nameEl.value = '';
    if (websiteEl) websiteEl.value = '';
    document.getElementById('comp-add-form').style.display = 'none';
    this.renderTable();
    App.toast('Concurrent toegevoegd', 'success');
  },

  deleteCompetitor: function(id) {
    var comps = this._getCompetitors().filter(function(c) { return c.id !== id; });
    this._saveCompetitors(comps);
    this.renderTable();
    App.toast('Concurrent verwijderd', 'success');
  }
};
