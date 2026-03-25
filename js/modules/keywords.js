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
      <button class="filter-chip" data-lang="all">Alle</button>
      <button class="filter-chip active" data-lang="nl">NL</button>
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
      <label for="kw-input">Keyword</label>
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
    <div class="card-sub">Hoogste mention rate</div>
    <div class="kw-grid">
      <div class="kw-chip"><span>huidverjonging Amsterdam</span><span class="kw-count">84%</span></div>
      <div class="kw-chip"><span>botox kliniek</span><span class="kw-count">79%</span></div>
      <div class="kw-chip"><span>cosmetische kliniek</span><span class="kw-count">76%</span></div>
      <div class="kw-chip"><span>filler behandeling</span><span class="kw-count">71%</span></div>
      <div class="kw-chip"><span>laser huidbehandeling</span><span class="kw-count">68%</span></div>
      <div class="kw-chip"><span>skin clinic Amsterdam</span><span class="kw-count">65%</span></div>
      <div class="kw-chip"><span>huidverzorging specialist</span><span class="kw-count">62%</span></div>
      <div class="kw-chip"><span>anti-aging behandeling</span><span class="kw-count">59%</span></div>
      <div class="kw-chip"><span>dermatologie kliniek</span><span class="kw-count">54%</span></div>
      <div class="kw-chip"><span>schoonheidsbehandeling</span><span class="kw-count">51%</span></div>
    </div>
  </div>
  <div class="card">
    <div class="card-title">Onderpresteert</div>
    <div class="card-sub">Keywords met lage mention rate</div>
    <div class="kw-grid">
      <div class="kw-chip warn"><span>goedkope botox</span><span class="kw-count">12%</span></div>
      <div class="kw-chip warn"><span>beste kliniek Rotterdam</span><span class="kw-count">18%</span></div>
      <div class="kw-chip warn"><span>skin booster Nederland</span><span class="kw-count">22%</span></div>
      <div class="kw-chip warn"><span>chemical peel behandeling</span><span class="kw-count">25%</span></div>
      <div class="kw-chip warn"><span>microneedling Amsterdam</span><span class="kw-count">27%</span></div>
    </div>
  </div>
</div>

<div class="table-card">
  <table class="data-table" id="kw-table">
    <thead>
      <tr>
        <th>Keyword</th>
        <th>Taal</th>
        <th>Claude</th>
        <th>ChatGPT</th>
        <th>Gemini</th>
        <th>Gem. rate</th>
        <th>Acties</th>
      </tr>
    </thead>
    <tbody>
      <tr data-kw-row>
        <td><strong>huidverjonging Amsterdam</strong></td>
        <td><span class="badge badge-blue">NL</span></td>
        <td class="green">88%</td>
        <td class="green">82%</td>
        <td class="green">81%</td>
        <td class="green"><strong>84%</strong></td>
        <td>
          <button class="btn-danger btn-sm" data-kw-delete>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </td>
      </tr>
      <tr data-kw-row>
        <td><strong>botox kliniek</strong></td>
        <td><span class="badge badge-blue">NL</span></td>
        <td class="green">81%</td>
        <td class="green">79%</td>
        <td class="green">76%</td>
        <td class="green"><strong>79%</strong></td>
        <td>
          <button class="btn-danger btn-sm" data-kw-delete>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </td>
      </tr>
      <tr data-kw-row>
        <td><strong>cosmetische kliniek</strong></td>
        <td><span class="badge badge-blue">NL</span></td>
        <td class="green">78%</td>
        <td class="green">75%</td>
        <td class="green">74%</td>
        <td class="green"><strong>76%</strong></td>
        <td>
          <button class="btn-danger btn-sm" data-kw-delete>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </td>
      </tr>
      <tr data-kw-row>
        <td><strong>skin clinic Amsterdam</strong></td>
        <td><span class="badge badge-gray">EN</span></td>
        <td class="green">68%</td>
        <td class="green">64%</td>
        <td>62%</td>
        <td><strong>65%</strong></td>
        <td>
          <button class="btn-danger btn-sm" data-kw-delete>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </td>
      </tr>
      <tr data-kw-row>
        <td><strong>laser huidbehandeling</strong></td>
        <td><span class="badge badge-blue">NL</span></td>
        <td class="green">70%</td>
        <td>65%</td>
        <td>58%</td>
        <td><strong>64%</strong></td>
        <td>
          <button class="btn-danger btn-sm" data-kw-delete>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </td>
      </tr>
      <tr data-kw-row>
        <td><strong>beste kliniek Rotterdam</strong></td>
        <td><span class="badge badge-blue">NL</span></td>
        <td>22%</td>
        <td>18%</td>
        <td class="red">14%</td>
        <td class="red"><strong>18%</strong></td>
        <td>
          <button class="btn-danger btn-sm" data-kw-delete>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </td>
      </tr>
      <tr data-kw-row>
        <td><strong>goedkope botox</strong></td>
        <td><span class="badge badge-blue">NL</span></td>
        <td>15%</td>
        <td>11%</td>
        <td class="red">9%</td>
        <td class="red"><strong>12%</strong></td>
        <td>
          <button class="btn-danger btn-sm" data-kw-delete>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </td>
      </tr>
      <tr data-kw-row>
        <td><strong>cosmetic clinic</strong></td>
        <td><span class="badge badge-gray">EN</span></td>
        <td>55%</td>
        <td>48%</td>
        <td>44%</td>
        <td><strong>49%</strong></td>
        <td>
          <button class="btn-danger btn-sm" data-kw-delete>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
    `;
  },
  init: function() {
    // Language filter chips
    document.querySelectorAll('.filter-chip[data-lang]').forEach(function(chip) {
      chip.addEventListener('click', function() {
        document.querySelectorAll('.filter-chip[data-lang]').forEach(function(c) { c.classList.remove('active'); });
        chip.classList.add('active');
      });
    });

    // Add form toggle
    var addBtn = document.getElementById('kw-add-btn');
    var addForm = document.getElementById('kw-add-form');
    if (addBtn && addForm) {
      addBtn.addEventListener('click', function() {
        addForm.style.display = addForm.style.display === 'none' ? 'block' : 'none';
      });
    }

    var cancelBtn = document.getElementById('kw-cancel-btn');
    if (cancelBtn && addForm) {
      cancelBtn.addEventListener('click', function() { addForm.style.display = 'none'; });
    }

    var saveBtn = document.getElementById('kw-save-btn');
    if (saveBtn && addForm) {
      saveBtn.addEventListener('click', function() {
        var inp = document.getElementById('kw-input');
        if (inp && inp.value.trim()) {
          App.toast('Keyword "' + inp.value.trim() + '" toegevoegd', 'success');
          addForm.style.display = 'none';
          inp.value = '';
        } else {
          App.toast('Voer een keyword in', 'error');
        }
      });
    }

    // Delete buttons
    document.querySelectorAll('[data-kw-delete]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var row = btn.closest('tr');
        if (row) {
          row.style.transition = 'opacity 0.25s';
          row.style.opacity = '0';
          setTimeout(function() {
            if (row.parentNode) row.parentNode.removeChild(row);
          }, 250);
          App.toast('Keyword verwijderd', 'success');
        }
      });
    });
  }
});
