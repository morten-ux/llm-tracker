App.registerModule('settings', {
  label: 'Settings',
  icon: 'settings',
  render: function() {
    return `
<div class="page-header">
  <div class="page-header-left">
    <h1>Settings</h1>
    <p>Beheer je account, API keys en voorkeuren</p>
  </div>
</div>

<div class="grid2">
  <div class="card">
    <div class="card-title" style="margin-bottom:18px;">Profiel</div>
    <div style="display:flex; align-items:center; gap:16px; margin-bottom:20px;">
      <div style="width:56px; height:56px; border-radius:50%; background:linear-gradient(135deg,#6366f1,#8b5cf6); display:flex; align-items:center; justify-content:center; color:#fff; font-size:20px; font-weight:700; flex-shrink:0;">M</div>
      <div>
        <div style="font-size:15px; font-weight:700;">Morten Muijsers</div>
        <div style="font-size:13px; color:var(--text-3);">morten@example.com</div>
      </div>
    </div>
    <div class="field">
      <label for="s-name">Naam</label>
      <input type="text" id="s-name" value="Morten Muijsers" />
    </div>
    <div class="field">
      <label for="s-email">E-mailadres</label>
      <input type="email" id="s-email" value="morten@example.com" />
    </div>
    <button class="btn" id="s-profile-save">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 20 4 15"/></svg>
      Opslaan
    </button>
  </div>

  <div class="card">
    <div class="card-title">API Keys</div>
    <div class="settings-description" style="margin-top:6px;">Voeg je API keys toe om ChatGPT en Gemini te testen naast Claude.</div>
    <div class="field">
      <label for="s-openai">OpenAI API Key</label>
      <input type="password" id="s-openai" placeholder="sk-..." autocomplete="off" />
    </div>
    <div class="field">
      <label for="s-gemini">Google Gemini API Key</label>
      <input type="password" id="s-gemini" placeholder="AIza..." autocomplete="off" />
    </div>
    <p class="hint">Je API keys worden lokaal opgeslagen in je browser en nooit gedeeld. Claude wordt altijd getest via onze eigen proxy (geen key vereist).</p>
  </div>
</div>

<div class="card mb-20">
  <div class="card-title" style="margin-bottom:16px;">Voorkeuren</div>
  <div>
    <div class="toggle-row">
      <div>
        <div class="toggle-label">Auto herhalen</div>
        <div class="toggle-sub">Herhaal de laatste test automatisch bij openen</div>
      </div>
      <label class="toggle">
        <input type="checkbox" id="s-toggle-autorepeat" />
        <span class="toggle-slider"></span>
      </label>
    </div>
    <div class="toggle-row">
      <div>
        <div class="toggle-label">Resultaten e-mailen</div>
        <div class="toggle-sub">Stuur testresultaten naar je e-mailadres</div>
      </div>
      <label class="toggle">
        <input type="checkbox" id="s-toggle-email" />
        <span class="toggle-slider"></span>
      </label>
    </div>
    <div class="toggle-row">
      <div>
        <div class="toggle-label">Web search (Claude)</div>
        <div class="toggle-sub">Gebruik web search tool voor actuele resultaten</div>
      </div>
      <label class="toggle">
        <input type="checkbox" id="s-toggle-websearch" />
        <span class="toggle-slider"></span>
      </label>
    </div>
    <div class="toggle-row">
      <div>
        <div class="toggle-label">Donkere modus</div>
        <div class="toggle-sub">Schakel over naar een donker thema</div>
      </div>
      <label class="toggle">
        <input type="checkbox" id="s-toggle-darkmode" />
        <span class="toggle-slider"></span>
      </label>
    </div>
  </div>
</div>

<div class="card mb-20">
  <div class="card-title" style="margin-bottom:16px;">Notificaties</div>
  <div>
    <div class="toggle-row">
      <div>
        <div class="toggle-label">Kritieke alerts</div>
        <div class="toggle-sub">Ontvang meldingen bij kritieke drempelwaarden</div>
      </div>
      <label class="toggle">
        <input type="checkbox" id="s-toggle-notifcritical" />
        <span class="toggle-slider"></span>
      </label>
    </div>
    <div class="toggle-row">
      <div>
        <div class="toggle-label">Wekelijks rapport</div>
        <div class="toggle-sub">Ontvang elke maandag een samenvatting</div>
      </div>
      <label class="toggle">
        <input type="checkbox" id="s-toggle-notifweekly" />
        <span class="toggle-slider"></span>
      </label>
    </div>
    <div class="toggle-row">
      <div>
        <div class="toggle-label">Benchmark updates</div>
        <div class="toggle-sub">Meldingen bij wijzigingen in concurrent scores</div>
      </div>
      <label class="toggle">
        <input type="checkbox" id="s-toggle-notifbenchmark" />
        <span class="toggle-slider"></span>
      </label>
    </div>
    <div class="toggle-row">
      <div>
        <div class="toggle-label">Alert drempelwaarde</div>
        <div class="toggle-sub">Melding wanneer mention rate daalt onder dit percentage</div>
      </div>
      <div style="display:flex; align-items:center; gap:6px;">
        <input type="number" id="s-alert-threshold" min="0" max="100" style="width:64px; text-align:center;" />
        <span style="font-size:13px; color:var(--text-3);">%</span>
      </div>
    </div>
  </div>
</div>

<div class="danger-zone">
  <div class="danger-zone-title">Gevarenzone</div>
  <div class="danger-zone-desc">Let op: deze acties kunnen niet ongedaan worden gemaakt. Je verwijdert al je opgeslagen data, API keys en instellingen permanent.</div>
  <button class="btn-danger" id="s-clear-all">
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
    Alle data wissen
  </button>
</div>
    `;
  },
  init: function() {
    var s = ApiService.getSettings();

    // API keys
    var openaiEl = document.getElementById('s-openai');
    var geminiEl = document.getElementById('s-gemini');
    if (openaiEl && s.openaiKey) openaiEl.value = s.openaiKey;
    if (geminiEl && s.geminiKey) geminiEl.value = s.geminiKey;
    function saveKeys() {
      var settings = ApiService.getSettings();
      if (openaiEl) settings.openaiKey = openaiEl.value;
      if (geminiEl) settings.geminiKey = geminiEl.value;
      ApiService.saveSettings(settings);
    }
    if (openaiEl) openaiEl.addEventListener('input', saveKeys);
    if (geminiEl) geminiEl.addEventListener('input', saveKeys);

    // Toggles: [elementId, settingKey, optional callback]
    var toggles = [
      ['s-toggle-autorepeat',    'autoRepeat'],
      ['s-toggle-email',         'emailResults'],
      ['s-toggle-websearch',     'webSearch'],
      ['s-toggle-darkmode',      'darkMode',       function(val) { document.documentElement.classList.toggle('dark', val); }],
      ['s-toggle-notifcritical', 'notifCritical'],
      ['s-toggle-notifweekly',   'notifWeekly'],
      ['s-toggle-notifbenchmark','notifBenchmark'],
    ];
    toggles.forEach(function(t) {
      var el = document.getElementById(t[0]);
      if (!el) return;
      el.checked = !!s[t[1]];
      el.addEventListener('change', function() {
        var settings = ApiService.getSettings();
        settings[t[1]] = el.checked;
        ApiService.saveSettings(settings);
        if (t[2]) t[2](el.checked);
        App.toast('Instellingen opgeslagen', 'success');
      });
    });

    // Alert threshold
    var thresholdEl = document.getElementById('s-alert-threshold');
    if (thresholdEl) {
      thresholdEl.value = s.alertThreshold !== undefined ? s.alertThreshold : 30;
      thresholdEl.addEventListener('change', function() {
        var settings = ApiService.getSettings();
        settings.alertThreshold = parseInt(thresholdEl.value) || 30;
        ApiService.saveSettings(settings);
        App.toast('Drempelwaarde opgeslagen', 'success');
      });
    }

    // Profile save
    var profileSave = document.getElementById('s-profile-save');
    if (profileSave) {
      profileSave.addEventListener('click', function() {
        App.toast('Profiel opgeslagen', 'success');
      });
    }

    // Clear all data
    var clearBtn = document.getElementById('s-clear-all');
    if (clearBtn) {
      clearBtn.addEventListener('click', function() {
        if (!confirm('Weet je zeker dat je ALLE data wilt wissen? Dit kan niet ongedaan worden gemaakt.')) return;
        localStorage.clear();
        App.toast('Alle data gewist', 'success');
        App.navigate('settings');
      });
    }
  }
});
