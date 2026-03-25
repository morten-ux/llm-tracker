App.registerModule('analytics', {
  label: 'Analytics',
  icon: 'barChart',
  render: function() {
    var barHeights = [32, 28, 38, 45, 35, 50, 42, 48, 30, 52, 44, 36];
    var barsHtml = barHeights.map(function(h) {
      return '<div class="bar" style="height:' + h + 'px;"></div>';
    }).join('');

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
    </div>
  </div>
</div>

<div class="stat-grid">
  <div class="stat-card">
    <div class="stat-label">Totaal mentions</div>
    <div class="stat-value">347</div>
    <div class="stat-delta delta-up">&#8593; +18% vs vorige periode</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Gem. mention rate</div>
    <div class="stat-value">62%</div>
    <div class="stat-delta delta-up">&#8593; +5pp vs vorige periode</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Beste LLM</div>
    <div class="stat-value" style="font-size:20px;">Claude</div>
    <div class="stat-delta delta-neutral">78% mention rate</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Runs</div>
    <div class="stat-value">24</div>
    <div class="stat-delta delta-down">&#8595; -2 vs vorige periode</div>
  </div>
</div>

<div class="grid2">
  <div class="card">
    <div class="card-title">Mention rate per LLM</div>
    <div class="card-sub">Gemiddeld over alle brands</div>
    <div style="margin-top:18px;">
      <div class="prog-row">
        <div class="prog-label"><span>Claude</span><span>78%</span></div>
        <div class="prog-track"><div class="prog-fill" style="width:78%;"></div></div>
      </div>
      <div class="prog-row">
        <div class="prog-label"><span>ChatGPT</span><span>61%</span></div>
        <div class="prog-track"><div class="prog-fill prog-fill-blue" style="width:61%;"></div></div>
      </div>
      <div class="prog-row">
        <div class="prog-label"><span>Gemini</span><span>47%</span></div>
        <div class="prog-track"><div class="prog-fill prog-fill-orange" style="width:47%;"></div></div>
      </div>
    </div>
  </div>
  <div class="card">
    <div class="card-title">Mentions over tijd</div>
    <div class="card-sub">Aantal vermeldingen per maand</div>
    <div style="margin-top:18px;">
      <div class="bar-chart">` + barsHtml + `</div>
      <div class="bar-labels">
        <span>Jan</span><span>Feb</span><span>Mrt</span>
      </div>
    </div>
  </div>
</div>

<div class="table-card">
  <table class="data-table">
    <thead>
      <tr>
        <th>Brand</th>
        <th>Claude</th>
        <th>ChatGPT</th>
        <th>Gemini</th>
        <th>Gem. score</th>
        <th>Trend</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Skinlab</strong></td>
        <td class="green">82%</td>
        <td class="green">74%</td>
        <td class="green">68%</td>
        <td><strong>75%</strong></td>
        <td><span style="color:var(--green);">&#8593; +7pp</span></td>
      </tr>
      <tr>
        <td><strong>Glow Clinic</strong></td>
        <td class="green">71%</td>
        <td>55%</td>
        <td>49%</td>
        <td><strong>58%</strong></td>
        <td><span style="color:var(--green);">&#8593; +3pp</span></td>
      </tr>
      <tr>
        <td><strong>beautyXL</strong></td>
        <td>38%</td>
        <td>29%</td>
        <td class="red">22%</td>
        <td><strong class="red">30%</strong></td>
        <td><span style="color:var(--red);">&#8595; -5pp</span></td>
      </tr>
    </tbody>
  </table>
</div>
    `;
  },
  init: function() {
    document.querySelectorAll('.filter-chip[data-period]').forEach(function(chip) {
      chip.addEventListener('click', function() {
        document.querySelectorAll('.filter-chip[data-period]').forEach(function(c) { c.classList.remove('active'); });
        chip.classList.add('active');
      });
    });
  }
});
