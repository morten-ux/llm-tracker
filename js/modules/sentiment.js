App.registerModule('sentiment', {
  label: 'Sentiment',
  icon: 'smile',
  render: function() {
    return `
<div class="page-header">
  <div class="page-header-left">
    <h1>Sentiment</h1>
    <p>Analyse van hoe LLMs over jouw brand schrijven</p>
  </div>
  <div class="page-header-actions">
    <div class="filter-chips" style="margin-bottom:0;">
      <button class="filter-chip active" data-llm="all">Alle LLMs</button>
      <button class="filter-chip" data-llm="claude">Claude</button>
      <button class="filter-chip" data-llm="chatgpt">ChatGPT</button>
      <button class="filter-chip" data-llm="gemini">Gemini</button>
    </div>
  </div>
</div>

<div class="stat-grid">
  <div class="stat-card">
    <div class="stat-label">Positief</div>
    <div class="stat-value" style="color:var(--green);">73%</div>
    <div class="stat-delta delta-up">&#8593; +4pp vs vorige maand</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Neutraal</div>
    <div class="stat-value" style="color:var(--yellow);">19%</div>
    <div class="stat-delta delta-neutral">Stabiel</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Negatief</div>
    <div class="stat-value" style="color:var(--red);">8%</div>
    <div class="stat-delta delta-up">&#8595; -2pp vs vorige maand</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Score</div>
    <div class="stat-value">8.2<span style="font-size:16px; font-weight:500; color:var(--text-3);">/10</span></div>
    <div class="stat-delta delta-up">&#8593; +0.4 vs vorige maand</div>
  </div>
</div>

<div class="grid2">
  <div class="card">
    <div class="card-title">Positieve termen</div>
    <div class="card-sub">Meest gebruikte positieve woorden</div>
    <div class="kw-grid">
      <div class="kw-chip" style="border-color:#86efac; background:#f0fdf4; color:#166534;">
        <span>betrouwbaar</span><span class="kw-count" style="background:#dcfce7; color:var(--green);">38x</span>
      </div>
      <div class="kw-chip" style="border-color:#86efac; background:#f0fdf4; color:#166534;">
        <span>gespecialiseerd</span><span class="kw-count" style="background:#dcfce7; color:var(--green);">31x</span>
      </div>
      <div class="kw-chip" style="border-color:#86efac; background:#f0fdf4; color:#166534;">
        <span>professioneel</span><span class="kw-count" style="background:#dcfce7; color:var(--green);">28x</span>
      </div>
      <div class="kw-chip" style="border-color:#86efac; background:#f0fdf4; color:#166534;">
        <span>erkend</span><span class="kw-count" style="background:#dcfce7; color:var(--green);">24x</span>
      </div>
      <div class="kw-chip" style="border-color:#86efac; background:#f0fdf4; color:#166534;">
        <span>kwaliteit</span><span class="kw-count" style="background:#dcfce7; color:var(--green);">22x</span>
      </div>
      <div class="kw-chip" style="border-color:#86efac; background:#f0fdf4; color:#166534;">
        <span>aanraden</span><span class="kw-count" style="background:#dcfce7; color:var(--green);">19x</span>
      </div>
    </div>
  </div>
  <div class="card">
    <div class="card-title">Sentiment per LLM</div>
    <div class="card-sub">Gemiddelde positieve toon</div>
    <div style="margin-top:16px;">
      <div class="prog-row">
        <div class="prog-label"><span>Claude</span><span style="color:var(--green);">81%</span></div>
        <div class="prog-track"><div class="prog-fill prog-fill-green" style="width:81%;"></div></div>
      </div>
      <div class="prog-row">
        <div class="prog-label"><span>ChatGPT</span><span style="color:var(--green);">72%</span></div>
        <div class="prog-track"><div class="prog-fill prog-fill-blue" style="width:72%;"></div></div>
      </div>
      <div class="prog-row">
        <div class="prog-label"><span>Gemini</span><span>66%</span></div>
        <div class="prog-track"><div class="prog-fill prog-fill-orange" style="width:66%;"></div></div>
      </div>
    </div>
  </div>
</div>

<div class="card">
  <div class="card-title" style="margin-bottom:16px;">Recente citaten</div>
  <div class="alert-list">
    <div class="alert-item">
      <div class="alert-dot alert-dot-green"></div>
      <div class="alert-body">
        <div class="alert-title">"Skinlab staat bekend als een van de meest betrouwbare en gespecialiseerde klinieken voor huidverjonging in Amsterdam."</div>
        <div class="alert-meta">Claude &middot; huidverjonging Amsterdam &middot; 22 mrt 2026</div>
      </div>
    </div>
    <div class="alert-item">
      <div class="alert-dot alert-dot-yellow"></div>
      <div class="alert-body">
        <div class="alert-title">"Er zijn verschillende klinieken in Amsterdam voor botox behandelingen, waaronder Skinlab en enkele andere gevestigde namen."</div>
        <div class="alert-meta">ChatGPT &middot; botox kliniek &middot; 21 mrt 2026</div>
      </div>
    </div>
    <div class="alert-item">
      <div class="alert-dot alert-dot-green"></div>
      <div class="alert-body">
        <div class="alert-title">"Voor professionele cosmetische behandelingen in Amsterdam wordt Skinlab vaak aangeraden vanwege hun erkende specialisten en moderne technieken."</div>
        <div class="alert-meta">Claude &middot; cosmetische kliniek &middot; 20 mrt 2026</div>
      </div>
    </div>
  </div>
</div>
    `;
  },
  init: function() {
    document.querySelectorAll('.filter-chip[data-llm]').forEach(function(chip) {
      chip.addEventListener('click', function() {
        document.querySelectorAll('.filter-chip[data-llm]').forEach(function(c) { c.classList.remove('active'); });
        chip.classList.add('active');
      });
    });
  }
});
