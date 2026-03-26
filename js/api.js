var ApiService = (function() {
  var SETTINGS_KEY = 'llm_tracker_settings';
  var HISTORY_KEY = 'llm_tracker_history';

  var DEFAULTS = { openaiKey: '', geminiKey: '', webSearch: true, alertThreshold: 30, autoRepeat: false, emailResults: false, darkMode: false, notifCritical: true, notifWeekly: true, notifBenchmark: false };

  function getSettings() {
    try {
      var s = localStorage.getItem(SETTINGS_KEY);
      var saved = s ? JSON.parse(s) : {};
      // Merge with defaults so new keys always exist
      return Object.assign({}, DEFAULTS, saved);
    } catch(e) { return Object.assign({}, DEFAULTS); }
  }
  function saveSettings(s) { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); }
  function getHistory() {
    try { var h = localStorage.getItem(HISTORY_KEY); return h ? JSON.parse(h) : []; } catch(e) { return []; }
  }
  function saveHistory(h) { localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(0, 200))); }

  function escapeHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
  function cleanMarkdown(str) {
    if (!str) return str;
    return str
      .replace(/#{1,6} /g,'')
      .replace(/\*\*(.+?)\*\*/g,'$1')
      .replace(/\*(.+?)\*/g,'$1')
      .replace(/^\s*[-*+]\s+/gm,'• ')
      .replace(/^\s*\d+\.\s+/gm,'')
      .trim();
  }
  function checkMentions(text, brands) {
    if (!text) return [];
    return brands.filter(function(b) { return text.toLowerCase().includes(b.toLowerCase()); });
  }
  function highlightBrands(text, brands) {
    text = cleanMarkdown(text);
    if (!brands.length || !text) return escapeHtml(text);
    var escaped = brands.map(function(b) { return b.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); });
    return escapeHtml(text).replace(
      new RegExp('(' + escaped.map(function(b) { return escapeHtml(b); }).join('|') + ')', 'gi'),
      '<mark>$1</mark>'
    );
  }

  async function queryAnthropic(prompt) {
    var s = getSettings();
    var body = { model: 'claude-sonnet-4-20250514', max_tokens: 2000, messages: [{ role: 'user', content: prompt }] };
    if (s.webSearch) body.tools = [{ type: 'web_search_20250305', name: 'web_search' }];
    var res = await fetch('https://llm-proxy.morten-ff3.workers.dev/', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    var data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.content.filter(function(b) { return b.type === 'text'; }).map(function(b) { return b.text; }).join('\n');
  }
  async function queryOpenAI(prompt) {
    var s = getSettings();
    var res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + s.openaiKey },
      body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], max_tokens: 1000 }),
    });
    var data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';
  }
  async function queryGemini(prompt) {
    var s = getSettings();
    var res = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + s.geminiKey,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) }
    );
    var data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text) || '';
  }

  return { getSettings, saveSettings, getHistory, saveHistory, escapeHtml, cleanMarkdown, checkMentions, highlightBrands, queryAnthropic, queryOpenAI, queryGemini };
})();
