App.registerModule('reports', {
  label: 'Reports',
  icon: 'fileText',
  render: function() {
    return `
<div class="page-header">
  <div class="page-header-left">
    <h1>Reports</h1>
    <p>Gegenereerde rapporten en export opties</p>
  </div>
  <div class="page-header-actions">
    <button class="btn-ghost" id="report-new-btn">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      Nieuw rapport
    </button>
  </div>
</div>

<div class="grid2">
  <div class="card" style="border-color:var(--primary); border-width:2px;">
    <div class="flex-between mb-16">
      <div>
        <div class="card-title">Maandrapport maart 2026</div>
        <div class="card-sub">3 brands &middot; 24 runs</div>
      </div>
      <span class="badge badge-blue">Nieuw</span>
    </div>
    <div style="background:var(--bg); border-radius:10px; padding:12px 14px; margin-bottom:16px;">
      <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:6px;">
        <span class="text-muted">Gem. mention rate</span>
        <strong style="color:var(--green);">62%</strong>
      </div>
      <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:6px;">
        <span class="text-muted">Totaal mentions</span>
        <strong>347</strong>
      </div>
      <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:6px;">
        <span class="text-muted">Beste brand</span>
        <strong>Skinlab (75%)</strong>
      </div>
      <div style="display:flex; justify-content:space-between; font-size:13px;">
        <span class="text-muted">Periode</span>
        <strong>1 – 24 mrt 2026</strong>
      </div>
    </div>
    <button class="btn" style="width:100%; justify-content:center;" onclick="App.toast('PDF wordt gegenereerd...', 'success')">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      Download PDF
    </button>
  </div>

  <div class="card">
    <div class="flex-between mb-16">
      <div>
        <div class="card-title">Maandrapport februari 2026</div>
        <div class="card-sub">3 brands &middot; 19 runs</div>
      </div>
    </div>
    <div style="background:var(--bg); border-radius:10px; padding:12px 14px; margin-bottom:16px;">
      <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:6px;">
        <span class="text-muted">Gem. mention rate</span>
        <strong>55%</strong>
      </div>
      <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:6px;">
        <span class="text-muted">Totaal mentions</span>
        <strong>294</strong>
      </div>
      <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:6px;">
        <span class="text-muted">Beste brand</span>
        <strong>Skinlab (68%)</strong>
      </div>
      <div style="display:flex; justify-content:space-between; font-size:13px;">
        <span class="text-muted">Periode</span>
        <strong>1 – 28 feb 2026</strong>
      </div>
    </div>
    <button class="btn-ghost" style="width:100%; justify-content:center;" onclick="App.toast('PDF wordt gegenereerd...', 'success')">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      Download PDF
    </button>
  </div>
</div>

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
    <div class="toggle-row">
      <div>
        <div class="toggle-label">E-mail bezorging</div>
        <div class="toggle-sub">Stuur rapporten naar morten@example.com</div>
      </div>
      <label class="toggle">
        <input type="checkbox" />
        <span class="toggle-slider"></span>
      </label>
    </div>
  </div>
</div>

<div class="table-card">
  <table class="data-table">
    <thead>
      <tr>
        <th>Rapport</th>
        <th>Periode</th>
        <th>Brands</th>
        <th>Runs</th>
        <th>Gem. score</th>
        <th>Download</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Maandrapport mrt 2026</strong></td>
        <td>1 – 24 mrt 2026</td>
        <td style="text-align:center;">3</td>
        <td style="text-align:center;">24</td>
        <td style="text-align:center;" class="green"><strong>62%</strong></td>
        <td style="text-align:center;">
          <button class="btn-ghost btn-sm" onclick="App.toast('PDF wordt gegenereerd...', 'success')">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            PDF
          </button>
        </td>
      </tr>
      <tr>
        <td><strong>Maandrapport feb 2026</strong></td>
        <td>1 – 28 feb 2026</td>
        <td style="text-align:center;">3</td>
        <td style="text-align:center;">19</td>
        <td style="text-align:center;"><strong>55%</strong></td>
        <td style="text-align:center;">
          <button class="btn-ghost btn-sm" onclick="App.toast('PDF wordt gegenereerd...', 'success')">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            PDF
          </button>
        </td>
      </tr>
      <tr>
        <td><strong>Maandrapport jan 2026</strong></td>
        <td>1 – 31 jan 2026</td>
        <td style="text-align:center;">2</td>
        <td style="text-align:center;">15</td>
        <td style="text-align:center;"><strong>48%</strong></td>
        <td style="text-align:center;">
          <button class="btn-ghost btn-sm" onclick="App.toast('PDF wordt gegenereerd...', 'success')">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            PDF
          </button>
        </td>
      </tr>
      <tr>
        <td><strong>Kwartaalrapport Q4 2025</strong></td>
        <td>okt – dec 2025</td>
        <td style="text-align:center;">2</td>
        <td style="text-align:center;">38</td>
        <td style="text-align:center;"><strong>44%</strong></td>
        <td style="text-align:center;">
          <button class="btn-ghost btn-sm" onclick="App.toast('PDF wordt gegenereerd...', 'success')">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            PDF
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
    `;
  },
  init: function() {
    var newBtn = document.getElementById('report-new-btn');
    if (newBtn) {
      newBtn.addEventListener('click', function() {
        App.toast('Nieuw rapport wordt aangemaakt...', 'success');
      });
    }
    // Toggle switches are visual only
  }
});
