# Quantio OS

A macOS-inspired desktop environment built with **React 18**, **Tailwind CSS**, and **Vite**. Runs entirely in the browser with zero backend dependencies.

---

## Features

### Boot Sequence
- Animated geometric logo with pulsing animation
- Smooth progress bar with status messages
- Fade transition into lock screen

### Lock Screen
- Large live clock with real-time updates
- Formatted date display
- Click, touch, or press Enter to unlock

### Desktop Environment
- Dynamic gradient wallpapers (5 options)
- Desktop application icons with selection state
- Right-click context menu with desktop actions
- System notifications with slide-in animation

### Menu Bar
- Apple menu (About, Lock Screen, Restart, Shut Down)
- Active application name display
- Menu items (File, Edit, View, Window, Help)
- System tray (Spotlight search, Wi-Fi, Battery, Clock)

### Dock
- Glassmorphism-styled application dock
- Running and active state indicators
- Hover tooltips with app labels
- Icon size adjustment in Settings
- Right-click context menu (Hide/Quit/Open)

### Spotlight Search
- `Cmd+K` / `Ctrl+K` keyboard shortcut
- Real-time app search filtering
- Keyboard navigation (Enter to open, Esc to close)

### Window Management
- Drag windows via title bar
- 8-direction resize handles
- Close, minimize, and maximize/restore
- Z-index focus stacking
- Animated open/close transitions

### Applications

| App | Description |
|-----|-------------|
| **Finder** | File browser with sidebar nav and grid view |
| **Terminal** | Command line with 13 built-in commands |
| **Calculator** | Grid-based calculator with keyboard support |
| **Notes** | Create, edit, delete notes with auto-save to localStorage |
| **Photos** | SVG photo viewer with navigation and thumbnails |
| **Settings** | General, Wallpaper, Accent Color, and Dock preferences |

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Toggle Spotlight |
| `Enter` | Unlock screen |

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| Framework | React 18 |
| Build Tool | Vite |
| Styling | Tailwind CSS + Custom CSS Variables |
| State Mgmt | React Context + useReducer |
| Storage | Web localStorage API |
| Graphics | SVG (inline), CSS Gradients |
| Fonts | Inter + JetBrains Mono (Google Fonts) |

---

## Project Structure

```
quantio-os/
├── index.html              # Vite entry point
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── README.md
├── src/
│   ├── main.jsx            # React entry point
│   ├── index.css           # Tailwind directives + custom CSS
│   ├── App.jsx             # Root component
│   ├── constants/
│   │   └── index.js        # App constants (wallpapers, apps, etc.)
│   ├── context/
│   │   └── OSContext.jsx    # Global state (context + reducer)
│   └── components/
│       ├── BootScreen.jsx
│       ├── LockScreen.jsx
│       ├── Desktop.jsx
│       ├── MenuBar.jsx
│       ├── AppleDropdown.jsx
│       ├── Dock.jsx
│       ├── Spotlight.jsx
│       ├── ContextMenu.jsx
│       ├── NotificationContainer.jsx
│       ├── DesktopIcons.jsx
│       ├── WindowManager.jsx
│       ├── Window.jsx
│       └── apps/
│           ├── Finder.jsx
│           ├── Terminal.jsx
│           ├── Calculator.jsx
│           ├── Notes.jsx
│           ├── Photos.jsx
│           └── Settings.jsx
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Design System

### CSS Custom Properties
- `--accent`, `--accent-hover`, `--accent-glass`, `--accent-glass-hover` — dynamic accent color
- `--bg-*` — background surface colors (primary, surface, elevated, raised)
- `--text-*` — text color scale (primary, secondary, tertiary)
- `--shadow-*` — box shadow presets
- `--radius-*` — border radius scale (sm: 8px through xl: 20px)
- `--ease*` — cubic-bezier easing curves

### Glassmorphism
Windows, dock, context menus, and notifications use:
- `backdrop-filter: blur(...) saturate(...)`
- Semi-transparent backgrounds
- Subtle borders with `rgba(255,255,255,0.07)`

---

## License

MIT License — free to use, modify, and distribute.
