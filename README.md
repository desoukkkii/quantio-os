# Quantio OS

A fully functional virtual operating system built entirely with HTML, CSS, and vanilla JavaScript. Runs in any modern browser with zero dependencies, no build tools, and no backend.

> **Live demo**: Open `index.html` in any browser (no server required)

---

## Features

### Boot Sequence
- Animated geometric logo with pulsing ring animation
- Smooth progress bar with cubic-bezier easing
- Status messages simulating system initialization
- Fade transition into lock screen

### Lock Screen
- Large live clock with real-time updates
- Formatted date display
- Click, touch, or press any key to unlock
- Animated transition to desktop

### Desktop Environment
- Dynamic gradient wallpapers (8 options)
- Desktop application icons with selection state
- Right-click context menu with application launchers
- Show Desktop functionality (minimizes all windows)

### Taskbar
- Start button with animated open/close
- Search button (opens Start menu)
- Running application buttons with visual indicators
  - Active window indicator (accent bar)
  - Minimized state indicator (shorter, dimmer bar)
- System tray:
  - Notification bell with unread dot badge
  - Wi-Fi and battery status icons
  - Live clock (click for date calendar popup)
- Right-click context menu on running apps (close, minimize)

### Start Menu
- Animated opening with spring physics (cubic-bezier)
- Application grid (2-4 columns responsive)
- Live search filter with text input
- Recently opened apps section (persisted in localStorage)
- Quick-access settings button
- App icon colors and hover effects

### Window Management
- **Drag**: Smooth dragging with `requestAnimationFrame` for 60fps performance
- **Resize**: 8 directional handles (N, S, E, W, NE, NW, SE, SW) with minimum size constraints
- **Close**: Animated closing with scale+fade
- **Minimize**: Shrink animation with opacity fade
- **Maximize**: Full desktop area (excluding taskbar) with restore
- **Focus**: Click-to-focus raises window to top z-index
- **Snap**: Drag to screen edges (left/right) to snap to 50% width
- **Shadows**: Dynamic glow effect on focused window using accent color
- **Double-click** title bar to toggle maximize

### Applications

#### File Explorer
- Sidebar folder tree with click navigation
- File grid with folder/file icons, names, and sizes
- Navigable path bar (enter to go)
- Parent directory button (up arrow)
- Fake filesystem with realistic structure:
  - `/home/user/Documents` with sample files
  - `/home/user/Pictures` with image placeholders
  - `/home/user/Music` with playlist
  - `/System/` with kernel and config files
  - `/Users/Public/` with shared readme

#### Terminal
- 11 built-in commands:
  - `help` - List all commands
  - `clear` - Clear terminal output
  - `date` - Show current date/time
  - `echo` - Print text to output
  - `ls` - List directory contents
  - `pwd` - Print working directory
  - `cd` - Change directory
  - `cat` - Read file contents
  - `about` - Display OS information
  - `whoami` - Show current user
  - `neofetch` - Display system information
- Command history with Up/Down arrow navigation
- Color-coded output (info, success, error, system)
- File system interaction with `ls`, `cd`, `cat`

#### Calculator
- Fully functional with keyboard and button input
- Operations: +, -, *, /
- Functions: Clear (C), Negate (±), Parentheses
- Expression display with result preview
- Keyboard support: numbers, operators, Enter/=, Backspace, Escape
- Error handling with graceful degradation

#### Notes
- Create, edit, and delete notes
- Auto-save to localStorage (300ms debounce)
- List view with title and content preview
- Full-text editor with title and body fields
- Persistent across sessions
- Default welcome note on first launch

#### Image Viewer
- 3 generated SVG sample images:
  - Mountain landscape with gradient sky
  - Beach sunset with layered colors
  - Forest path with depth composition
- Previous/Next navigation
- Thumbnail strip with active state
- SVG rendered directly in DOM (no canvas)

#### Settings
- **Personalization**:
  - 8 wallpaper options with visual preview grid
  - Dark/Light theme toggle
  - 10 accent color swatches with real-time preview
- **System**:
  - OS version, kernel, user, storage info
  - Screen resolution display
  - Factory reset with confirmation dialog
- **About**:
  - Version information
  - Technology credits

### Notifications
- Slide-in animation from right
- Auto-dismiss with configurable duration
- Close button for manual dismiss
- Notification bell badge counter
- Icon support with accent-colored backgrounds
- Hover to pause / shift left

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Ctrl+1` | Open File Explorer |
| `Ctrl+2` | Open Terminal |
| `Ctrl+3` | Open Calculator |
| `Ctrl+4` | Open Notes |
| `Ctrl+5` | Open Image Viewer |
| `Ctrl+6` | Open Settings |
| `Ctrl+W` | Close active window |
| `Escape` | Close Start Menu |
| `Ctrl+Escape` | Toggle Start Menu |
| `Meta/Windows` | Toggle Start Menu |

### Extras
- **Smooth animations**: Easing curves, spring physics, transitions on all interactions
- **Glassmorphism**: Backdrop blur and semi-transparent backgrounds throughout
- **Responsive design**: Adapts to mobile, tablet, and desktop viewports
- **Dark/Light themes**: Full theme system via CSS custom properties
- **Accent colors**: 10 color options applied globally
- **Window shadows**: Dynamic glow based on accent color
- **Hover effects**: Scale, color, and background transitions
- **Startup sound**: Synthesized via Web Audio API (440Hz→880Hz→660Hz sweep)

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| Structure | HTML5 |
| Styling | CSS3 (Custom Properties, Flexbox, Grid, Animations, Backdrop Filter) |
| Logic | Vanilla JavaScript (ES6 Classes, Modules) |
| Storage | Web localStorage API |
| Audio | Web Audio API (OscillatorNode) |
| Graphics | SVG (inline), CSS Gradients |
| Fonts | System font stack (Segoe UI, system-ui, -apple-system, sans-serif) |

**Zero external dependencies** — no npm, no frameworks, no CDN links.

---

## Project Structure

```
quantio-os/
├── index.html      # Main HTML document (94 lines)
├── style.css       # Complete stylesheet (1947+ lines)
├── script.js       # Application logic (2121+ lines)
└── README.md       # This documentation
```

---

## Getting Started

1. Clone or download this repository
2. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari)
3. Wait for the boot animation to complete
4. Click or press any key to unlock
5. Start exploring!

No web server, build step, or installation required.

---

## Architecture

The codebase follows a class-based architecture with clear separation of concerns:

```
QuantioOS (System Initialization)
├── BootManager        - Boot sequence animation
├── LockScreen         - Lock screen with clock
├── AppManager         - Application lifecycle
│   ├── FileExplorerApp
│   ├── TerminalApp
│   ├── CalculatorApp
│   ├── NotesApp
│   ├── ImageViewerApp
│   └── SettingsApp
├── WindowManager      - Window creation, drag, resize, Z-order
├── Taskbar            - App buttons, system tray, clock
├── StartMenu          - App grid, search, recent apps
├── Desktop            - Icons, context menu
├── NotificationManager
├── WallpaperManager
├── FileSystem         - Fake filesystem data
├── AudioManager       - Web Audio API sound
├── StorageManager     - localStorage persistence
└── KeyboardShortcuts  - Global hotkeys
```

### Data Flow
- All persistent state uses `localStorage` with JSON serialization
- Settings are stored under key `quantio_os_state`
- Notes stored under `quantio_os_notes`
- Recent apps stored under `quantio_os_recent`
- Window Z-indexing increments globally for proper stacking
- Focus tracking via `activeWindow` ID

---

## Design System

### CSS Custom Properties
- `--bg-primary` through `--shadow-glow` define the complete visual language
- Light/Dark themes swap values via `[data-theme="light"]` selector
- Accent color dynamically updates --accent, --accent-hover, --accent-glass, --accent-glass-hover
- Radius scale: `--radius-sm` (6px) through `--radius-xl` (24px)
- Transition curves: `--transition` (0.2s ease), `--transition-bounce` (0.5s spring)

### Glassmorphism
Windows, taskbar, start menu, context menus, and notifications use:
- `backdrop-filter: blur(32px) saturate(1.4)`
- Semi-transparent backgrounds (`rgba` with alpha channel)
- Subtle border with `rgba(255,255,255,0.08)`
- Box shadows with color bleeding

---

## Browser Support

- Chrome 76+ (full backdrop-filter support)
- Firefox 103+ (backdrop-filter enabled by default)
- Safari 15+ (backdrop-filter support)
- Edge 79+ (full support)

---

## License

MIT License — free to use, modify, and distribute.
