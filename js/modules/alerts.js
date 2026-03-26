App.registerModule('alerts', {
  label: 'Alerts',
  icon: 'bell',

  _getAlerts: function() {
    var stored = localStorage.getItem('llm_tracker_alerts');
    if (stored) {
      try { return JSON.parse(stored); } catch(e) {}
    }
    // Seed defaults
    var defaults = [
      { id: 1, type: 'critical', title: 'beautyXL mention rate gedaald onder 25%', meta: 'Gemini · Vandaag 09:14 · Drempel: 30%', dismissed: false },
      { id: 2, type: 'warning',  title: 'Skinlab niet vermeld voor "cosmetische kliniek Amsterdam"', meta: 'ChatGPT · Gisteren 16:43', dismissed: false },
      { id: 3, type: 'warning',  title: 'Concurrent Kliniek XYZ overstijgt jouw score op Gemini', meta: 'Gemini · 2 dagen geleden', dismissed: false },
      { id: 4, type: 'success',  title: 'Skinlab mention rate boven 75% op Claude', meta: 'Claude · 3 dagen geleden', dismissed: false },
    ];
    localStorage.setItem('llm_tracker_alerts', JSON.stringify(defaults));
    return defaults;
  },

  _saveAlerts: function(alerts) {
    localStorage.setItem('llm_tracker_alerts', JSON.stringify(alerts));
  },

  _renderAlertsList: function() {
    var alertsListEl = document.getElementById('alerts-list-container');
    if (!alertsListEl) return;
    var alerts = this._getAlerts();
    var undismissed = alerts.filter(function(a) { return !a.dismissed; });

    var countEl = document.getElementById('alerts-count');
    if (countEl) countEl.textContent = undismissed.length + ' actieve melding' + (undismissed.length !== 1 ? 'en' : '');

    if (!undismissed.length) {
      alertsListEl.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#10003;</div><h3>Geen actieve meldingen</h3><p>Alle meldingen zijn verwerkt.</p></div>';
      return;
    }

    var dotClass = { critical: 'alert-dot-red', warning: 'alert-dot-yellow', success: 'alert-dot-green' };
    var html = '<div class="alert-list">';
    undismissed.forEach(function(alert) {
      html += '<div class="alert-item" data-alert-id="' + alert.id + '">'
        + '<div class="alert-dot ' + (dotClass[alert.type] || 'alert-dot-yellow') + '"></div>'
        + '<div class="alert-body">'
        + '<div class="alert-title">' + ApiService.escapeHtml(alert.title) + '</div>'
        + '<div class="alert-meta">' + ApiService.escapeHtml(alert.meta) + '</div>'
        + '</div>'
        + '<button class="alert-dismiss" data-dismiss-id="' + alert.id + '" title="Markeer als gelezen">'
        + '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
        + '</button>'
        + '</div>';
    });
    html += '</div>';
    alertsListEl.innerHTML = html;

    // Bind dismiss buttons
    var self = this;
    alertsListEl.querySelectorAll('[data-dismiss-id]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var id = parseInt(btn.dataset.dismissId);
        var alerts = self._getAlerts();
        alerts.forEach(function(a) { if (a.id === id) a.dismissed = true; });
        self._saveAlerts(alerts);
        self._renderAlertsList();
        var remaining = alerts.filter(function(a) { return !a.dismissed; }).length;
        App.updateNotificationBadge(remaining);
        App.toast('Melding verwerkt', 'success');
      });
    });
  },

  render: function() {
    return `
<div class="page-header">
  <div class="page-header-left">
    <h1>Alerts</h1>
    <p>Meldingen en drempelwaarden voor je brand monitoring</p>
  </div>
</div>

<div class="card mb-20">
  <div class="flex-between mb-16">
    <div class="card-title" id="alerts-count">0 actieve meldingen</div>
    <button class="btn-ghost btn-sm" id="alerts-mark-all">Alles markeren als gelezen</button>
  </div>
  <div id="alerts-list-container"></div>
</div>

<div class="card">
  <div class="card-title" style="margin-bottom:16px;">Alert regels</div>
  <div>
    <div class="toggle-row">
      <div>
        <div class="toggle-label">Mention rate daalt onder drempel</div>
        <div class="toggle-sub">Melding bij &lt;30% voor elk brand</div>
      </div>
      <label class="toggle">
        <input type="checkbox" checked />
        <span class="toggle-slider"></span>
      </label>
    </div>
    <div class="toggle-row">
      <div>
        <div class="toggle-label">Concurrent overtreft jouw score</div>
        <div class="toggle-sub">Vergelijk met gevolgde concurrenten</div>
      </div>
      <label class="toggle">
        <input type="checkbox" checked />
        <span class="toggle-slider"></span>
      </label>
    </div>
    <div class="toggle-row">
      <div>
        <div class="toggle-label">Nieuw keyword mist mention</div>
        <div class="toggle-sub">Waarschuw bij 0% op een nieuw zoekwoord</div>
      </div>
      <label class="toggle">
        <input type="checkbox" />
        <span class="toggle-slider"></span>
      </label>
    </div>
    <div class="toggle-row">
      <div>
        <div class="toggle-label">Wekelijkse samenvatting e-mail</div>
        <div class="toggle-sub">Elke maandag om 08:00</div>
      </div>
      <label class="toggle">
        <input type="checkbox" checked />
        <span class="toggle-slider"></span>
      </label>
    </div>
  </div>
</div>
    `;
  },

  init: function() {
    var self = this;
    self._renderAlertsList();

    var markAllBtn = document.getElementById('alerts-mark-all');
    if (markAllBtn) {
      markAllBtn.addEventListener('click', function() {
        var alerts = self._getAlerts();
        alerts.forEach(function(a) { a.dismissed = true; });
        self._saveAlerts(alerts);
        self._renderAlertsList();
        App.updateNotificationBadge(0);
        App.toast('Alle meldingen gemarkeerd als gelezen', 'success');
      });
    }
  }
});

window.AlertsModule = {
  checkAndCreateAlerts: function(entry, brands) {
    var s = ApiService.getSettings();
    var threshold = s.alertThreshold !== undefined ? s.alertThreshold : 30;
    var llmNames = Object.keys(entry.results || {});
    var newAlerts = [];

    brands.forEach(function(brand) {
      llmNames.forEach(function(llm) {
        var responses = entry.results[llm];
        var total = Object.keys(responses).length;
        if (!total) return;
        var mentions = Object.values(responses).filter(function(r) {
          return r && r.toLowerCase().includes(brand.toLowerCase());
        }).length;
        var rate = Math.round((mentions / total) * 100);

        if (rate === 0) {
          newAlerts.push({ type: 'critical', brand: brand, llm: llm, rate: rate, threshold: threshold });
        } else if (rate < threshold) {
          newAlerts.push({ type: 'warning', brand: brand, llm: llm, rate: rate, threshold: threshold });
        } else if (rate >= 75) {
          newAlerts.push({ type: 'success', brand: brand, llm: llm, rate: rate, threshold: threshold });
        }
      });
    });

    if (!newAlerts.length) return;

    var stored = localStorage.getItem('llm_tracker_alerts');
    var existing = [];
    try { existing = stored ? JSON.parse(stored) : []; } catch(e) { existing = []; }
    // Remove seeded dummy alerts on first real run
    existing = existing.filter(function(a) { return !!a.real; });

    var now = new Date();
    var timeStr = now.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' }) + ' ' + now.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
    var nextId = Date.now();

    newAlerts.forEach(function(a) {
      var title;
      if (a.type === 'critical') title = a.brand + ' niet vermeld door ' + a.llm + ' (0%)';
      else if (a.type === 'warning') title = a.brand + ' mention rate ' + a.rate + '% op ' + a.llm + ' (drempel: ' + a.threshold + '%)';
      else title = a.brand + ' mention rate ' + a.rate + '% op ' + a.llm;
      existing.unshift({ id: nextId++, type: a.type, title: title, meta: a.llm + ' · ' + timeStr, dismissed: false, real: true });
    });

    localStorage.setItem('llm_tracker_alerts', JSON.stringify(existing));
    var undismissed = existing.filter(function(a) { return !a.dismissed; }).length;
    App.updateNotificationBadge(undismissed);
  }
};
