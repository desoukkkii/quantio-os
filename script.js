(() => {
  'use strict';

  const KEYS = {
    booted: 'quantio_booted',
    notes: 'quantio_notes',
    settings: 'quantio_settings',
    firstBoot: 'quantio_first_boot'
  };
  const DEFAULT_SETTINGS = {
    wallpaper: 'sunset',
    accentColor: '#0A84FF',
    theme: 'dark',
    dockSize: 1,
    showDesktopIcons: true
  };
  const WALLPAPERS = {
    sunset: { label: 'Sunset', colors: 'linear-gradient(135deg, #0f1115 0%, #1a1d2e 40%, #2a1e2e 70%, #0f1115 100%)' },
    ocean: { label: 'Ocean', colors: 'linear-gradient(135deg, #0a1628 0%, #0d2847 40%, #163a5c 70%, #0a1628 100%)' },
    forest: { label: 'Forest', colors: 'linear-gradient(135deg, #0a1a0f 0%, #142818 40%, #1a3a22 70%, #0a1a0f 100%)' },
    space: { label: 'Space', colors: 'linear-gradient(135deg, #050510 0%, #100820 40%, #1a0a2e 70%, #050510 100%)' },
    light: { label: 'Light', colors: 'linear-gradient(135deg, #d0d0d8 0%, #e8e8f0 40%, #f0f0f8 70%, #d0d0d8 100%)' }
  };
  const ACCENT_COLORS = ['#0A84FF', '#FF453A', '#30D158', '#FFD60A', '#BF5AF2', '#FF9F0A', '#64D2FF'];
  const DESKTOP_ICONS = [
    { id: 'finder', label: 'Finder', icon: '\uD83D\uDCC1' },
    { id: 'trash', label: 'Trash', icon: '\uD83D\uDDD1\uFE0F' }
  ];
  const DOCK_APPS = [
    { id: 'finder', label: 'Finder', icon: '\uD83D\uDCC1', desc: 'Browse files' },
    { id: 'terminal', label: 'Terminal', icon: '\uD83D\uDDA5\uFE0F', desc: 'Command line' },
    { id: 'calculator', label: 'Calculator', icon: '\uD83D\uDD22', desc: 'Calculate' },
    { id: 'notes', label: 'Notes', icon: '\uD83D\uDCDD', desc: 'Write notes' },
    { id: 'photos', label: 'Photos', icon: '\uD83D\uDDBC\uFE0F', desc: 'View photos' },
    { id: 'settings', label: 'Settings', icon: '\u2699\uFE0F', desc: 'System settings' }
  ];
  const SIDEBAR_ITEMS = [
    { id: 'recents', label: 'Recents', icon: '\u23F3' },
    { id: 'applications', label: 'Applications', icon: '\uD83D\uDCC2' },
    { id: 'documents', label: 'Documents', icon: '\uD83D\uDCC4' },
    { id: 'downloads', label: 'Downloads', icon: '\u2B07\uFE0F' },
    { id: 'desktop', label: 'Desktop', icon: '\uD83D\uDCBB' }
  ];
  const FINDER_FILES = [
    { name: 'Readme.txt', size: '2 KB', icon: '\uD83D\uDCC4' },
    { name: 'Project.pdf', size: '156 KB', icon: '\uD83D\uDCC1' },
    { name: 'Photo.png', size: '3.2 MB', icon: '\uD83D\uDDBC' },
    { name: 'Notes.md', size: '1 KB', icon: '\uD83D\uDCDD' },
    { name: 'Script.sh', size: '0.4 KB', icon: '\u2699' },
    { name: 'Data.csv', size: '12 KB', icon: '\uD83D\uDCCA' },
    { name: 'Archive.zip', size: '8.1 MB', icon: '\uD83D\uDCE6' },
    { name: 'Image.jpg', size: '456 KB', icon: '\uD83D\uDDBC' }
  ];
  const TERMINAL_COMMANDS = {
    help: { desc: 'Show available commands', fn: (args, term) => {
      const cmds = Object.entries(TERMINAL_COMMANDS).map(([k,v]) => `  ${k.padEnd(12)} ${v.desc}`).join('\n');
      term.writeln('Available commands:\n' + cmds);
    }},
    echo: { desc: 'Echo text', fn: (args, term) => term.writeln(args.join(' ') || '') },
    date: { desc: 'Show current date and time', fn: (args, term) => term.writeln(new Date().toString()) },
    whoami: { desc: 'Show current user', fn: (args, term) => term.writeln('quantio') },
    clear: { desc: 'Clear terminal', fn: (args, term) => term.clear() },
    ls: { desc: 'List files', fn: (args, term) => term.writeln('Applications  Desktop  Documents  Downloads  Music  Pictures  Movies') },
    pwd: { desc: 'Print working directory', fn: (args, term) => term.writeln('/Users/quantio') },
    neofetch: { desc: 'Show system info', fn: (args, term) => {
      term.writeln('  quantios@quantio');
      term.writeln('  -------------------');
      term.writeln('  OS: Quantio OS 1.0');
      term.writeln('  Browser: ' + navigator.userAgent.match(/(Chrome|Firefox|Safari|Edge)\/?\s*(\d+)/)?.[0] || 'Unknown');
      term.writeln('  Resolution: ' + window.innerWidth + 'x' + window.innerHeight);
      term.writeln('  Theme: ' + OS.state.settings.theme);
      term.writeln('  Accent: ' + OS.state.settings.accentColor);
    }},
    calc: { desc: 'Open calculator', fn: (args, term) => { OS.openApp('calculator'); term.writeln('Opening Calculator...'); }},
    notes: { desc: 'Open notes', fn: (args, term) => { OS.openApp('notes'); term.writeln('Opening Notes...'); }},
    uptime: { desc: 'Show system uptime', fn: (args, term) => {
      if (!OS.state.bootTime) { term.writeln('System just started'); return; }
      const diff = Date.now() - OS.state.bootTime;
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      term.writeln(`${h}h ${m}m ${s}s`);
    }},
    theme: { desc: 'Change accent color (theme <color>)', fn: (args, term) => {
      if (!args[0]) { term.writeln('Usage: theme <color>'); term.writeln('Colors: ' + ACCENT_COLORS.join(', ')); return; }
      const c = args[0].toLowerCase();
      const colorMap = { blue: '#0A84FF', red: '#FF453A', green: '#30D158', yellow: '#FFD60A', purple: '#BF5AF2', orange: '#FF9F0A', cyan: '#64D2FF' };
      const hex = colorMap[c] || (c.startsWith('#') ? c : null);
      if (hex && /^#[0-9a-f]{6}$/i.test(hex)) {
        OS.updateSettings({ accentColor: hex });
        term.writeln('Accent color changed to ' + hex);
      } else {
        term.writeln('Unknown color. Try: blue, red, green, yellow, purple, orange, cyan');
      }
    }},
    wall: { desc: 'Change wallpaper (wall <name>)', fn: (args, term) => {
      if (!args[0]) { term.writeln('Available: ' + Object.keys(WALLPAPERS).join(', ')); return; }
      const name = args[0].toLowerCase();
      if (WALLPAPERS[name]) {
        OS.updateSettings({ wallpaper: name });
        term.writeln('Wallpaper set to ' + name);
      } else {
        term.writeln('Unknown wallpaper. Try: sunset, ocean, forest, space, light');
      }
    }}
  };
  const CALC_LAYOUT = [
    ['C', '\u00B1', '%', '\u00F7'],
    ['7', '8', '9', '\u00D7'],
    ['4', '5', '6', '\u2212'],
    ['1', '2', '3', '+'],
    ['0', '.', '\u2190', '=']
  ];
  const PHOTOS_SVGS = [
    { name: 'Mountain', svg: '<svg viewBox="0 0 200 120"><rect width="200" height="120" fill="#1a1d2e"/><polygon points="40,100 100,30 160,100" fill="#2a3d5c" stroke="#0A84FF" stroke-width="1"/><polygon points="80,100 120,50 160,100" fill="#3a4d6e" stroke="#0A84FF" stroke-width="0.5"/><rect y="100" width="200" height="20" fill="#0f1115" opacity="0.6"/><circle cx="140" cy="25" r="8" fill="#FFD60A" opacity="0.7"/></svg>' },
    { name: 'Ocean', svg: '<svg viewBox="0 0 200 120"><rect width="200" height="120" fill="#0a1628"/><ellipse cx="100" cy="100" rx="90" ry="25" fill="#0d2847"/><ellipse cx="60" cy="105" rx="50" ry="12" fill="#163a5c"/><ellipse cx="140" cy="95" rx="40" ry="10" fill="#1a4a6e"/><circle cx="50" cy="35" r="15" fill="#FFD60A" opacity="0.9"/><ellipse cx="50" cy="40" rx="20" ry="6" fill="#FFD60A" opacity="0.15"/></svg>' },
    { name: 'Forest', svg: '<svg viewBox="0 0 200 120"><rect width="200" height="120" fill="#0a1a0f"/><rect x="40" y="60" width="6" height="50" fill="#3a2a1a"/><ellipse cx="43" cy="55" rx="20" ry="25" fill="#142818"/><ellipse cx="43" cy="45" rx="15" ry="18" fill="#1a3822"/><rect x="120" y="70" width="5" height="40" fill="#3a2a1a"/><ellipse cx="122" cy="65" rx="16" ry="20" fill="#1a3822"/><ellipse cx="122" cy="55" rx="12" ry="14" fill="#204a2a"/><rect x="80" y="80" width="4" height="30" fill="#3a2a1a"/><ellipse cx="82" cy="75" rx="12" ry="15" fill="#18301e"/><rect y="105" width="200" height="15" fill="#0a1a0f" opacity="0.5"/></svg>' },
    { name: 'Space', svg: '<svg viewBox="0 0 200 120"><rect width="200" height="120" fill="#050510"/><circle cx="30" cy="20" r="1.5" fill="#fff" opacity="0.8"/><circle cx="80" cy="45" r="1" fill="#fff" opacity="0.6"/><circle cx="150" cy="15" r="2" fill="#fff" opacity="0.9"/><circle cx="170" cy="60" r="1" fill="#fff" opacity="0.5"/><circle cx="50" cy="80" r="1.5" fill="#fff" opacity="0.7"/><circle cx="130" cy="90" r="1" fill="#fff" opacity="0.4"/><circle cx="190" cy="35" r="1" fill="#fff" opacity="0.6"/><circle cx="100" cy="60" r="20" fill="#1a0a3a"/><circle cx="100" cy="60" r="14" fill="#2a1a5a" opacity="0.8"/><circle cx="100" cy="60" r="6" fill="#4a3a7a"/><circle cx="100" cy="60" r="3" fill="#8a7aba"/></svg>' },
    { name: 'Abstract', svg: '<svg viewBox="0 0 200 120"><rect width="200" height="120" fill="#0f1115"/><circle cx="40" cy="35" r="30" fill="#0A84FF" opacity="0.15"/><circle cx="160" cy="85" r="35" fill="#BF5AF2" opacity="0.15"/><circle cx="100" cy="60" r="25" fill="#FFD60A" opacity="0.1"/><line x1="10" y1="100" x2="190" y2="20" stroke="#0A84FF" stroke-width="0.5" opacity="0.2"/><line x1="20" y1="50" x2="180" y2="90" stroke="#BF5AF2" stroke-width="0.5" opacity="0.15"/><rect x="75" y="45" width="50" height="30" rx="4" fill="none" stroke="#0A84FF" stroke-width="0.5" opacity="0.3"/></svg>' },
    { name: 'Sunset', svg: '<svg viewBox="0 0 200 120"><rect width="200" height="120" fill="#0f1115"/><rect y="80" width="200" height="40" fill="#1a1d2e"/><circle cx="100" cy="85" r="28" fill="#FF9F0A" opacity="0.6"/><circle cx="100" cy="85" r="22" fill="#FFD60A" opacity="0.3"/><rect y="80" width="200" height="40" fill="#1a1a2a" opacity="0.4"/><line x1="30" y1="50" x2="50" y2="70" stroke="#FF9F0A" stroke-width="0.5" opacity="0.2"/><line x1="100" y1="35" x2="100" y2="55" stroke="#FF9F0A" stroke-width="0.5" opacity="0.15"/><line x1="170" y1="50" x2="150" y2="70" stroke="#FF9F0A" stroke-width="0.5" opacity="0.2"/></svg>' }
  ];

  const OS = {
    state: {
      booted: false,
      locked: true,
      bootTime: null,
      settings: { ...DEFAULT_SETTINGS },
      activeApp: null,
      focusedWindow: null,
      windowZIndex: 100,
      runningApps: new Set(),
      windowCount: 0,
      minimizedWindows: new Map()
    },
    els: {},
    classes: {},

    init() {
      this.loadSettings();
      this.cacheEls();
      this.applyTheme();
      this.classes.boot = new Boot();
      this.classes.lock = new LockScreen();
      this.classes.desktop = new Desktop();
      this.classes.menubar = new MenuBar();
      this.classes.dock = new Dock();
      this.classes.wm = new WindowManager();
      this.classes.spotlight = new Spotlight();
      this.classes.ctx = new ContextMenu();
      this.classes.notif = new NotificationManager();
      this.classes.boot.start();
    },

    cacheEls() {
      const g = id => document.getElementById(id);
      const q = s => document.querySelector(s);
      this.els.bootScreen = g('boot-screen');
      this.els.bootBar = g('boot-bar');
      this.els.bootStatus = g('boot-status');
      this.els.lockScreen = g('lock-screen');
      this.els.lockTime = g('lock-time');
      this.els.lockDate = g('lock-date');
      this.els.lockBtn = g('lock-btn');
      this.els.desktop = g('desktop');
      this.els.desktopWallpaper = g('desktop-wallpaper');
      this.els.desktopIcons = g('desktop-icons');
      this.els.menubar = g('menubar');
      this.els.menubarAppName = g('menubar-app-name');
      this.els.menubarClock = g('menubar-clock');
      this.els.appleBtn = g('apple-btn');
      this.els.appleDropdown = g('apple-dropdown');
      this.els.windowContainer = g('window-container');
      this.els.spotlight = g('spotlight');
      this.els.spotlightInput = g('spotlight-input');
      this.els.spotlightResults = g('spotlight-results');
      this.els.contextMenu = g('context-menu');
      this.els.notifContainer = g('notification-container');
    },

    loadSettings() {
      try {
        const saved = localStorage.getItem(KEYS.settings);
        if (saved) this.state.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {}
    },

    saveSettings() {
      try { localStorage.setItem(KEYS.settings, JSON.stringify(this.state.settings)); } catch (e) {}
    },

    updateSettings(partial) {
      Object.assign(this.state.settings, partial);
      this.saveSettings();
      this.applyTheme();
      this.classes.dock?.render();
      if (this.state.settings.showDesktopIcons) {
        this.classes.desktop?.renderIcons();
      } else {
        if (this.els.desktopIcons) this.els.desktopIcons.innerHTML = '';
      }
    },

    applyTheme() {
      const s = this.state.settings;
      const root = document.documentElement;
      root.style.setProperty('--accent', s.accentColor);
      root.style.setProperty('--accent-hover', s.accentColor + 'cc');
      root.style.setProperty('--accent-glass', s.accentColor + '26');
      root.style.setProperty('--accent-glass-hover', s.accentColor + '40');
      this.updateWallpaper();
    },

    updateWallpaper() {
      const wp = WALLPAPERS[this.state.settings.wallpaper] || WALLPAPERS.sunset;
      this.els.desktopWallpaper.style.backgroundImage = wp.colors;
      document.querySelector('#lock-screen').style.backgroundImage = wp.colors;
    },

    openApp(id, opts = {}) {
      const app = DOCK_APPS.find(a => a.id === id);
      if (!app) return;
      this.state.runningApps.add(id);
      this.classes.wm.createWindow(id, opts);
      this.classes.dock.render();
      this.state.activeApp = id;
      this.updateMenubarApp();
    },

    focusApp(id) {
      this.state.activeApp = id;
      this.updateMenubarApp();
      this.classes.dock.render();
    },

    updateMenubarApp() {
      const app = DOCK_APPS.find(a => a.id === this.state.activeApp);
      this.els.menubarAppName.textContent = app ? app.label : 'Finder';
    },

    closeApp(id) {
      if (this.classes.wm.getWindowsByApp(id).length === 0) {
        this.state.runningApps.delete(id);
        this.classes.dock.render();
      }
    },

    notify(title, msg, icon = '\uD83D\uDD14') {
      this.classes.notif.add(title, msg, icon);
    }
  };

  class Boot {
    start() {
      OS.state.bootTime = Date.now();
      const bar = OS.els.bootBar;
      const status = OS.els.bootStatus;
      const steps = [
        { pct: 15, text: 'Initializing kernel...' },
        { pct: 30, text: 'Loading system services...' },
        { pct: 50, text: 'Configuring display...' },
        { pct: 70, text: 'Starting window server...' },
        { pct: 85, text: 'Launching dock...' },
        { pct: 100, text: 'Ready' }
      ];
      let i = 0;
      const tick = () => {
        if (i >= steps.length) {
          setTimeout(() => {
            OS.els.bootScreen.classList.add('hidden');
            OS.state.booted = true;
            OS.classes.lock.show();
          }, 300);
          return;
        }
        const s = steps[i];
        bar.style.width = s.pct + '%';
        status.textContent = s.text;
        i++;
        setTimeout(tick, 300 + Math.random() * 200);
      };
      tick();
    }
  }

  class LockScreen {
    show() {
      OS.els.lockScreen.classList.remove('hidden');
      OS.state.locked = true;
      this.updateClock();
      this.timer = setInterval(() => this.updateClock(), 1000);
      OS.els.lockBtn.addEventListener('click', () => this.unlock());
      document.addEventListener('keydown', this._keyHandler = e => {
        if (e.key === 'Enter') this.unlock();
      });
    }

    updateClock() {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      OS.els.lockTime.textContent = `${h}:${m}`;
      const opts = { weekday: 'long', month: 'long', day: 'numeric' };
      OS.els.lockDate.textContent = now.toLocaleDateString('en-US', opts);
    }

    unlock() {
      OS.els.lockScreen.classList.add('hidden');
      OS.els.desktop.classList.remove('hidden');
      OS.state.locked = false;
      clearInterval(this.timer);
      document.removeEventListener('keydown', this._keyHandler);
      OS.classes.desktop.render();
      OS.classes.menubar.start();
      OS.classes.dock.render();
      OS.notify('Welcome', 'Quantio OS is ready', '\uD83D\uDE80');
    }
  }

  class Desktop {
    render() {
      this.renderIcons();
      this.setupClickDismiss();
    }

    renderIcons() {
      if (!OS.state.settings.showDesktopIcons) { OS.els.desktopIcons.innerHTML = ''; return; }
      OS.els.desktopIcons.innerHTML = DESKTOP_ICONS.map(ic =>
        `<div class="desktop-icon" data-app="${ic.id}">
          <div class="icon-img">${ic.icon}</div>
          <div class="icon-label">${ic.label}</div>
        </div>`
      ).join('');
      OS.els.desktopIcons.querySelectorAll('.desktop-icon').forEach(el => {
        el.addEventListener('dblclick', () => {
          const id = el.dataset.app;
          if (id === 'finder') OS.openApp('finder');
          else if (id === 'trash') OS.notify('Trash', 'Trash is empty');
        });
        el.addEventListener('click', e => {
          document.querySelectorAll('.desktop-icon.selected').forEach(x => x.classList.remove('selected'));
          el.classList.add('selected');
        });
      });
    }

    setupClickDismiss() {
      document.addEventListener('click', e => {
        if (!e.target.closest('.desktop-icon')) {
          document.querySelectorAll('.desktop-icon.selected').forEach(x => x.classList.remove('selected'));
        }
        if (!e.target.closest('.apple-dropdown') && !e.target.closest('#apple-btn')) {
          OS.els.appleDropdown.classList.remove('open');
        }
        if (!e.target.closest('#context-menu')) {
          OS.els.contextMenu.style.display = 'none';
        }
        if (!e.target.closest('#spotlight') && !e.target.closest('.menubar-item[data-action="spotlight"]')) {
          OS.classes.spotlight.close();
        }
      });
      document.addEventListener('contextmenu', e => {
        if (!e.target.closest('.window') && !e.target.closest('#dock') && !e.target.closest('#menubar')) {
          e.preventDefault();
          OS.classes.ctx.show(e.clientX, e.clientY);
        }
      });
    }
  }

  class MenuBar {
    start() {
      this.updateClock();
      this.clockTimer = setInterval(() => this.updateClock(), 30000);
      this.setupListeners();
    }

    updateClock() {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      const d = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      OS.els.menubarClock.textContent = `${d} ${h}:${m}`;
    }

    setupListeners() {
      document.querySelectorAll('.menubar-item').forEach(el => {
        el.addEventListener('click', e => {
          const action = el.dataset.action;
          if (action === 'spotlight') OS.classes.spotlight.toggle();
          if (action === 'fullscreen') {
            if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
            else document.exitFullscreen?.();
          }
        });
      });
      OS.els.appleBtn.addEventListener('click', e => {
        e.stopPropagation();
        OS.els.appleDropdown.classList.toggle('open');
      });
      document.querySelectorAll('.apple-item').forEach(el => {
        el.addEventListener('click', () => {
          OS.els.appleDropdown.classList.remove('open');
          const action = el.dataset.action;
          if (action === 'about') OS.notify('Quantio OS', 'Version 1.0 \u00B7 Built with web technologies');
          if (action === 'sleep') { OS.classes.lock.show(); }
          if (action === 'restart') { location.reload(); }
          if (action === 'shutdown') { document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#000;color:#fff;font-family:system-ui;font-size:18px;flex-direction:column;gap:16px"><span>\u23F9\uFE0F</span><span>Shut Down</span></div>'; }
        });
      });
    }
  }

  class Dock {
    render() {
      const container = document.querySelector('.dock-items');
      if (!container) return;
      container.innerHTML = DOCK_APPS.map(a => {
        const running = OS.state.runningApps.has(a.id);
        const active = OS.state.activeApp === a.id;
        return `<div class="dock-item ${running ? 'running' : ''} ${active ? 'active' : ''}" data-app="${a.id}">
          <div class="dock-icon">${a.icon}</div>
          <div class="dock-label">${a.label}</div>
          <div class="dock-dot"></div>
        </div>`;
      }).join('');
      container.querySelectorAll('.dock-item').forEach(el => {
        const id = el.dataset.app;
        el.addEventListener('click', () => {
          const wm = OS.classes.wm;
          const existing = wm.getWindowsByApp(id);
          if (existing.length > 0) {
            const firstClosed = existing.find(w => w.minimized);
            const firstOpen = existing.find(w => !w.minimized);
            if (firstClosed) { wm.restoreWindow(firstClosed.id); }
            else if (firstOpen) { wm.focus(firstOpen.id); }
            else { wm.focus(existing[0].id); }
          } else {
            OS.openApp(id);
          }
        });
        el.addEventListener('contextmenu', e => {
          e.preventDefault();
          e.stopPropagation();
          const id = el.dataset.app;
          const existing = OS.classes.wm.getWindowsByApp(id);
          const items = [];
          if (OS.state.runningApps.has(id)) {
            items.push({ label: 'Hide', action: () => {
              existing.forEach(w => { if (!w.minimized) OS.classes.wm.minimize(w.id); });
            }});
            items.push({ label: 'Quit', action: () => {
              existing.forEach(w => OS.classes.wm.close(w.id));
              OS.state.runningApps.delete(id);
              OS.classes.dock.render();
            }});
          } else {
            items.push({ label: 'Open', action: () => OS.openApp(id) });
          }
          OS.classes.ctx.show(e.clientX, e.clientY, items);
        });
      });
    }
  }

  class WindowManager {
    constructor() {
      this.windows = new Map();
      this._idCounter = 0;
      this._dragState = null;
      this._resizeState = null;
      this._maximizedWindows = new Map();
    }

    createWindow(appId, opts = {}) {
      const app = DOCK_APPS.find(a => a.id === appId);
      if (!app) return null;

      const id = `win-${++this._idCounter}`;
      OS.state.windowZIndex += 2;
      const zIndex = OS.state.windowZIndex;
      const win = {
        id, appId, zIndex, minimized: false,
        title: app.label, icon: app.icon,
        focused: true,
        rect: {
          x: 80 + (this._idCounter % 6) * 30,
          y: 40 + (this._idCounter % 6) * 25,
          w: opts.width || 540,
          h: opts.height || 380
        }
      };
      this.windows.set(id, win);
      this.renderWindow(win);
      this.focus(id);
      OS.focusApp(appId);
      return id;
    }

    getWindowsByApp(appId) {
      return Array.from(this.windows.values()).filter(w => w.appId === appId);
    }

    focus(id) {
      const win = this.windows.get(id);
      if (!win || win.minimized) return;
      this.windows.forEach(w => w.focused = false);
      win.focused = true;
      OS.state.windowZIndex += 2;
      win.zIndex = OS.state.windowZIndex;
      const el = document.getElementById(id);
      if (el) {
        el.style.zIndex = win.zIndex;
        el.classList.add('focused');
        document.querySelectorAll('.window.focused').forEach(e => { if (e.id !== id) e.classList.remove('focused'); });
      }
      OS.focusApp(win.appId);
    }

    close(id) {
      const win = this.windows.get(id);
      if (!win) return;
      const el = document.getElementById(id);
      if (el) {
        el.classList.add('closing');
        setTimeout(() => {
          el.remove();
          this.windows.delete(id);
          this.afterClose(win);
        }, 120);
      } else {
        this.windows.delete(id);
        this.afterClose(win);
      }
    }

    afterClose(win) {
      if (this.windows.size === 0) {
        OS.state.activeApp = null;
        OS.els.menubarAppName.textContent = 'Finder';
        OS.classes.dock.render();
      } else {
        const last = Array.from(this.windows.values()).filter(w => !w.minimized).pop();
        if (last) this.focus(last.id);
        else if (OS.state.activeApp !== OS.classes.dock?.getLastActive?.()) {
          // fallback: focus any non-minimized window
          const any = Array.from(this.windows.values()).find(w => !w.minimized);
          if (any) this.focus(any.id);
        }
      }
      OS.closeApp(win.appId);
    }

    minimize(id) {
      const win = this.windows.get(id);
      if (!win) return;
      win.minimized = true;
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
      const next = Array.from(this.windows.values()).find(w => !w.minimized);
      if (next) this.focus(next.id);
      else {
        OS.state.activeApp = null;
        OS.els.menubarAppName.textContent = 'Finder';
      }
      OS.classes.dock.render();
    }

    restoreWindow(id) {
      const win = this.windows.get(id);
      if (!win || !win.minimized) return;
      const el = document.getElementById(id);
      if (el) el.style.display = 'flex';
      win.minimized = false;
      this.focus(id);
      OS.classes.dock.render();
    }

    toggleMaximize(id) {
      const win = this.windows.get(id);
      if (!win) return;
      const el = document.getElementById(id);
      if (!el) return;
      if (this._maximizedWindows.has(id)) {
        const prev = this._maximizedWindows.get(id);
        win.rect = prev;
        this._maximizedWindows.delete(id);
        el.style.left = prev.x + 'px';
        el.style.top = prev.y + 'px';
        el.style.width = prev.w + 'px';
        el.style.height = prev.h + 'px';
        el.style.borderRadius = '';
      } else {
        this._maximizedWindows.set(id, { ...win.rect });
        const container = OS.els.windowContainer.getBoundingClientRect();
        win.rect.x = 0; win.rect.y = 0;
        win.rect.w = container.width;
        win.rect.h = container.height;
        el.style.left = '0px';
        el.style.top = '0px';
        el.style.width = '100%';
        el.style.height = '100%';
        el.style.borderRadius = '0';
      }
    }

    renderWindow(win) {
      const d = document.createElement('div');
      d.id = win.id;
      d.className = 'window' + (win.focused ? ' focused' : '');
      d.style.cssText = `left:${win.rect.x}px;top:${win.rect.y}px;width:${win.rect.w}px;height:${win.rect.h}px;z-index:${win.zIndex}`;

      const titlebar = document.createElement('div');
      titlebar.className = 'window-titlebar';

      const controls = document.createElement('div');
      controls.className = 'win-controls';
      ['close','minimize','maximize'].forEach(action => {
        const btn = document.createElement('button');
        btn.className = `win-btn win-${action}`;
        btn.dataset.action = action;
        btn.addEventListener('click', e => {
          e.stopPropagation();
          if (action === 'close') this.close(win.id);
          else if (action === 'minimize') this.minimize(win.id);
          else if (action === 'maximize') this.toggleMaximize(win.id);
        });
        controls.appendChild(btn);
      });
      titlebar.appendChild(controls);

      const title = document.createElement('div');
      title.className = 'win-title';
      title.textContent = win.icon + ' ' + win.title;
      titlebar.appendChild(title);

      const content = document.createElement('div');
      content.className = 'window-content';
      content.id = win.id + '-content';
      this.buildContent(win.appId, content);

      const resizeDirs = ['n','s','e','w','ne','nw','se','sw'];
      resizeDirs.forEach(dir => {
        const r = document.createElement('div');
        r.className = `window-resize ${dir}`;
        r.addEventListener('mousedown', e => this.startResize(e, win.id, dir));
        d.appendChild(r);
      });

      d.appendChild(titlebar);
      d.appendChild(content);

      d.addEventListener('mousedown', () => this.focus(win.id));

      this.setupDrag(d, win);
      OS.els.windowContainer.appendChild(d);
    }

    setupDrag(el, win) {
      const tb = el.querySelector('.window-titlebar');
      tb.addEventListener('mousedown', e => {
        if (e.target.closest('.win-btn')) return;
        if (this._maximizedWindows.has(win.id)) return;
        this._dragState = { el, win, startX: e.clientX, startY: e.clientY, origX: win.rect.x, origY: win.rect.y };
        document.addEventListener('mousemove', this._dragMove = e => this.onDrag(e));
        document.addEventListener('mouseup', this._dragEnd = () => this.endDrag());
        e.preventDefault();
      });
    }

    onDrag(e) {
      if (!this._dragState) return;
      const { win, startX, startY, origX, origY } = this._dragState;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      win.rect.x = origX + dx;
      win.rect.y = origY + dy;
      const el = document.getElementById(win.id);
      if (el) {
        el.style.left = win.rect.x + 'px';
        el.style.top = win.rect.y + 'px';
      }
    }

    endDrag() {
      this._dragState = null;
      document.removeEventListener('mousemove', this._dragMove);
      document.removeEventListener('mouseup', this._dragEnd);
    }

    startResize(e, id, dir) {
      const win = this.windows.get(id);
      if (!win) return;
      if (this._maximizedWindows.has(id)) return;
      e.preventDefault();
      this._resizeState = {
        win, dir, startX: e.clientX, startY: e.clientY,
        origX: win.rect.x, origY: win.rect.y,
        origW: win.rect.w, origH: win.rect.h
      };
      document.addEventListener('mousemove', this._resizeMove = e => this.onResize(e));
      document.addEventListener('mouseup', this._resizeEnd = () => this.endResize());
    }

    onResize(e) {
      if (!this._resizeState) return;
      const { win, dir, startX, startY, origX, origY, origW, origH } = this._resizeState;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      let x = origX, y = origY, w = origW, h = origH;
      if (dir.includes('e')) { w = Math.max(320, origW + dx); }
      if (dir.includes('w')) { w = Math.max(320, origW - dx); x = origX + (origW - w); }
      if (dir.includes('s')) { h = Math.max(180, origH + dy); }
      if (dir.includes('n')) { h = Math.max(180, origH - dy); y = origY + (origH - h); }
      win.rect = { x, y, w, h };
      const el = document.getElementById(win.id);
      if (el) {
        el.style.left = x + 'px'; el.style.top = y + 'px';
        el.style.width = w + 'px'; el.style.height = h + 'px';
      }
    }

    endResize() {
      this._resizeState = null;
      document.removeEventListener('mousemove', this._resizeMove);
      document.removeEventListener('mouseup', this._resizeEnd);
    }

    buildContent(appId, el) {
      const builders = {
        finder: () => this.buildFinder(el),
        terminal: () => this.buildTerminal(el),
        calculator: () => this.buildCalculator(el),
        notes: () => this.buildNotes(el),
        photos: () => this.buildPhotos(el),
        settings: () => this.buildSettings(el)
      };
      if (builders[appId]) builders[appId]();
      else el.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-tertiary);font-size:13px">${appId} app</div>`;
    }

    buildFinder(el) {
      el.innerHTML = `<div class="finder">
        <div class="finder-sidebar" id="finder-sidebar"></div>
        <div class="finder-main">
          <div class="app-toolbar">
            <button id="finder-back" disabled>\u2190</button>
            <button id="finder-forward" disabled>\u2192</button>
            <button id="finder-grid">\u25A6</button>
          </div>
          <div class="finder-files" id="finder-files"></div>
          <div class="app-bar"><span>${FINDER_FILES.length} items</span></div>
        </div>
      </div>`;
      const sidebar = el.querySelector('#finder-sidebar');
      sidebar.innerHTML = SIDEBAR_ITEMS.map(it =>
        `<div class="finder-nav ${it.id === 'documents' ? 'active' : ''}">
          <span class="fn-icon">${it.icon}</span>
          <span>${it.label}</span>
        </div>`
      ).join('');
      sidebar.querySelectorAll('.finder-nav').forEach(n => {
        n.addEventListener('click', () => {
          sidebar.querySelectorAll('.finder-nav').forEach(x => x.classList.remove('active'));
          n.classList.add('active');
        });
      });
      const filesEl = el.querySelector('#finder-files');
      filesEl.innerHTML = FINDER_FILES.map(f =>
        `<div class="finder-item">
          <div class="fi-icon">${f.icon}</div>
          <div class="fi-name">${f.name}</div>
          <div class="fi-size">${f.size}</div>
        </div>`
      ).join('');
    }

    buildTerminal(el) {
      el.innerHTML = `<div class="terminal">
        <div class="terminal-output" id="term-output"></div>
        <div class="term-input-line">
          <span class="term-prompt">quantio@os ~ %</span>
          <input class="term-input" id="term-input" type="text" autofocus spellcheck="false" autocomplete="off">
        </div>
      </div>`;
      const output = el.querySelector('#term-output');
      const input = el.querySelector('#term-input');
      const term = {
        writeln: (text) => {
          const line = document.createElement('div');
          line.className = 'term-line';
          line.textContent = text;
          output.appendChild(line);
          output.scrollTop = output.scrollHeight;
        },
        clear: () => { output.innerHTML = ''; }
      };
      term.writeln('Welcome to Quantio OS Terminal v1.0');
      term.writeln('Type "help" for available commands.\n');

      input.addEventListener('keydown', e => {
        if (e.key !== 'Enter') return;
        const val = input.value.trim();
        input.value = '';
        const prompt = document.createElement('div');
        prompt.className = 'term-line';
        prompt.textContent = `quantio@os ~ % ${val}`;
        output.appendChild(prompt);
        if (val) {
          const parts = val.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
          const cmd = parts[0]?.toLowerCase();
          const args = parts.slice(1).map(a => a.replace(/^"(.*)"$/, '$1'));
          const command = TERMINAL_COMMANDS[cmd];
          if (command) {
            try { command.fn(args, term); } catch (err) { term.writeln('Error: ' + err.message); }
          } else {
            term.writeln(`zsh: command not found: ${cmd}`);
          }
        }
        output.scrollTop = output.scrollHeight;
      });

      el.addEventListener('click', () => input.focus());
    }

    buildCalculator(el) {
      el.innerHTML = `<div class="calculator">
        <div class="calc-display">
          <div class="calc-expr" id="calc-expr"></div>
          <div class="calc-result" id="calc-result">0</div>
        </div>
        <div class="calc-grid" id="calc-grid"></div>
      </div>`;
      const grid = el.querySelector('#calc-grid');
      const resultEl = el.querySelector('#calc-result');
      const exprEl = el.querySelector('#calc-expr');
      const state = { current: '0', prev: '', operator: null, reset: false };
      const update = () => {
        resultEl.textContent = state.current.length > 14 ? parseFloat(state.current).toExponential(4) : state.current;
        exprEl.textContent = state.operator ? `${state.prev} ${state.operator}` : '';
      };
      const input = (val) => {
        if (state.reset) { state.current = ''; state.reset = false; }
        if (val === '.' && state.current.includes('.')) return;
        if (state.current === '0' && val !== '.') state.current = val;
        else state.current += val;
        update();
      };
      const op = (op) => {
        if (state.operator && !state.reset) calculate();
        state.prev = state.current;
        state.operator = op;
        state.reset = true;
        update();
      };
      const calculate = () => {
        if (!state.operator) return;
        const a = parseFloat(state.prev);
        const b = parseFloat(state.current);
        let r = 0;
        switch (state.operator) {
          case '+': r = a + b; break;
          case '\u2212': r = a - b; break;
          case '\u00D7': r = a * b; break;
          case '\u00F7': r = b !== 0 ? a / b : 'Error'; break;
        }
        state.current = typeof r === 'number' ? String(parseFloat(r.toFixed(10))) : 'Error';
        state.prev = '';
        state.operator = null;
        state.reset = true;
        update();
      };
      const fn = (f) => {
        if (f === 'C') { state.current = '0'; state.prev = ''; state.operator = null; state.reset = false; }
        else if (f === '\u00B1') { state.current = String(-parseFloat(state.current)); }
        else if (f === '%') { state.current = String(parseFloat(state.current) / 100); }
        else if (f === '\u2190') { state.current = state.current.length > 1 ? state.current.slice(0, -1) : '0'; }
        update();
      };
      grid.innerHTML = CALC_LAYOUT.map(row =>
        row.map(label => {
          const cls = ['+','\u2212','\u00D7','\u00F7'].includes(label) ? 'op' :
                      ['C','\u00B1','%','\u2190'].includes(label) ? 'fn' :
                      label === '=' ? 'eq' : '';
          return `<button class="calc-btn ${cls}" data-val="${label === '=' ? 'eq' : label}">${label}</button>`;
        }).join('')
      ).join('');

      grid.addEventListener('click', e => {
        const btn = e.target.closest('.calc-btn');
        if (!btn) return;
        const label = btn.textContent;
        if (label === '=') calculate();
        else if (['+','\u2212','\u00D7','\u00F7'].includes(label)) op(label);
        else if (['C','\u00B1','%','\u2190'].includes(label)) fn(label);
        else input(label);
      });
    }

    buildNotes(el) {
      el.innerHTML = `<div class="notes">
        <div style="display:flex;height:100%;overflow:hidden">
          <div class="notes-list" id="notes-list"></div>
          <div class="notes-editor-wrap" id="notes-editor">
            <div class="notes-empty" id="notes-empty">
              <div class="ne-icon">\uD83D\uDCDD</div>
              <div class="ne-text">Select or create a note</div>
            </div>
          </div>
        </div>
      </div>`;
      this._loadNotes(el);
    }

    _loadNotes(el) {
      let notes = [];
      let activeId = null;
      try {
        notes = JSON.parse(localStorage.getItem(KEYS.notes)) || [];
      } catch (e) { notes = []; }
      if (notes.length === 0) {
        notes = [
          { id: 'note-1', title: 'Welcome', content: 'Welcome to Quantio Notes!\n\nYour notes are automatically saved.' },
          { id: 'note-2', title: 'Getting Started', content: 'Type in the editor to create notes.\nClick + to add a new note.' }
        ];
        this._saveNotes(notes);
      }
      const listEl = el.querySelector('#notes-list');
      const editorEl = el.querySelector('#notes-editor');
      const emptyEl = el.querySelector('#notes-empty');

      const renderList = () => {
        listEl.innerHTML = notes.map(n =>
          `<div class="notes-item ${n.id === activeId ? 'active' : ''}" data-id="${n.id}">
            <div class="ni-title">${n.title || 'Untitled'}</div>
            <div class="ni-preview">${(n.content || '').split('\n')[0] || 'Empty note'}</div>
          </div>`
        ).join('');
        listEl.querySelectorAll('.notes-item').forEach(item => {
          item.addEventListener('click', () => { activeId = item.dataset.id; renderList(); renderEditor(); });
        });
      };

      const renderEditor = () => {
        const note = notes.find(n => n.id === activeId);
        if (!note) { editorEl.innerHTML = emptyEl.outerHTML; return; }
        editorEl.innerHTML = `
          <input class="notes-title" id="notes-title" value="${note.title.replace(/"/g, '&quot;')}" placeholder="Note title">
          <textarea class="notes-content" id="notes-content" placeholder="Write something...">${note.content || ''}</textarea>
        `;
        const titleInput = editorEl.querySelector('#notes-title');
        const contentInput = editorEl.querySelector('#notes-content');
        let saveTimer;
        const save = () => {
          const n = notes.find(x => x.id === activeId);
          if (!n) return;
          n.title = titleInput.value || 'Untitled';
          n.content = contentInput.value;
          this._saveNotes(notes);
          renderList();
        };
        titleInput.addEventListener('input', () => { clearTimeout(saveTimer); saveTimer = setTimeout(save, 300); });
        contentInput.addEventListener('input', () => { clearTimeout(saveTimer); saveTimer = setTimeout(save, 300); });
      };

      if (!activeId && notes.length > 0) activeId = notes[0].id;
      renderList();
      renderEditor();

      const toolbar = el.querySelector('.app-toolbar') || (() => {
        const tb = document.createElement('div');
        tb.className = 'app-toolbar';
        tb.innerHTML = `<button id="notes-add">+</button><button id="notes-del">\u2212</button>`;
        el.querySelector('.notes')?.prepend?.(tb);
        return tb;
      })();

      const addBtn = el.querySelector('#notes-add') || (() => {
        const btn = document.createElement('button');
        btn.id = 'notes-add'; btn.textContent = '+';
        const tb = el.querySelector('.app-toolbar') || el.querySelector('.notes')?.querySelector('.app-toolbar');
        if (tb) tb.appendChild(btn);
        return btn;
      })();

      if (addBtn) {
        addBtn.addEventListener('click', () => {
          const id = 'note-' + Date.now();
          notes.unshift({ id, title: 'Untitled', content: '' });
          activeId = id;
          this._saveNotes(notes);
          renderList();
          renderEditor();
        });
      }

      const delBtn = el.querySelector('#notes-del');
      if (delBtn) {
        delBtn.addEventListener('click', () => {
          if (!activeId || notes.length <= 1) return;
          notes = notes.filter(n => n.id !== activeId);
          activeId = notes[0]?.id || null;
          this._saveNotes(notes);
          renderList();
          renderEditor();
        });
      }
    }

    _saveNotes(notes) {
      try { localStorage.setItem(KEYS.notes, JSON.stringify(notes)); } catch (e) {}
    }

    buildPhotos(el) {
      let currentIdx = 0;
      const render = () => {
        const photo = PHOTOS_SVGS[currentIdx];
        el.innerHTML = `<div class="photos">
          <div class="photos-toolbar">
            <button id="ph-prev">\u25C0</button>
            <span class="ph-name">${photo.name} (${currentIdx + 1}/${PHOTOS_SVGS.length})</span>
            <button id="ph-next">\u25B6</button>
          </div>
          <div class="photos-canvas" id="ph-canvas">${photo.svg}</div>
          <div class="photos-strip" id="ph-strip">${PHOTOS_SVGS.map((p, i) =>
            `<div class="photos-thumb ${i === currentIdx ? 'active' : ''}" data-idx="${i}">${p.svg}</div>`
          ).join('')}</div>
        </div>`;
        el.querySelector('#ph-prev')?.addEventListener('click', () => { if (currentIdx > 0) { currentIdx--; render(); } });
        el.querySelector('#ph-next')?.addEventListener('click', () => { if (currentIdx < PHOTOS_SVGS.length - 1) { currentIdx++; render(); } });
        el.querySelectorAll('.photos-thumb').forEach(t => {
          t.addEventListener('click', () => { currentIdx = parseInt(t.dataset.idx); render(); });
        });
      };
      render();
    }

    buildSettings(el) {
      const s = OS.state.settings;
      const pages = [
        { id: 'general', label: 'General', icon: '\u2699\uFE0F' },
        { id: 'wallpaper', label: 'Wallpaper', icon: '\uD83D\uDDBC\uFE0F' },
        { id: 'accent', label: 'Accent Color', icon: '\uD83C\uDFA8' },
        { id: 'dock', label: 'Dock', icon: '\u2B1C' }
      ];
      let activePage = 'general';

      const render = () => {
        el.innerHTML = `<div class="settings">
          <div class="settings-sidebar" id="settings-sidebar"></div>
          <div class="settings-content" id="settings-content"></div>
        </div>`;
        const sidebar = el.querySelector('#settings-sidebar');
        sidebar.innerHTML = pages.map(p =>
          `<div class="settings-item ${p.id === activePage ? 'active' : ''}" data-page="${p.id}"><span>${p.icon}</span><span>${p.label}</span></div>`
        ).join('');
        sidebar.querySelectorAll('.settings-item').forEach(item => {
          item.addEventListener('click', () => { activePage = item.dataset.page; render(); });
        });
        this._renderSettingsPage(el.querySelector('#settings-content'), activePage);
      };
      render();
    }

    _renderSettingsPage(el, page) {
      const s = OS.state.settings;
      if (page === 'general') {
        el.innerHTML = `<div class="settings-title">General</div>
          <div class="settings-row">
            <div><div class="settings-label">Show Desktop Icons</div><div class="settings-desc">Display icons on the desktop</div></div>
            <div class="toggle ${s.showDesktopIcons ? 'on' : ''}" id="toggle-icons"><div class="tog-knob"></div></div>
          </div>
          <div class="settings-row">
            <div><div class="settings-label">About Quantio OS</div><div class="settings-desc">Version 1.0 - Built with web technologies</div></div>
          </div>`;
        el.querySelector('#toggle-icons')?.addEventListener('click', function () {
          OS.updateSettings({ showDesktopIcons: !OS.state.settings.showDesktopIcons });
          this.classList.toggle('on');
        });
      } else if (page === 'wallpaper') {
        el.innerHTML = `<div class="settings-title">Wallpaper</div><div class="wall-grid" id="wall-grid"></div>`;
        const grid = el.querySelector('#wall-grid');
        grid.innerHTML = Object.entries(WALLPAPERS).map(([k, v]) =>
          `<div class="wall-opt ${k === s.wallpaper ? 'active' : ''}" data-wall="${k}">
            <div class="wp-preview" style="background:${v.colors}"></div>
            <div class="wp-label">${v.label}</div>
          </div>`
        ).join('');
        grid.querySelectorAll('.wall-opt').forEach(w => {
          w.addEventListener('click', () => {
            grid.querySelectorAll('.wall-opt').forEach(x => x.classList.remove('active'));
            w.classList.add('active');
            OS.updateSettings({ wallpaper: w.dataset.wall });
          });
        });
      } else if (page === 'accent') {
        el.innerHTML = `<div class="settings-title">Accent Color</div><div class="color-grid" id="color-grid"></div>`;
        const grid = el.querySelector('#color-grid');
        grid.innerHTML = ACCENT_COLORS.map(c =>
          `<div class="color-swatch ${c === s.accentColor ? 'active' : ''}" style="background:${c}" data-color="${c}"></div>`
        ).join('');
        grid.querySelectorAll('.color-swatch').forEach(w => {
          w.addEventListener('click', () => {
            grid.querySelectorAll('.color-swatch').forEach(x => x.classList.remove('active'));
            w.classList.add('active');
            OS.updateSettings({ accentColor: w.dataset.color });
          });
        });
      } else if (page === 'dock') {
        el.innerHTML = `<div class="settings-title">Dock</div>
          <div class="settings-row">
            <div><div class="settings-label">Dock Size</div><div class="settings-desc">Adjust the size of dock icons</div></div>
            <div class="range-wrap">
              <input type="range" id="dock-range" min="0.6" max="1.6" step="0.1" value="${s.dockSize}">
              <span class="range-val" id="dock-val">${Math.round(s.dockSize * 100)}%</span>
            </div>
          </div>`;
        const range = el.querySelector('#dock-range');
        const val = el.querySelector('#dock-val');
        range.addEventListener('input', () => {
          const v = parseFloat(range.value);
          val.textContent = Math.round(v * 100) + '%';
          document.querySelectorAll('.dock-icon').forEach(el => el.style.fontSize = (24 * v) + 'px');
          document.querySelectorAll('.dock-item .dock-icon').forEach(el => {
            const size = 48 * v;
            el.style.width = size + 'px';
            el.style.height = size + 'px';
          });
          OS.updateSettings({ dockSize: v });
        });
        setTimeout(() => range.dispatchEvent(new Event('input')), 50);
      }
    }
  }

  class Spotlight {
    toggle() {
      if (OS.els.spotlight.classList.contains('open')) this.close();
      else this.open();
    }
    open() {
      OS.els.spotlight.classList.add('open');
      OS.els.spotlightInput.value = '';
      OS.els.spotlightInput.focus();
      this.search('');
    }
    close() {
      OS.els.spotlight.classList.remove('open');
    }
    search(q) {
      const results = DOCK_APPS.filter(a =>
        a.label.toLowerCase().includes(q.toLowerCase()) || a.desc.toLowerCase().includes(q.toLowerCase())
      );
      if (q === '') {
        OS.els.spotlightResults.innerHTML = '<div style="padding:12px 16px;font-size:11px;color:var(--text-tertiary)">Type to search apps...</div>';
        return;
      }
      OS.els.spotlightResults.innerHTML = results.length
        ? results.map(r =>
            `<div class="spotlight-result" data-app="${r.id}">
              <div class="sr-icon">${r.icon}</div>
              <div><div class="sr-name">${r.label}</div><div class="sr-desc">${r.desc}</div></div>
            </div>`
          ).join('')
        : '<div style="padding:12px 16px;font-size:11px;color:var(--text-tertiary)">No results</div>';
      OS.els.spotlightResults.querySelectorAll('.spotlight-result').forEach(el => {
        el.addEventListener('click', () => {
          OS.openApp(el.dataset.app);
          this.close();
        });
      });
    }

    setup() {
      OS.els.spotlightInput.addEventListener('input', () => this.search(OS.els.spotlightInput.value));
      OS.els.spotlightInput.addEventListener('keydown', e => {
        if (e.key === 'Escape') this.close();
        if (e.key === 'Enter') {
          const first = OS.els.spotlightResults.querySelector('.spotlight-result');
          if (first) { OS.openApp(first.dataset.app); this.close(); }
        }
      });
      OS.els.spotlight.addEventListener('mousedown', e => {
        if (!e.target.closest('.spotlight-modal')) this.close();
      });
      document.addEventListener('keydown', e => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); this.toggle(); }
      });
    }
  }

  class ContextMenu {
    show(x, y, items) {
      const menu = OS.els.contextMenu;
      if (!items) {
        items = [
          { label: 'New Folder', icon: '\uD83D\uDCC1', action: () => OS.notify('Desktop', 'New folder created') },
          { label: 'Get Info', icon: '\u2139\uFE0F', action: () => OS.notify('Info', 'Quantio OS Desktop') },
          { type: 'sep' },
          { label: 'Change Wallpaper', icon: '\uD83D\uDDBC', action: () => OS.openApp('settings') },
          { label: 'Open Settings', icon: '\u2699\uFE0F', action: () => OS.openApp('settings') },
          { type: 'sep' },
          { label: 'Show Desktop Icons', icon: '\uD83D\uDCBB', checked: OS.state.settings.showDesktopIcons, action: () => OS.updateSettings({ showDesktopIcons: !OS.state.settings.showDesktopIcons }) }
        ];
      }
      menu.innerHTML = items.map(it => {
        if (it.type === 'sep') return '<div class="ctx-sep"></div>';
        return `<button class="ctx-item"><span class="ctx-icon">${it.icon || ''}</span><span>${it.label}</span></button>`;
      }).join('');
      menu.style.display = 'flex';
      const mw = menu.offsetWidth, mh = menu.offsetHeight;
      const vw = window.innerWidth, vh = window.innerHeight;
      menu.style.left = Math.min(x, vw - mw - 4) + 'px';
      menu.style.top = Math.min(y, vh - mh - 4) + 'px';
      menu.querySelectorAll('.ctx-item').forEach((btn, i) => {
        btn.addEventListener('click', () => {
          const item = items[i];
          if (item) item.action?.();
          menu.style.display = 'none';
        });
      });
    }
  }

  class NotificationManager {
    add(title, msg, icon) {
      const n = document.createElement('div');
      n.className = 'notification';
      n.innerHTML = `<div class="notif-icon">${icon || '\uD83D\uDD14'}</div>
        <div class="notif-body">
          <div class="notif-title">${title}</div>
          <div class="notif-msg">${msg}</div>
          <div class="notif-time">just now</div>
        </div>
        <button class="notif-close">\u2715</button>`;
      n.querySelector('.notif-close').addEventListener('click', e => { e.stopPropagation(); this.remove(n); });
      n.addEventListener('click', () => this.remove(n));
      OS.els.notifContainer.appendChild(n);
      setTimeout(() => this.remove(n), 5000);
    }
    remove(el) {
      if (!el || el.classList.contains('removing')) return;
      el.classList.add('removing');
      setTimeout(() => el.remove(), 200);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    OS.init();
    OS.classes.spotlight.setup();
  });
})();
