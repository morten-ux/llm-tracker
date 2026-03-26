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
      <button class="filter-chip" data-llm="Claude">Claude</button>
      <button class="filter-chip" data-llm="ChatGPT">ChatGPT</button>
      <button class="filter-chip" data-llm="Gemini">Gemini</button>
    </div>
  </div>
</div>

<div class="stat-grid">
  <div class="stat-card">
    <div class="stat-label">Positief</div>
    <div class="stat-value" style="color:var(--green);" id="sent-pos">—</div>
    <div class="stat-delta delta-neutral">Van alle vermeldingen</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Neutraal</div>
    <div class="stat-value" style="color:var(--yellow);" id="sent-neu">—</div>
    <div class="stat-delta delta-neutral">Neutraal of gemengd</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Negatief</div>
    <div class="stat-value" style="color:var(--red);" id="sent-neg">—</div>
    <div class="stat-delta delta-neutral">Van alle vermeldingen</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Geanalyseerd</div>
    <div class="stat-value" id="sent-count">—</div>
    <div class="stat-delta delta-neutral">Zinnen met brand mention</div>
  </div>
</div>

<div class="grid2">
  <div class="card">
    <div class="card-title">Positieve termen</div>
    <div class="card-sub">Meest voorkomende positieve woorden</div>
    <div class="kw-grid" id="sent-pos-terms"></div>
  </div>
  <div class="card">
    <div class="card-title">Sentiment per LLM</div>
    <div class="card-sub">Percentage positieve toon</div>
    <div style="margin-top:16px;" id="sent-llm-bars"></div>
  </div>
</div>

<div class="card">
  <div class="card-title" style="margin-bottom:16px;">Recente citaten</div>
  <div id="sent-quotes"></div>
</div>
    `;
  },
  init: function() {
    var self = this;
    document.querySelectorAll('.filter-chip[data-llm]').forEach(function(chip) {
      chip.addEventListener('click', function() {
        document.querySelectorAll('.filter-chip[data-llm]').forEach(function(c) { c.classList.remove('active'); });
        chip.classList.add('active');
        SentimentModule.render(chip.dataset.llm === 'all' ? null : chip.dataset.llm);
      });
    });
    SentimentModule.render(null);
  }
});

window.SentimentModule = {
  POSITIVE_WORDS: ['betrouwbaar','betrouwbare','gespecialiseerd','professioneel','erkend','kwaliteit','aanraden','aanbevolen','beste','uitstekend','top','expert','excellent','great','good','outstanding','trusted','reliable','highly recommended','bekend','gerenommeerd','ervaren','vakkundig','deskundig','award','gecertificeerd','gecertificeerde'],
  NEGATIVE_WORDS: ['slecht','slechte','gevaarlijk','gevaarlijke','oplichten','oplichter','scam','nep','fake','unreliable','poor','bad','avoid','terrible','horrible','onbetrouwbaar','negatief','klacht','probleem'],

  _classifySentence: function(sentence) {
    var s = sentence.toLowerCase();
    var pos = this.POSITIVE_WORDS.filter(function(w) { return s.includes(w); }).length;
    var neg = this.NEGATIVE_WORDS.filter(function(w) { return s.includes(w); }).length;
    if (pos > neg) return 'positive';
    if (neg > pos) return 'negative';
    return 'neutral';
  },

  _extractMentions: function(text, brands) {
    if (!text || !brands.length) return [];
    var sentences = text.replace(/([.!?])\s+/g, '$1\n').split('\n');
    var results = [];
    sentences.forEach(function(s) {
      s = s.trim();
      if (!s || s.length < 20) return;
      var mentioned = brands.filter(function(b) { return s.toLowerCase().includes(b.toLowerCase()); });
      if (mentioned.length) results.push(s);
    });
    return results;
  },

  _countWords: function(sentences) {
    var counts = {};
    sentences.forEach(function(s) {
      SentimentModule.POSITIVE_WORDS.forEach(function(w) {
        if (s.toLowerCase().includes(w)) counts[w] = (counts[w] || 0) + 1;
      });
    });
    return counts;
  },

  render: function(llmFilter) {
    var history = ApiService.getHistory();
    var quotes = [];

    history.forEach(function(entry) {
      var brands = entry.brands || [];
      Object.keys(entry.results || {}).forEach(function(llm) {
        if (llmFilter && llm !== llmFilter) return;
        Object.values(entry.results[llm] || {}).forEach(function(r) {
          if (!r) return;
          var sents = SentimentModule._extractMentions(r, brands);
          sents.forEach(function(s) {
            quotes.push({
              text: s,
              llm: llm,
              treatment: entry.treatment || '',
              timestamp: entry.timestamp,
              sentiment: SentimentModule._classifySentence(s)
            });
          });
        });
      });
    });

    var total = quotes.length;
    var pos = quotes.filter(function(q) { return q.sentiment === 'positive'; }).length;
    var neg = quotes.filter(function(q) { return q.sentiment === 'negative'; }).length;
    var neu = total - pos - neg;

    document.getElementById('sent-count').textContent = total;
    document.getElementById('sent-pos').textContent = total ? Math.round(pos / total * 100) + '%' : '—';
    document.getElementById('sent-neu').textContent = total ? Math.round(neu / total * 100) + '%' : '—';
    document.getElementById('sent-neg').textContent = total ? Math.round(neg / total * 100) + '%' : '—';

    // Positive terms
    var wordCounts = this._countWords(quotes.map(function(q) { return q.text; }));
    var topWords = Object.keys(wordCounts).sort(function(a, b) { return wordCounts[b] - wordCounts[a]; }).slice(0, 8);
    var posTermsEl = document.getElementById('sent-pos-terms');
    if (posTermsEl) {
      posTermsEl.innerHTML = topWords.length ? topWords.map(function(w) {
        return '<div class="kw-chip" style="border-color:#86efac; background:#f0fdf4; color:#166534;">'
          + '<span>' + ApiService.escapeHtml(w) + '</span>'
          + '<span class="kw-count" style="background:#dcfce7; color:var(--green);">' + wordCounts[w] + 'x</span></div>';
      }).join('') : '<div style="font-size:13px; color:var(--text-3);">Nog geen data</div>';
    }

    // Per-LLM bars
    var allLLMs = [];
    history.forEach(function(e) { Object.keys(e.results || {}).forEach(function(llm) { if (!allLLMs.includes(llm)) allLLMs.push(llm); }); });
    var llmColors = { Claude: 'prog-fill-green', ChatGPT: 'prog-fill-blue', Gemini: 'prog-fill-orange' };
    var barsEl = document.getElementById('sent-llm-bars');
    if (barsEl) {
      var barsHtml = allLLMs.map(function(llm) {
        var llmQuotes = quotes.filter(function(q) { return q.llm === llm; });
        if (!llmQuotes.length) return '';
        var llmPos = llmQuotes.filter(function(q) { return q.sentiment === 'positive'; }).length;
        var rate = Math.round(llmPos / llmQuotes.length * 100);
        var cls = llmColors[llm] || '';
        return '<div class="prog-row"><div class="prog-label"><span>' + ApiService.escapeHtml(llm) + '</span><span style="color:var(--green);">' + rate + '%</span></div>'
          + '<div class="prog-track"><div class="prog-fill ' + cls + '" style="width:' + rate + '%;"></div></div></div>';
      }).join('');
      barsEl.innerHTML = barsHtml || '<div style="font-size:13px; color:var(--text-3); margin-top:12px;">Nog geen data</div>';
    }

    // Quotes
    var quotesEl = document.getElementById('sent-quotes');
    if (quotesEl) {
      var recent = quotes.slice(-20).reverse().slice(0, 10);
      if (!recent.length) {
        quotesEl.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#9786;</div><h3>Geen citaten</h3><p>Voer een test uit om sentimentdata te zien.</p></div>';
      } else {
        var dotClass = { positive: 'alert-dot-green', neutral: 'alert-dot-yellow', negative: 'alert-dot-red' };
        quotesEl.innerHTML = '<div class="alert-list">' + recent.map(function(q) {
          var date = new Date(q.timestamp).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' });
          var snippet = q.text.length > 200 ? q.text.slice(0, 200) + '…' : q.text;
          return '<div class="alert-item">'
            + '<div class="alert-dot ' + (dotClass[q.sentiment] || 'alert-dot-yellow') + '"></div>'
            + '<div class="alert-body">'
            + '<div class="alert-title">"' + ApiService.escapeHtml(snippet) + '"</div>'
            + '<div class="alert-meta">' + ApiService.escapeHtml(q.llm) + (q.treatment ? ' &middot; ' + ApiService.escapeHtml(q.treatment) : '') + ' &middot; ' + date + '</div>'
            + '</div></div>';
        }).join('') + '</div>';
      }
    }
  }
};
