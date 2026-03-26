App.registerModule('keywords', {
  label: 'Keywords',
  icon: 'search',
  render: function() {
    return `
<div class="page-header">
  <div class="page-header-left">
    <h1>Keywords</h1>
    <p>Beheer en analyseer zoekwoorden voor je brand tracking</p>
  </div>
  <div class="page-header-actions">
    <div class="filter-chips" style="margin-bottom:0;">
      <button class="filter-chip active" data-lang="all">Alle</button>
      <button class="filter-chip" data-lang="nl">NL</button>
      <button class="filter-chip" data-lang="en">EN</button>
    </div>
    <button class="btn-ghost" id="kw-add-btn">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      Keyword toevoegen
    </button>
  </div>
</div>

<div class="inline-form" id="kw-add-form" style="display:none;">
  <div class="form-grid2">
    <div class="field" style="margin-bottom:0;">
      <label for="kw-input">Keyword / behandeling</label>
      <input type="text" id="kw-input" placeholder="bijv. huidverzorging Amsterdam" />
    </div>
    <div class="field" style="margin-bottom:0;">
      <label for="kw-lang">Taal</label>
      <select id="kw-lang">
        <option value="nl">Nederlands</option>
        <option value="en">Engels</option>
      </select>
    </div>
  </div>
  <div style="display:flex; gap:8px; margin-top:12px;">
    <button class="btn btn-sm" id="kw-save-btn">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 20 4 15"/></svg>
      Opslaan
    </button>
    <button class="btn-ghost btn-sm" id="kw-cancel-btn">Annuleren</button>
  </div>
</div>

<div class="grid2">
  <div class="card">
    <div class="card-title">Top keywords</div>
    <div class="card-sub">Hoogste mention rate uit testdata</div>
    <div class="kw-grid" id="kw-top-grid"></div>
  </div>
  <div class="card">
    <div class="card-title">Onderpresteert</div>
    <div class="card-sub">Keywords met lage mention rate</div>
    <div class="kw-grid" id="kw-low-grid"></div>
  </div>
</div>

<div class="table-card">
  <table class="data-table">
    <thead id="kw-thead">
      <tr><th>Keyword</th><th>Taal</th><th>Gem. rate</th><th>Acties</th></tr>
    </thead>
    <tbody id="kw-tbody"></tbody>
  </table>
</div>
    `;
  },
  init: function() {
    var self = this;
    var addBtn = document.getElementById('kw-add-btn');
    var addForm = document.getElementById('kw-add-form');
    var cancelBtn = document.getElementById('kw-cancel-btn');
    var saveBtn = document.getElementById('kw-save-btn');

    if (addBtn && addForm) addBtn.addEventListener('click', function() {
      addForm.style.display = addForm.style.display === 'none' ? 'block' : 'none';
    });
    if (cancelBtn && addForm) cancelBtn.addEventListener('click', function() { addForm.style.display = 'none'; });
    if (saveBtn) saveBtn.addEventListener('click', function() { KeywordsModule.addKeyword(); });

    document.querySelectorAll('.filter-chip[data-lang]').forEach(function(chip) {
      chip.addEventListener('click', function() {
        document.querySelectorAll('.filter-chip[data-lang]').forEach(function(c) { c.classList.remove('active'); });
        chip.classList.add('active');
        KeywordsModule.renderTable(chip.dataset.lang);
      });
    });

    KeywordsModule.renderTable('all');
    KeywordsModule.renderTopChips();
  }
});

window.KeywordsModule = {
  STORAGE_KEY: 'llm_tracker_keywords',

  _getKeywords: function() {
    var stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) try { return JSON.parse(stored); } catch(e) {}
    var defaults = [
      { id: 1,  keyword: 'huidverjonging Amsterdam', lang: 'nl' },
      { id: 2,  keyword: 'botox kliniek',            lang: 'nl' },
      { id: 3,  keyword: 'cosmetische kliniek',      lang: 'nl' },
      { id: 4,  keyword: 'filler behandeling',       lang: 'nl' },
      { id: 5,  keyword: 'laser huidbehandeling',    lang: 'nl' },
      { id: 6,  keyword: 'skin clinic Amsterdam',    lang: 'en' },
      { id: 7,  keyword: 'huidverzorging specialist', lang: 'nl' },
      { id: 8,  keyword: 'beste kliniek Rotterdam',  lang: 'nl' },
      { id: 9,  keyword: 'goedkope botox',           lang: 'nl' },
      { id: 10, keyword: 'cosmetic clinic',          lang: 'en' },
    ];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaults));
    return defaults;
  },

  _saveKeywords: function(kws) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(kws));
  },

  // Compute mention rate for a keyword by matching entry.treatment to the keyword
  _computeRate: function(keyword) {
    var history = ApiService.getHistory();
    var llmMap = {};
    history.forEach(function(entry) {
      if (!entry.treatment || entry.treatment.toLowerCase() !== keyword.toLowerCase()) return;
      Object.keys(entry.results || {}).forEach(function(llm) {
        var brands = entry.brands || [];
        var responses = Object.values(entry.results[llm]);
        if (!llmMap[llm]) llmMap[llm] = { total: 0, hits: 0 };
        responses.forEach(function(r) {
          llmMap[llm].total++;
          if (r && brands.some(function(b) { return r.toLowerCase().includes(b.toLowerCase()); })) {
            llmMap[llm].hits++;
          }
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

  renderTopChips: function() {
    var kws = this._getKeywords();
    var withRates = kws.map(function(kw) {
      var r = KeywordsModule._computeRate(kw.keyword);
      return { kw: kw, avg: r.avg };
    }).filter(function(x) { return x.avg !== null; }).sort(function(a, b) { return b.avg - a.avg; });

    var topGrid = document.getElementById('kw-top-grid');
    var lowGrid = document.getElementById('kw-low-grid');

    var top = withRates.filter(function(x) { return x.avg >= 50; }).slice(0, 8);
    var low = withRates.filter(function(x) { return x.avg < 50; }).slice(0, 5);

    if (topGrid) {
      topGrid.innerHTML = top.length ? top.map(function(x) {
        return '<div class="kw-chip"><span>' + ApiService.escapeHtml(x.kw.keyword) + '</span><span class="kw-count">' + x.avg + '%</span></div>';
      }).join('') : '<div style="font-size:13px; color:var(--text-3);">Nog geen testdata voor keywords</div>';
    }
    if (lowGrid) {
      lowGrid.innerHTML = low.length ? low.map(function(x) {
        return '<div class="kw-chip warn"><span>' + ApiService.escapeHtml(x.kw.keyword) + '</span><span class="kw-count">' + x.avg + '%</span></div>';
      }).join('') : '<div style="font-size:13px; color:var(--text-3);">Geen onderpresteerende keywords</div>';
    }
  },

  renderTable: function(langFilter) {
    var tbody = document.getElementById('kw-tbody');
    var thead = document.getElementById('kw-thead');
    if (!tbody) return;

    var kws = this._getKeywords();
    if (langFilter && langFilter !== 'all') {
      kws = kws.filter(function(kw) { return kw.lang === langFilter; });
    }

    var history = ApiService.getHistory();
    var llms = [];
    history.forEach(function(e) { Object.keys(e.results || {}).forEach(function(llm) { if (!llms.includes(llm)) llms.push(llm); }); });

    if (thead) {
      thead.innerHTML = '<tr><th>Keyword</th><th>Taal</th>'
        + llms.map(function(l) { return '<th>' + ApiService.escapeHtml(l) + '</th>'; }).join('')
        + '<th>Gem. rate</th><th>Acties</th></tr>';
    }

    var deleteIcon = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>';

    tbody.innerHTML = kws.length ? kws.map(function(kw) {
      var rates = KeywordsModule._computeRate(kw.keyword);
      var avg = rates.avg !== null ? rates.avg + '%' : '—';
      var avgCls = rates.avg !== null ? (rates.avg >= 75 ? 'green' : rates.avg < 30 ? 'red' : '') : '';
      return '<tr>'
        + '<td><strong>' + ApiService.escapeHtml(kw.keyword) + '</strong></td>'
        + '<td><span class="badge ' + (kw.lang === 'nl' ? 'badge-blue' : 'badge-gray') + '">' + kw.lang.toUpperCase() + '</span></td>'
        + llms.map(function(llm) {
          var r = rates.perLLM[llm];
          if (r === undefined) return '<td>—</td>';
          return '<td class="' + (r >= 75 ? 'green' : r < 30 ? 'red' : '') + '">' + r + '%</td>';
        }).join('')
        + '<td class="' + avgCls + '"><strong>' + avg + '</strong></td>'
        + '<td><button class="btn-danger btn-sm" onclick="KeywordsModule.deleteKeyword(' + kw.id + ')">' + deleteIcon + '</button></td>'
        + '</tr>';
    }).join('') : '<tr><td colspan="' + (llms.length + 4) + '" style="text-align:center; color:var(--text-3); padding:20px;">Geen keywords</td></tr>';
  },

  addKeyword: function() {
    var inp = document.getElementById('kw-input');
    var lang = document.getElementById('kw-lang');
    if (!inp || !inp.value.trim()) { App.toast('Voer een keyword in', 'error'); return; }
    var kws = this._getKeywords();
    kws.push({ id: Date.now(), keyword: inp.value.trim(), lang: lang ? lang.value : 'nl' });
    this._saveKeywords(kws);
    inp.value = '';
    document.getElementById('kw-add-form').style.display = 'none';
    var active = document.querySelector('.filter-chip[data-lang].active');
    this.renderTable(active ? active.dataset.lang : 'all');
    this.renderTopChips();
    App.toast('Keyword toegevoegd', 'success');
  },

  deleteKeyword: function(id) {
    var kws = this._getKeywords().filter(function(kw) { return kw.id !== id; });
    this._saveKeywords(kws);
    var active = document.querySelector('.filter-chip[data-lang].active');
    this.renderTable(active ? active.dataset.lang : 'all');
    this.renderTopChips();
    App.toast('Keyword verwijderd', 'success');
  }
};
