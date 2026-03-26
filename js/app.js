var App = (function() {
  var _modules = {};
  var _current = null;

  var ICONS = {
    tag: '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><circle cx="7" cy="7" r="1" fill="currentColor" stroke="none"/>',
    barChart: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>',
    messageCircle: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    fileText: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    check: '<polyline points="20 6 9 20 4 15"/>',
    trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    trendingUp: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
    alertCircle: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
    play: '<polygon points="5 3 19 12 5 21 5 3"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    externalLink: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
    logOut: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
    zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    smile: '<circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>',
  };

  function icon(name, size) {
    var sz = size || 16;
    var paths = ICONS[name] || ICONS.grid;
    return '<svg viewBox="0 0 24 24" width="' + sz + '" height="' + sz + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + paths + '</svg>';
  }

  function registerModule(id, mod) { _modules[id] = mod; }

  function navigate(id) {
    if (!_modules[id]) return;
    _current = id;
    document.querySelectorAll('.nav-item').forEach(function(el) {
      el.classList.toggle('active', el.dataset.module === id);
    });
    var titleEl = document.getElementById('topbar-title');
    if (titleEl) titleEl.textContent = _modules[id].label;
    var content = document.getElementById('main-content');
    if (content) {
      content.innerHTML = _modules[id].render();
      if (_modules[id].init) _modules[id].init();
    }
    closeDropdowns();
  }

  function toast(msg, type) {
    var container = document.getElementById('toast-container');
    if (!container) return;
    var el = document.createElement('div');
    el.className = 'toast' + (type ? ' ' + type : '');
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(function() { if (el.parentNode) el.parentNode.removeChild(el); }, 3000);
  }

  function updateNotificationBadge(count) {
    var topbarBadge = document.getElementById('notif-badge');
    var sidebarBadge = document.getElementById('sidebar-alerts-badge');
    if (topbarBadge) {
      if (count > 0) { topbarBadge.textContent = count; topbarBadge.style.display = 'flex'; }
      else topbarBadge.style.display = 'none';
    }
    if (sidebarBadge) {
      if (count > 0) { sidebarBadge.textContent = count; sidebarBadge.style.display = ''; }
      else sidebarBadge.style.display = 'none';
    }
  }

  function closeDropdowns() {
    document.querySelectorAll('.avatar-dropdown, .search-dropdown').forEach(function(el) {
      el.classList.remove('open');
    });
  }

  function initTopbar() {
    var avatar = document.getElementById('topbar-avatar');
    var avatarDropdown = document.getElementById('avatar-dropdown');
    if (avatar) {
      avatar.addEventListener('click', function(e) {
        e.stopPropagation();
        avatarDropdown.classList.toggle('open');
        document.getElementById('search-dropdown').classList.remove('open');
      });
    }
    document.querySelectorAll('[data-avatar-action]').forEach(function(el) {
      el.addEventListener('click', function() {
        var action = el.dataset.avatarAction;
        if (action === 'settings') navigate('settings');
        if (action === 'dashboard') window.location.href = 'dashboard.html';
        closeDropdowns();
      });
    });
    var notifBtn = document.getElementById('notif-btn');
    if (notifBtn) notifBtn.addEventListener('click', function() { navigate('alerts'); });

    var searchInput = document.getElementById('topbar-search');
    var searchDropdown = document.getElementById('search-dropdown');
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        var q = searchInput.value.trim().toLowerCase();
        if (!q) { searchDropdown.classList.remove('open'); return; }
        var results = Object.keys(_modules).filter(function(id) {
          return _modules[id].label.toLowerCase().includes(q);
        });
        if (!results.length) { searchDropdown.classList.remove('open'); return; }
        searchDropdown.innerHTML = results.map(function(id) {
          var mod = _modules[id];
          return '<div class="search-result" data-module="' + id + '">'
            + '<span class="search-result-icon">' + icon(mod.icon || 'grid', 14) + '</span>'
            + '<span>' + mod.label + '</span>'
            + '</div>';
        }).join('');
        searchDropdown.classList.add('open');
      });
      searchDropdown.addEventListener('click', function(e) {
        var item = e.target.closest('[data-module]');
        if (item) { navigate(item.dataset.module); searchInput.value = ''; searchDropdown.classList.remove('open'); }
      });
      searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') { searchInput.value = ''; searchDropdown.classList.remove('open'); }
      });
    }
    document.addEventListener('click', closeDropdowns);
  }

  function init() {
    // Apply persisted dark mode before first render
    var s = ApiService.getSettings();
    if (s.darkMode) document.documentElement.classList.add('dark');
    initTopbar();
    navigate('brand-tracker');
    var alerts = JSON.parse(localStorage.getItem('llm_tracker_alerts') || '[]');
    updateNotificationBadge(alerts.filter(function(a) { return !a.dismissed; }).length);
  }

  return { registerModule: registerModule, navigate: navigate, toast: toast, updateNotificationBadge: updateNotificationBadge, icon: icon, init: init };
})();
