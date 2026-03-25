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
    <div class="stat-value">6</div>
    <div class="stat-delta delta-neutral">Inclusief jezelf</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Jouw rank</div>
    <div class="stat-value">#2</div>
    <div class="stat-delta delta-up">&#8593; +1 positie vs vorige maand</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Top concurrent</div>
    <div class="stat-value" style="font-size:18px;">Kliniek XYZ</div>
    <div class="stat-delta delta-neutral">82% mention rate</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Gap to #1</div>
    <div class="stat-value" style="color:var(--green);">-4pp</div>
    <div class="stat-delta delta-up">&#8593; Verbeterd</div>
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
    <thead>
      <tr>
        <th>Rang</th>
        <th>Naam</th>
        <th>Claude</th>
        <th>ChatGPT</th>
        <th>Gemini</th>
        <th>Score</th>
        <th>Actie</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="text-align:center;"><strong>#1</strong></td>
        <td><strong>Kliniek XYZ</strong></td>
        <td style="text-align:center;" class="green">85%</td>
        <td style="text-align:center;" class="green">81%</td>
        <td style="text-align:center;" class="green">80%</td>
        <td style="text-align:center;"><strong>82%</strong></td>
        <td style="text-align:center;"><button class="btn-ghost btn-sm">Verwijderen</button></td>
      </tr>
      <tr style="background:var(--primary-light);">
        <td style="text-align:center;"><strong>#2</strong></td>
        <td><strong>Skinlab</strong> <span class="badge badge-green">Jij</span></td>
        <td style="text-align:center;" class="green">82%</td>
        <td style="text-align:center;" class="green">74%</td>
        <td style="text-align:center;" class="green">68%</td>
        <td style="text-align:center;"><strong>75%</strong></td>
        <td style="text-align:center;"><button class="btn-ghost btn-sm" disabled>Verwijderen</button></td>
      </tr>
      <tr>
        <td style="text-align:center;"><strong>#3</strong></td>
        <td><strong>Glow Clinic</strong></td>
        <td style="text-align:center;" class="green">71%</td>
        <td style="text-align:center;">55%</td>
        <td style="text-align:center;">49%</td>
        <td style="text-align:center;"><strong>58%</strong></td>
        <td style="text-align:center;"><button class="btn-ghost btn-sm">Verwijderen</button></td>
      </tr>
      <tr>
        <td style="text-align:center;"><strong>#4</strong></td>
        <td><strong>DermaCare</strong></td>
        <td style="text-align:center;">52%</td>
        <td style="text-align:center;">48%</td>
        <td style="text-align:center;">44%</td>
        <td style="text-align:center;"><strong>48%</strong></td>
        <td style="text-align:center;"><button class="btn-ghost btn-sm">Verwijderen</button></td>
      </tr>
      <tr>
        <td style="text-align:center;"><strong>#5</strong></td>
        <td><strong>BeautyMed</strong></td>
        <td style="text-align:center;">40%</td>
        <td style="text-align:center;">38%</td>
        <td style="text-align:center;">35%</td>
        <td style="text-align:center;"><strong>38%</strong></td>
        <td style="text-align:center;"><button class="btn-ghost btn-sm">Verwijderen</button></td>
      </tr>
      <tr>
        <td style="text-align:center;"><strong>#6</strong></td>
        <td><strong>beautyXL</strong></td>
        <td style="text-align:center;">38%</td>
        <td style="text-align:center;">29%</td>
        <td style="text-align:center;" class="red">22%</td>
        <td style="text-align:center;" class="red"><strong>30%</strong></td>
        <td style="text-align:center;"><button class="btn-ghost btn-sm">Verwijderen</button></td>
      </tr>
    </tbody>
  </table>
</div>

<div class="grid3">
  <div class="card">
    <div class="card-title">Claude</div>
    <div class="card-sub">Top 3 concurrenten</div>
    <div style="margin-top:16px;">
      <div class="prog-row">
        <div class="prog-label"><span>Kliniek XYZ</span><span>85%</span></div>
        <div class="prog-track"><div class="prog-fill" style="width:85%;"></div></div>
      </div>
      <div class="prog-row">
        <div class="prog-label"><span>Skinlab</span><span>82%</span></div>
        <div class="prog-track"><div class="prog-fill" style="width:82%;"></div></div>
      </div>
      <div class="prog-row">
        <div class="prog-label"><span>Glow Clinic</span><span>71%</span></div>
        <div class="prog-track"><div class="prog-fill" style="width:71%;"></div></div>
      </div>
    </div>
  </div>
  <div class="card">
    <div class="card-title">ChatGPT</div>
    <div class="card-sub">Top 3 concurrenten</div>
    <div style="margin-top:16px;">
      <div class="prog-row">
        <div class="prog-label"><span>Kliniek XYZ</span><span>81%</span></div>
        <div class="prog-track"><div class="prog-fill prog-fill-blue" style="width:81%;"></div></div>
      </div>
      <div class="prog-row">
        <div class="prog-label"><span>Skinlab</span><span>74%</span></div>
        <div class="prog-track"><div class="prog-fill prog-fill-blue" style="width:74%;"></div></div>
      </div>
      <div class="prog-row">
        <div class="prog-label"><span>Glow Clinic</span><span>55%</span></div>
        <div class="prog-track"><div class="prog-fill prog-fill-blue" style="width:55%;"></div></div>
      </div>
    </div>
  </div>
  <div class="card">
    <div class="card-title">Gemini</div>
    <div class="card-sub">Top 3 concurrenten</div>
    <div style="margin-top:16px;">
      <div class="prog-row">
        <div class="prog-label"><span>Kliniek XYZ</span><span>80%</span></div>
        <div class="prog-track"><div class="prog-fill prog-fill-orange" style="width:80%;"></div></div>
      </div>
      <div class="prog-row">
        <div class="prog-label"><span>Skinlab</span><span>68%</span></div>
        <div class="prog-track"><div class="prog-fill prog-fill-orange" style="width:68%;"></div></div>
      </div>
      <div class="prog-row">
        <div class="prog-label"><span>Glow Clinic</span><span>49%</span></div>
        <div class="prog-track"><div class="prog-fill prog-fill-orange" style="width:49%;"></div></div>
      </div>
    </div>
  </div>
</div>
    `;
  },
  init: function() {
    var addBtn = document.getElementById('comp-add-btn');
    var addForm = document.getElementById('comp-add-form');
    var cancelBtn = document.getElementById('comp-cancel-btn');
    var saveBtn = document.getElementById('comp-save-btn');

    if (addBtn && addForm) {
      addBtn.addEventListener('click', function() {
        addForm.style.display = addForm.style.display === 'none' ? 'block' : 'none';
      });
    }
    if (cancelBtn && addForm) {
      cancelBtn.addEventListener('click', function() {
        addForm.style.display = 'none';
      });
    }
    if (saveBtn && addForm) {
      saveBtn.addEventListener('click', function() {
        var name = document.getElementById('comp-name');
        if (name && name.value.trim()) {
          App.toast('Concurrent "' + name.value.trim() + '" toegevoegd', 'success');
          addForm.style.display = 'none';
          if (name) name.value = '';
        } else {
          App.toast('Voer een naam in', 'error');
        }
      });
    }
  }
});
