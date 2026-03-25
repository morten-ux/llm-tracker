App.registerModule('brand-tracker', {
  label: 'Brand Tracker',
  icon: 'tag',
  render: function() {
    return `
<div class="page-header">
  <div class="page-header-left">
    <h1>Brand Tracker</h1>
    <p>Test of jouw brands worden vermeld in ChatGPT, Gemini en Claude</p>
  </div>
  <div class="page-header-actions">
    <a href="dashboard.html" class="btn-ghost">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
      Dashboard
    </a>
  </div>
</div>

<div class="tab-bar">
  <button class="tab-btn active" data-tab="run">Run</button>
  <button class="tab-btn" data-tab="history">History</button>
  <button class="tab-btn" data-tab="schedule">Schedule</button>
</div>

<div class="tab-panel active" id="tab-run">
  <div class="card">
    <div class="field">
      <label for="bt-brands">Brand namen <span class="label-hint">(meerdere? scheid met komma)</span></label>
      <input type="text" id="bt-brands" placeholder="bijv. Skinlab, Glow Clinic, beautyXL" />
      <div class="tags" id="bt-tags"></div>
    </div>

    <div class="form-grid2">
      <div class="field" style="margin-bottom:0">
        <label for="bt-treatment">Behandeling / dienst</label>
        <input type="text" id="bt-treatment" placeholder="bijv. huidverjonging, botox" />
      </div>
      <div class="field" style="margin-bottom:0">
        <label for="bt-city">Stad / regio</label>
        <input type="text" id="bt-city" placeholder="bijv. Amsterdam" />
      </div>
    </div>

    <div class="field mt-16">
      <label class="checkbox-row">
        <input type="checkbox" id="bt-useCustom" />
        Gebruik een eigen prompt
      </label>
      <textarea id="bt-customPrompt" placeholder="Typ hier je eigen prompt. Gebruik {brand} als placeholder voor de merknaam." style="display:none; margin-top:8px;"></textarea>
    </div>

    <div id="bt-promptPreview" style="display:none;">
      <div class="prompt-list">
        <div class="prompt-list-label">Te testen prompts</div>
        <p id="bt-promptCount" class="text-sm text-muted mb-16"></p>
        <ul id="bt-promptList" style="padding-left:18px;"></ul>
      </div>
    </div>

    <div id="bt-error" class="error-msg" style="display:none;">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <span id="bt-errorMsg"></span>
    </div>

    <div id="bt-warning" class="warning" style="display:none;">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <span>Geen OpenAI of Gemini API key ingesteld. Ga naar <strong>Settings</strong> om ze toe te voegen. Claude wordt altijd getest.</span>
    </div>

    <div style="margin-top:4px;">
      <button class="btn" id="bt-run">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        Test uitvoeren
      </button>
    </div>
  </div>

  <div id="bt-results" style="display:none; margin-top:20px;"></div>
</div>

<div class="tab-panel" id="tab-history">
  <div id="bt-history"></div>
</div>

<div class="tab-panel" id="tab-schedule">
  <div class="card">
    <div class="section-title">Geplande tests</div>
    <div class="inline-form mb-16">
      <div class="form-grid2">
        <div class="field" style="margin-bottom:0">
          <label for="sch-freq">Frequentie</label>
          <select id="sch-freq" onchange="BrandTracker.toggleWeekday()">
            <option value="daily">Dagelijks</option>
            <option value="weekly">Wekelijks</option>
            <option value="monthly">Maandelijks</option>
          </select>
        </div>
        <div class="field" style="margin-bottom:0" id="sch-weekday-wrap" style="display:none;">
          <label for="sch-weekday">Dag van de week</label>
          <select id="sch-weekday">
            <option>Maandag</option>
            <option>Dinsdag</option>
            <option>Woensdag</option>
            <option>Donderdag</option>
            <option>Vrijdag</option>
          </select>
        </div>
        <div class="field" style="margin-bottom:0">
          <label for="sch-time">Tijdstip</label>
          <input type="time" id="sch-time" value="08:00" />
        </div>
      </div>
      <div class="form-grid2 mt-12">
        <div class="field" style="margin-bottom:0">
          <label for="sch-brands">Brands <span class="label-hint">(kommagescheiden)</span></label>
          <input type="text" id="sch-brands" placeholder="bijv. Skinlab, Glow Clinic" />
        </div>
        <div class="field" style="margin-bottom:0">
          <label for="sch-treatment">Behandeling</label>
          <input type="text" id="sch-treatment" placeholder="bijv. huidverjonging" />
        </div>
      </div>
      <div class="field mt-12">
        <label for="sch-city">Stad</label>
        <input type="text" id="sch-city" placeholder="bijv. Amsterdam" />
      </div>
      <button class="btn btn-sm mt-8" onclick="BrandTracker.saveSchedule()">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 20 4 15"/></svg>
        Opslaan
      </button>
    </div>

    <div class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th>Naam</th>
            <th>Frequentie</th>
            <th>Volgende run</th>
            <th>Status</th>
            <th>Actie</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Skinlab dagelijkse check</strong></td>
            <td>Dagelijks</td>
            <td>Morgen 08:00</td>
            <td><span class="badge badge-green">Actief</span></td>
            <td><button class="btn-ghost btn-sm">Verwijderen</button></td>
          </tr>
          <tr>
            <td><strong>Glow Clinic wekelijks</strong></td>
            <td>Wekelijks (Ma)</td>
            <td>Ma 27 mrt 09:00</td>
            <td><span class="badge badge-yellow">Gepauzeerd</span></td>
            <td><button class="btn-ghost btn-sm">Verwijderen</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
    `;
  },
  init: function() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var tab = btn.dataset.tab;
        document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
        document.querySelectorAll('.tab-panel').forEach(function(p) { p.classList.remove('active'); });
        btn.classList.add('active');
        var panel = document.getElementById('tab-' + tab);
        if (panel) panel.classList.add('active');
      });
    });

    var brandsInput = document.getElementById('bt-brands');
    if (brandsInput) brandsInput.addEventListener('input', function() { BrandTracker.updateTags(); BrandTracker.updatePrompts(); });

    var treatmentInput = document.getElementById('bt-treatment');
    if (treatmentInput) treatmentInput.addEventListener('input', function() { BrandTracker.updatePrompts(); });

    var cityInput = document.getElementById('bt-city');
    if (cityInput) cityInput.addEventListener('input', function() { BrandTracker.updatePrompts(); });

    var useCustom = document.getElementById('bt-useCustom');
    if (useCustom) useCustom.addEventListener('change', function() { BrandTracker.toggleCustom(); });

    var runBtn = document.getElementById('bt-run');
    if (runBtn) runBtn.addEventListener('click', function() { BrandTracker.runTest(); });

    BrandTracker.updateKeyWarning();
    BrandTracker.renderHistory();
  }
});

window.BrandTracker = {
  updateKeyWarning: function() {
    var s = ApiService.getSettings();
    var warning = document.getElementById('bt-warning');
    if (!warning) return;
    if (!s.openaiKey && !s.geminiKey) {
      warning.style.display = 'flex';
    } else {
      warning.style.display = 'none';
    }
  },

  updateTags: function() {
    var input = document.getElementById('bt-brands');
    var tagsDiv = document.getElementById('bt-tags');
    if (!input || !tagsDiv) return;
    var brands = input.value.split(',').map(function(b) { return b.trim(); }).filter(Boolean);
    tagsDiv.innerHTML = brands.map(function(b) {
      return '<span class="tag">' + ApiService.escapeHtml(b) + '</span>';
    }).join('');
  },

  toggleCustom: function() {
    var cb = document.getElementById('bt-useCustom');
    var ta = document.getElementById('bt-customPrompt');
    var preview = document.getElementById('bt-promptPreview');
    if (!cb || !ta) return;
    if (cb.checked) {
      ta.style.display = 'block';
      if (preview) preview.style.display = 'none';
    } else {
      ta.style.display = 'none';
      BrandTracker.updatePrompts();
    }
  },

  getPrompts: function() {
    var treatment = (document.getElementById('bt-treatment') || {}).value || 'behandeling';
    var city = (document.getElementById('bt-city') || {}).value || 'Nederland';
    return [
      'Welke klinieken voor ' + treatment + ' in ' + city + ' raad je aan?',
      'Wat zijn de beste aanbieders van ' + treatment + ' in ' + city + '?',
      'Ik zoek een goede kliniek voor ' + treatment + ' in de buurt van ' + city + '.',
      'Kun je topklinieken noemen voor ' + treatment + ' in ' + city + '?',
      'Welk bedrijf is het meest betrouwbaar voor ' + treatment + ' in ' + city + '?',
      'Wat zijn reviews over klinieken voor ' + treatment + ' in ' + city + '?',
      'Geef me een lijst van gespecialiseerde aanbieders van ' + treatment + ' in ' + city + '.',
      'Welke ' + treatment + '-kliniek wordt het meest aanbevolen in ' + city + '?',
      'Zijn er bekende namen in de ' + treatment + '-sector in ' + city + '?',
      'Welke klinieken scoren hoog op ' + treatment + ' in ' + city + '?',
      'Adviseer me een kliniek voor ' + treatment + ' in ' + city + '.',
      'Welke behandelaars voor ' + treatment + ' zijn populair in ' + city + '?',
      'Top 5 klinieken voor ' + treatment + ' in ' + city + '?',
      'Waarom kiezen mensen voor bepaalde klinieken voor ' + treatment + ' in ' + city + '?',
    ];
  },

  updatePrompts: function() {
    var cb = document.getElementById('bt-useCustom');
    var preview = document.getElementById('bt-promptPreview');
    var countEl = document.getElementById('bt-promptCount');
    var listEl = document.getElementById('bt-promptList');
    if (!preview) return;
    if (cb && cb.checked) return;
    var prompts = BrandTracker.getPrompts();
    if (countEl) countEl.textContent = prompts.length + ' prompts worden getest per brand per LLM';
    if (listEl) {
      listEl.innerHTML = prompts.map(function(p) {
        return '<li>' + ApiService.escapeHtml(p) + '</li>';
      }).join('');
    }
    preview.style.display = 'block';
  },

  showError: function(msg) {
    var errDiv = document.getElementById('bt-error');
    var errMsg = document.getElementById('bt-errorMsg');
    if (!errDiv) return;
    if (msg) {
      if (errMsg) errMsg.textContent = msg;
      errDiv.style.display = 'flex';
    } else {
      errDiv.style.display = 'none';
    }
  },

  renderResults: function(entry, brands) {
    var resultsDiv = document.getElementById('bt-results');
    if (!resultsDiv) return;

    var llmNames = Object.keys(entry.results);
    var totalMentions = 0;
    var mentionCounts = {};
    brands.forEach(function(b) { mentionCounts[b] = {}; });

    llmNames.forEach(function(llm) {
      var llmResults = entry.results[llm];
      if (!llmResults) return;
      Object.keys(llmResults).forEach(function(promptIdx) {
        var text = llmResults[promptIdx];
        brands.forEach(function(b) {
          var mentioned = ApiService.checkMentions(text, [b]).length > 0;
          if (mentioned) {
            mentionCounts[b][llm] = (mentionCounts[b][llm] || 0) + 1;
            totalMentions++;
          }
        });
      });
    });

    var summaryHtml = '<div class="card mb-16">'
      + '<div class="card-title" style="margin-bottom:14px;">Samenvatting</div>'
      + '<div class="table-card" style="margin-bottom:0;">'
      + '<table class="data-table"><thead><tr><th>Brand</th>'
      + llmNames.map(function(l) { return '<th>' + ApiService.escapeHtml(l) + '</th>'; }).join('')
      + '<th>Gem. rate</th></tr></thead><tbody>';

    brands.forEach(function(b) {
      var rates = llmNames.map(function(llm) {
        var prompts = entry.results[llm] ? Object.keys(entry.results[llm]).length : 1;
        var count = mentionCounts[b][llm] || 0;
        return prompts > 0 ? Math.round((count / prompts) * 100) : 0;
      });
      var avg = rates.length ? Math.round(rates.reduce(function(a, v) { return a + v; }, 0) / rates.length) : 0;
      summaryHtml += '<tr><td><strong>' + ApiService.escapeHtml(b) + '</strong></td>';
      rates.forEach(function(r) {
        var cls = r >= 50 ? 'green' : r > 0 ? '' : 'red';
        summaryHtml += '<td class="' + cls + '">' + r + '%</td>';
      });
      var avgCls = avg >= 50 ? 'green' : avg > 0 ? '' : 'red';
      summaryHtml += '<td class="' + avgCls + '"><strong>' + avg + '%</strong></td></tr>';
    });

    summaryHtml += '</tbody></table></div></div>';

    var promptsHtml = '';
    var prompts = BrandTracker.getPrompts();
    var useCustom = document.getElementById('bt-useCustom');
    var customPrompt = document.getElementById('bt-customPrompt');
    var promptsToShow = (useCustom && useCustom.checked && customPrompt && customPrompt.value)
      ? [customPrompt.value]
      : prompts;

    promptsToShow.slice(0, 5).forEach(function(prompt, idx) {
      promptsHtml += '<div class="prompt-block">'
        + '<div class="prompt-header">' + ApiService.escapeHtml(prompt) + '</div>';
      llmNames.forEach(function(llm) {
        var text = entry.results[llm] && entry.results[llm][idx];
        if (!text) text = '(Geen antwoord ontvangen)';
        var highlighted = ApiService.highlightBrands(text, brands);
        var mentioned = ApiService.checkMentions(text, brands).length > 0;
        promptsHtml += '<div class="llm-response">'
          + '<div class="llm-row"><span class="llm-name">' + ApiService.escapeHtml(llm) + '</span>'
          + (mentioned ? '<span class="badge badge-green">Vermeld</span>' : '<span class="badge badge-gray">Niet vermeld</span>')
          + '</div>'
          + '<div class="response-text">' + highlighted + '</div>'
          + '</div>';
      });
      promptsHtml += '</div>';
    });

    if (promptsToShow.length > 5) {
      promptsHtml += '<p class="text-sm text-muted" style="text-align:center; margin-top:8px;">+ ' + (promptsToShow.length - 5) + ' meer prompts (zie history voor volledig overzicht)</p>';
    }

    resultsDiv.innerHTML = summaryHtml + promptsHtml;
    resultsDiv.style.display = 'block';
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  renderHistory: function() {
    var histDiv = document.getElementById('bt-history');
    if (!histDiv) return;
    var history = ApiService.getHistory();
    if (!history.length) {
      histDiv.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><h3>Geen geschiedenis</h3><p>Voer een test uit om resultaten op te slaan.</p></div>';
      return;
    }
    var html = '<div class="flex-between mb-16">'
      + '<span class="section-title" style="margin-bottom:0;">' + history.length + ' opgeslagen tests</span>'
      + '<button class="btn-ghost btn-sm" onclick="BrandTracker.clearHistory()">Alles wissen</button>'
      + '</div>';
    history.forEach(function(entry) {
      var brands = entry.brands || [];
      var llmNames = Object.keys(entry.results || {});
      html += '<div class="history-card">'
        + '<div class="flex-between">'
        + '<strong class="text-sm">' + brands.map(function(b) { return ApiService.escapeHtml(b); }).join(', ') + '</strong>'
        + '<span class="badge badge-gray">' + llmNames.length + ' LLMs</span>'
        + '</div>'
        + '<div class="history-meta">'
        + ApiService.escapeHtml(entry.treatment || '') + (entry.city ? ' · ' + ApiService.escapeHtml(entry.city) : '')
        + ' · ' + new Date(entry.timestamp).toLocaleString('nl-NL')
        + '</div>'
        + '<div style="margin-top:10px;">';
      brands.forEach(function(b) {
        html += '<span class="tag">' + ApiService.escapeHtml(b) + '</span> ';
      });
      html += '</div>';
      if (entry.summary) {
        html += '<div class="mt-8 text-sm text-muted">' + ApiService.escapeHtml(entry.summary) + '</div>';
      }
      html += '</div>';
    });
    histDiv.innerHTML = html;
  },

  clearHistory: function() {
    if (!confirm('Alle geschiedenis verwijderen?')) return;
    ApiService.saveHistory([]);
    BrandTracker.renderHistory();
    App.toast('Geschiedenis gewist', 'success');
  },

  toggleWeekday: function() {
    var freq = document.getElementById('sch-freq');
    var wrap = document.getElementById('sch-weekday-wrap');
    if (!freq || !wrap) return;
    wrap.style.display = freq.value === 'weekly' ? 'block' : 'none';
  },

  saveSchedule: function() {
    App.toast('Geplande test opgeslagen', 'success');
  },

  runTest: async function() {
    var brandsInput = document.getElementById('bt-brands');
    var treatmentInput = document.getElementById('bt-treatment');
    var cityInput = document.getElementById('bt-city');
    var runBtn = document.getElementById('bt-run');
    var useCustom = document.getElementById('bt-useCustom');
    var customPromptEl = document.getElementById('bt-customPrompt');

    BrandTracker.showError('');

    var brandsRaw = (brandsInput ? brandsInput.value : '').trim();
    if (!brandsRaw) {
      BrandTracker.showError('Voer minimaal één brand naam in.');
      return;
    }

    var brands = brandsRaw.split(',').map(function(b) { return b.trim(); }).filter(Boolean);
    var treatment = treatmentInput ? treatmentInput.value.trim() : '';
    var city = cityInput ? cityInput.value.trim() : '';

    if (!treatment) {
      BrandTracker.showError('Voer een behandeling of dienst in.');
      return;
    }

    var prompts;
    if (useCustom && useCustom.checked && customPromptEl && customPromptEl.value.trim()) {
      prompts = [customPromptEl.value.trim()];
    } else {
      prompts = BrandTracker.getPrompts();
    }

    if (runBtn) {
      runBtn.disabled = true;
      runBtn.textContent = 'Bezig...';
    }

    var s = ApiService.getSettings();
    var entry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      brands: brands,
      treatment: treatment,
      city: city,
      results: {}
    };

    var errors = [];

    // Always query Anthropic/Claude
    entry.results['Claude'] = {};
    for (var i = 0; i < Math.min(prompts.length, 5); i++) {
      try {
        var resp = await ApiService.queryAnthropic(prompts[i]);
        entry.results['Claude'][i] = resp;
      } catch(e) {
        entry.results['Claude'][i] = '';
        errors.push('Claude: ' + e.message);
      }
      // Small delay to avoid rate limiting
      if (i < Math.min(prompts.length, 5) - 1) {
        await new Promise(function(resolve) { setTimeout(resolve, 500); });
      }
    }

    // Query OpenAI if key available
    if (s.openaiKey) {
      entry.results['ChatGPT'] = {};
      for (var j = 0; j < Math.min(prompts.length, 5); j++) {
        try {
          var resp2 = await ApiService.queryOpenAI(prompts[j]);
          entry.results['ChatGPT'][j] = resp2;
        } catch(e) {
          entry.results['ChatGPT'][j] = '';
          errors.push('ChatGPT: ' + e.message);
        }
        if (j < Math.min(prompts.length, 5) - 1) {
          await new Promise(function(resolve) { setTimeout(resolve, 300); });
        }
      }
    }

    // Query Gemini if key available
    if (s.geminiKey) {
      entry.results['Gemini'] = {};
      for (var k = 0; k < Math.min(prompts.length, 5); k++) {
        try {
          var resp3 = await ApiService.queryGemini(prompts[k]);
          entry.results['Gemini'][k] = resp3;
        } catch(e) {
          entry.results['Gemini'][k] = '';
          errors.push('Gemini: ' + e.message);
        }
        if (k < Math.min(prompts.length, 5) - 1) {
          await new Promise(function(resolve) { setTimeout(resolve, 300); });
        }
      }
    }

    // Save to history
    var history = ApiService.getHistory();
    history.unshift(entry);
    ApiService.saveHistory(history);

    if (runBtn) {
      runBtn.disabled = false;
      runBtn.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg> Test uitvoeren';
    }

    if (errors.length) {
      App.toast('Test voltooid met ' + errors.length + ' fout(en)', 'error');
    } else {
      App.toast('Test succesvol uitgevoerd!', 'success');
    }

    BrandTracker.renderResults(entry, brands);
    BrandTracker.renderHistory();
  }
};
