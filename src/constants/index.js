export const KEYS = {
  booted: 'quantio_booted',
  notes: 'quantio_notes',
  settings: 'quantio_settings',
  firstBoot: 'quantio_first_boot',
}

export const DEFAULT_SETTINGS = {
  wallpaper: 'sunset',
  accentColor: '#0A84FF',
  theme: 'dark',
  dockSize: 1,
  showDesktopIcons: true,
}

export const WALLPAPERS = {
  sunset: {
    label: 'Sunset',
    colors: 'linear-gradient(135deg, #0f1115 0%, #1a1d2e 40%, #2a1e2e 70%, #0f1115 100%)',
  },
  ocean: {
    label: 'Ocean',
    colors: 'linear-gradient(135deg, #0a1628 0%, #0d2847 40%, #163a5c 70%, #0a1628 100%)',
  },
  forest: {
    label: 'Forest',
    colors: 'linear-gradient(135deg, #0a1a0f 0%, #142818 40%, #1a3a22 70%, #0a1a0f 100%)',
  },
  space: {
    label: 'Space',
    colors: 'linear-gradient(135deg, #050510 0%, #100820 40%, #1a0a2e 70%, #050510 100%)',
  },
  light: {
    label: 'Light',
    colors: 'linear-gradient(135deg, #d0d0d8 0%, #e8e8f0 40%, #f0f0f8 70%, #d0d0d8 100%)',
  },
}

export const ACCENT_COLORS = [
  '#0A84FF', '#FF453A', '#30D158', '#FFD60A', '#BF5AF2', '#FF9F0A', '#64D2FF',
]

export const DESKTOP_ICONS_DATA = [
  { id: 'finder', label: 'Finder', icon: '\uD83D\uDCC1' },
  { id: 'trash', label: 'Trash', icon: '\uD83D\uDDD1\uFE0F' },
]

export const DOCK_APPS = [
  { id: 'finder', label: 'Finder', icon: '\uD83D\uDCC1', desc: 'Browse files' },
  { id: 'terminal', label: 'Terminal', icon: '\uD83D\uDDA5\uFE0F', desc: 'Command line' },
  { id: 'calculator', label: 'Calculator', icon: '\uD83D\uDD22', desc: 'Calculate' },
  { id: 'notes', label: 'Notes', icon: '\uD83D\uDCDD', desc: 'Write notes' },
  { id: 'photos', label: 'Photos', icon: '\uD83D\uDDBC\uFE0F', desc: 'View photos' },
  { id: 'settings', label: 'Settings', icon: '\u2699\uFE0F', desc: 'System settings' },
]

export const SIDEBAR_ITEMS = [
  { id: 'recents', label: 'Recents', icon: '\u23F3' },
  { id: 'applications', label: 'Applications', icon: '\uD83D\uDCC2' },
  { id: 'documents', label: 'Documents', icon: '\uD83D\uDCC4' },
  { id: 'downloads', label: 'Downloads', icon: '\u2B07\uFE0F' },
  { id: 'desktop', label: 'Desktop', icon: '\uD83D\uDCBB' },
]

export const FINDER_FILES = [
  { name: 'Readme.txt', size: '2 KB', icon: '\uD83D\uDCC4' },
  { name: 'Project.pdf', size: '156 KB', icon: '\uD83D\uDCC1' },
  { name: 'Photo.png', size: '3.2 MB', icon: '\uD83D\uDDBC' },
  { name: 'Notes.md', size: '1 KB', icon: '\uD83D\uDCDD' },
  { name: 'Script.sh', size: '0.4 KB', icon: '\u2699' },
  { name: 'Data.csv', size: '12 KB', icon: '\uD83D\uDCCA' },
  { name: 'Archive.zip', size: '8.1 MB', icon: '\uD83D\uDCE6' },
  { name: 'Image.jpg', size: '456 KB', icon: '\uD83D\uDDBC' },
]

export const CALC_LAYOUT = [
  ['C', '\u00B1', '%', '\u00F7'],
  ['7', '8', '9', '\u00D7'],
  ['4', '5', '6', '\u2212'],
  ['1', '2', '3', '+'],
  ['0', '.', '\u2190', '='],
]

export const PHOTOS_SVGS = [
  {
    name: 'Mountain',
    svg: '<svg viewBox="0 0 200 120"><rect width="200" height="120" fill="#1a1d2e"/><polygon points="40,100 100,30 160,100" fill="#2a3d5c" stroke="#0A84FF" stroke-width="1"/><polygon points="80,100 120,50 160,100" fill="#3a4d6e" stroke="#0A84FF" stroke-width="0.5"/><rect y="100" width="200" height="20" fill="#0f1115" opacity="0.6"/><circle cx="140" cy="25" r="8" fill="#FFD60A" opacity="0.7"/></svg>',
  },
  {
    name: 'Ocean',
    svg: '<svg viewBox="0 0 200 120"><rect width="200" height="120" fill="#0a1628"/><ellipse cx="100" cy="100" rx="90" ry="25" fill="#0d2847"/><ellipse cx="60" cy="105" rx="50" ry="12" fill="#163a5c"/><ellipse cx="140" cy="95" rx="40" ry="10" fill="#1a4a6e"/><circle cx="50" cy="35" r="15" fill="#FFD60A" opacity="0.9"/><ellipse cx="50" cy="40" rx="20" ry="6" fill="#FFD60A" opacity="0.15"/></svg>',
  },
  {
    name: 'Forest',
    svg: '<svg viewBox="0 0 200 120"><rect width="200" height="120" fill="#0a1a0f"/><rect x="40" y="60" width="6" height="50" fill="#3a2a1a"/><ellipse cx="43" cy="55" rx="20" ry="25" fill="#142818"/><ellipse cx="43" cy="45" rx="15" ry="18" fill="#1a3822"/><rect x="120" y="70" width="5" height="40" fill="#3a2a1a"/><ellipse cx="122" cy="65" rx="16" ry="20" fill="#1a3822"/><ellipse cx="122" cy="55" rx="12" ry="14" fill="#204a2a"/><rect x="80" y="80" width="4" height="30" fill="#3a2a1a"/><ellipse cx="82" cy="75" rx="12" ry="15" fill="#18301e"/><rect y="105" width="200" height="15" fill="#0a1a0f" opacity="0.5"/></svg>',
  },
  {
    name: 'Space',
    svg: '<svg viewBox="0 0 200 120"><rect width="200" height="120" fill="#050510"/><circle cx="30" cy="20" r="1.5" fill="#fff" opacity="0.8"/><circle cx="80" cy="45" r="1" fill="#fff" opacity="0.6"/><circle cx="150" cy="15" r="2" fill="#fff" opacity="0.9"/><circle cx="170" cy="60" r="1" fill="#fff" opacity="0.5"/><circle cx="50" cy="80" r="1.5" fill="#fff" opacity="0.7"/><circle cx="130" cy="90" r="1" fill="#fff" opacity="0.4"/><circle cx="190" cy="35" r="1" fill="#fff" opacity="0.6"/><circle cx="100" cy="60" r="20" fill="#1a0a3a"/><circle cx="100" cy="60" r="14" fill="#2a1a5a" opacity="0.8"/><circle cx="100" cy="60" r="6" fill="#4a3a7a"/><circle cx="100" cy="60" r="3" fill="#8a7aba"/></svg>',
  },
  {
    name: 'Abstract',
    svg: '<svg viewBox="0 0 200 120"><rect width="200" height="120" fill="#0f1115"/><circle cx="40" cy="35" r="30" fill="#0A84FF" opacity="0.15"/><circle cx="160" cy="85" r="35" fill="#BF5AF2" opacity="0.15"/><circle cx="100" cy="60" r="25" fill="#FFD60A" opacity="0.1"/><line x1="10" y1="100" x2="190" y2="20" stroke="#0A84FF" stroke-width="0.5" opacity="0.2"/><line x1="20" y1="50" x2="180" y2="90" stroke="#BF5AF2" stroke-width="0.5" opacity="0.15"/><rect x="75" y="45" width="50" height="30" rx="4" fill="none" stroke="#0A84FF" stroke-width="0.5" opacity="0.3"/></svg>',
  },
  {
    name: 'Sunset',
    svg: '<svg viewBox="0 0 200 120"><rect width="200" height="120" fill="#0f1115"/><rect y="80" width="200" height="40" fill="#1a1d2e"/><circle cx="100" cy="85" r="28" fill="#FF9F0A" opacity="0.6"/><circle cx="100" cy="85" r="22" fill="#FFD60A" opacity="0.3"/><rect y="80" width="200" height="40" fill="#1a1a2a" opacity="0.4"/><line x1="30" y1="50" x2="50" y2="70" stroke="#FF9F0A" stroke-width="0.5" opacity="0.2"/><line x1="100" y1="35" x2="100" y2="55" stroke="#FF9F0A" stroke-width="0.5" opacity="0.15"/><line x1="170" y1="50" x2="150" y2="70" stroke="#FF9F0A" stroke-width="0.5" opacity="0.2"/></svg>',
  },
]

export const TERMINAL_COMMANDS = {
  help: {
    desc: 'Show available commands',
    fn: (args, term) => {
      const cmds = Object.entries(TERMINAL_COMMANDS)
        .map(([k, v]) => `  ${k.padEnd(12)} ${v.desc}`)
        .join('\n')
      term.writeln('Available commands:\n' + cmds)
    },
  },
  echo: { desc: 'Echo text', fn: (args, term) => term.writeln(args.join(' ') || '') },
  date: { desc: 'Show current date and time', fn: (args, term) => term.writeln(new Date().toString()) },
  whoami: { desc: 'Show current user', fn: (args, term) => term.writeln('quantio') },
  clear: { desc: 'Clear terminal', fn: (args, term) => term.clear() },
  ls: { desc: 'List files', fn: (args, term) => term.writeln('Applications  Desktop  Documents  Downloads  Music  Pictures  Movies') },
  pwd: { desc: 'Print working directory', fn: (args, term) => term.writeln('/Users/quantio') },
  neofetch: {
    desc: 'Show system info',
    fn: (args, term) => {
      const ua = navigator.userAgent.match(/(Chrome|Firefox|Safari|Edge)\/?\s*(\d+)/)
      term.writeln('  quantios@quantio')
      term.writeln('  -------------------')
      term.writeln('  OS: Quantio OS 1.0')
      term.writeln('  Browser: ' + (ua ? ua[0] : 'Unknown'))
      term.writeln('  Resolution: ' + window.innerWidth + 'x' + window.innerHeight)
    },
  },
  calc: { desc: 'Open calculator', fn: (args, term) => { term.writeln('Opening Calculator...') } },
  notes: { desc: 'Open notes', fn: (args, term) => { term.writeln('Opening Notes...') } },
  uptime: {
    desc: 'Show system uptime',
    fn: (args, term) => {
      const diff = Date.now() - (window._bootTime || Date.now())
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      term.writeln(`${h}h ${m}m ${s}s`)
    },
  },
  theme: {
    desc: 'Change accent color (theme &lt;color&gt;)',
    fn: (args, term, os) => {
      if (!args[0]) {
        term.writeln('Usage: theme <color>')
        term.writeln('Colors: ' + ACCENT_COLORS.join(', '))
        return
      }
      const c = args[0].toLowerCase()
      const colorMap = { blue: '#0A84FF', red: '#FF453A', green: '#30D158', yellow: '#FFD60A', purple: '#BF5AF2', orange: '#FF9F0A', cyan: '#64D2FF' }
      const hex = colorMap[c] || (c.startsWith('#') ? c : null)
      if (hex && /^#[0-9a-f]{6}$/i.test(hex)) {
        os.updateSettings({ accentColor: hex })
        term.writeln('Accent color changed to ' + hex)
      } else {
        term.writeln('Unknown color. Try: blue, red, green, yellow, purple, orange, cyan')
      }
    },
  },
  wall: {
    desc: 'Change wallpaper (wall &lt;name&gt;)',
    fn: (args, term, os) => {
      if (!args[0]) {
        term.writeln('Available: ' + Object.keys(WALLPAPERS).join(', '))
        return
      }
      const name = args[0].toLowerCase()
      if (WALLPAPERS[name]) {
        os.updateSettings({ wallpaper: name })
        term.writeln('Wallpaper set to ' + name)
      } else {
        term.writeln('Unknown wallpaper. Try: sunset, ocean, forest, space, light')
      }
    },
  },
}
