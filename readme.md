# 🏎️ Bugatti Chiron Scrollbar

A Chrome extension that replaces your boring scrollbar with a **Bugatti Chiron** racing along the side of every webpage — with spinning wheels, HID headlights, gear shifting, and auto-scroll!

---

## ✨ Features

- 🚗 **Top-down Bugatti Chiron** — pure SVG, no images, fully drawn in code
- 🛞 **Spinning wheels** — speed matches your scroll speed
- 💡 **HID headlights** — auto-detects dark mode, blazing beam cone lights up
- ⚙️ **Gear Selector** — click the car to open gearbox popup
  - Gears **1 → 5** for progressive auto-scroll speeds
  - **R toggle** — reverse mode, all gears scroll upward
- 🛑 **Smart stop** — auto-scroll stops on any click, keypress, or manual scroll
- 🎨 **Bugatti Divo colors** — dark matte grey + teal accents

---

## 📸 Preview

> Bugatti Chiron racing along your scrollbar in top-down view with spinning wheels and HID beam

```
        ↑
    [Bugatti]   ← clicks open gear popup
        ↓
```

---

## 🚀 Installation

### From Source (Developer Mode)

1. Download or clone this repository

   ```bash
   git clone https://github.com/muke-2004/bugatti-chiron-scrollbar.git
   ```

2. Open Chrome and go to:

   ```
   chrome://extensions
   ```

3. Enable **Developer Mode** (top right toggle)

4. Click **Load unpacked**

5. Select the `bugatti-chiron-scrollbar` folder

6. Open any webpage and **scroll** to see the Bugatti race! 🏎️

---

## ⚙️ How to Use

### Scrolling

Just scroll any page — the Bugatti appears, faces the direction of travel, wheels spin, and disappears when you stop.

### Gear Shifting (Auto-Scroll)

| Action           | Result                              |
| ---------------- | ----------------------------------- |
| Click the car    | Opens gearbox popup                 |
| Click gear **1** | Slow cruise                         |
| Click gear **2** | Steady pace                         |
| Click gear **3** | Comfortable speed                   |
| Click gear **4** | Fast scroll                         |
| Click gear **5** | Full race speed 🚀                  |
| Toggle **R ON**  | All gears go in reverse (scroll up) |
| Click anywhere   | Stops auto-scroll                   |
| Press any key    | Stops auto-scroll                   |
| Scroll manually  | Stops auto-scroll                   |

### Headlights

- **Auto mode** — detects system dark mode automatically
- **Always On / Always Off** — set manually via the extension popup icon

---

## 🗂️ File Structure

```
bugatti-chiron-scrollbar/
├── manifest.json       # Chrome extension config (Manifest V3)
├── content.js          # Main extension logic (car, scroll, gears)
├── popup.html          # Extension popup UI
├── popup.js            # Popup logic (headlight toggle)
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

---

## 🛠️ Built With

- **Manifest V3** — latest Chrome extension standard
- **Pure SVG** — entire car drawn with vector geometry, zero images
- **Vanilla JavaScript** — no frameworks, no dependencies
- **CSS animations** — smooth transitions and glow effects
- **requestAnimationFrame** — buttery smooth wheel spin and scroll

---

## 💡 How It Works

1. Content script injects a fixed overlay on every page
2. Native scrollbar is hidden and replaced with a custom track + thumb
3. Car position calculated from `scrollTop / (scrollHeight - innerHeight)`
4. Wheel spokes rotate using SVG `transform` on scroll events
5. Dark mode detected via `prefers-color-scheme` + page background luminance
6. Gear auto-scroll uses `requestAnimationFrame` loop calling `window.scrollBy()`

---

## 🔮 Roadmap

- [ ] Multiple car models (Ferrari, Lamborghini, McLaren)
- [ ] Car color customizer
- [ ] Chrome Web Store release

---

## 👤 Author

**muke-2004**

- GitHub: [@muke-2004](https://github.com/muke-2004)
- VIBE CODED [CLAUDE AI]

---

## 📄 License

MIT License — free to use, modify and share.

---

## ⭐ Support

If you like this project, please give it a **star** on GitHub! ⭐

> Built with vibe coding 🎵 — idea by human, code by AI, magic by both.
