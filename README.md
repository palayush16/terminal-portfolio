# ayush@portfolio — Terminal Portfolio

A minimalistic, interactive portfolio website styled as a terminal. No frameworks, no build step, no LLMs — just HTML, CSS, and vanilla JavaScript.

## Features

- **Terminal interface** — type commands, get responses. Tab-complete, up-arrow history, Ctrl+L clear
- **8 company projects** — `ls projects` → `cat <name>` for each Nielsen project
- **XP engagement meter** — earn XP by exploring. Hit 2000 for a milestone surprise
- **Activity log panel** — real-time event feed showing every interaction
- **Resizable panels** — drag the divider between terminal and activity log (min 50vw terminal)
- **htop status bar** — fake CPU spikes, real DOM-based MEM, real FPS counter, live DOM node count
- **CRT effect** — `crt` command toggles scanlines, flicker, and RGB color separation
- **Keyboard sounds** — `sound on/off` toggles mechanical key clicks (Web Audio API)
- **Easter eggs** — `rm -rf /`, `sudo su`, `fortune`, `whoami --verbose`
- **Boot progress bar** — animated `[████░░░░░░] 60%` bar during startup
- **Heartbeat events** — minimal system log events (gc, watchdog, scheduler, net)
- **Window controls** — macOS dots: red (close → resume.html), yellow (minimize), green (toggle log)
- **Blinking cursor** — green block cursor after prompt, dims when disabled
- **OpenGraph tags** — rich preview cards on LinkedIn, Twitter, Slack, WhatsApp
- **Google Analytics 4** — tracks commands, project views, time-to-first-command, bounce rate, session summary
- **Clickable links** — email, LinkedIn, GitHub are real hyperlinks
- **Normal view** — `resume.html` for recruiters who want a plain resume page
- **SEO** — `robots.txt`, `sitemap.xml`, OG meta tags

## Project Structure

```
terminal-portfolio/
├── index.html           ← HTML shell + GA4 tag + OG meta tags (~110 lines)
├── resume.html          ← Static resume page ("Normal view")
├── css/
│   ├── style.css        ← Core layout, panels, resizer, typography, responsive (18KB)
│   └── crt.css          ← CRT scanlines/flicker/colorsep (3KB)
├── js/
│   ├── analytics.js     ← GA4 trackEvent wrapper (10 lines)
│   └── app.js           ← All application logic (56KB):
│                            CONTENT data, ActivityLog, SoundEngine, Terminal,
│                            initHtop, startHeartbeat, initDots, initResizer, boot
├── og-preview.png       ← OpenGraph preview image (81KB)
├── robots.txt           ← Search engine crawl rules
├── sitemap.xml          ← Sitemap for GitHub Pages
└── README.md
```

## How It Works

### Architecture

No build step. No bundler. Two JS files loaded in order:

```
index.html loads:
  1. js/analytics.js  → trackEvent() wrapper (must load first)
  2. js/app.js        → everything else:
       CONTENT        → all text/command data
       ActivityLog    → right panel event feed
       SoundEngine    → Web Audio mechanical clicks
       Terminal       → command dispatch, typing, chips, XP, easter eggs
       initHtop()     → CPU (fake), MEM (real DOM), FPS (real), DOM count (real)
       startHeartbeat → periodic system log events
       initDots()     → window control dot handlers
       initResizer()  → draggable panel divider
       DOMContentLoaded → boots everything + session analytics
```

### Command Flow

1. User types or clicks a chip
2. `Terminal.execute(input)` runs
3. Checks easter eggs first (`rm -rf /`, `sudo su`, `whoami --verbose`, `fortune`)
4. Then exact match against `CONTENT.commands` → type out response
5. No match → `bash: command not found`
6. Every command earns 50 XP and fires GA4 events
7. At 2000 XP → milestone with contact info auto-displayed

### Commands

| Command | Description |
|---|---|
| `help` | List all commands |
| `whoami` | Name, role, degree |
| `whoami --verbose` | Full bio with fun facts |
| `ls projects` | List 8 company projects |
| `cat <project>` | Deep dive into a project |
| `tree skills` | Skills as a directory tree |
| `git log --oneline` | Career timeline |
| `cat resume` | View resume |
| `download resume` | Google Drive PDF link |
| `contact` | Email, LinkedIn, GitHub |
| `sudo hire-me` | 😏 |
| `fortune` | Random dev wisdom quote |
| `uptime` | Session stats |
| `sound on/off` | Toggle key clicks |
| `crt` / `crt off` | Toggle CRT effect |
| `clear` | Clear terminal |
| `history` | Command history |
| `rm -rf /` | Easter egg |
| `sudo su` | Easter egg |

### htop Status Bar

| Metric | Source | Details |
|---|---|---|
| CPU | Fake (event-driven) | Spikes on Enter/hover/chip, exponential decay to idle |
| MEM | Real (DOM-based) | KB estimate from `querySelectorAll('*').length`, grows as you explore |
| FPS | Real (`requestAnimationFrame`) | Dips during typing animation, 60 when idle |
| DOM | Real node count | Live `querySelectorAll('*').length` |
| Tasks | 13 + commands run | |
| Uptime | Real session time | |

### Boot Sequence

Animated progress bar instead of plain text:
```
init: loading modules [java, cpp, spring, aws, mpeg-ts]
[████████████░░░░░░░░] 60%
```
Fills to 100% (green), then clears into the welcome screen. Skippable with any keypress.

## Analytics (GA4)

Measurement ID: `G-Z1Y0G16RCM`

| Event | When | Key Parameters |
|---|---|---|
| `session_start` | Boot completes | `boot_skipped` |
| `command` | Every command | `command_name`, `input_method`, `commands_total` |
| `time_to_first_command` | First command | `seconds`, `first_command` |
| `command_frequency` | Every command | `command_name`, `count` |
| `project_view` | `cat <project>` | `project_name`, `view_count`, `total_projects_viewed` |
| `chip_click` | Follow-up chip | `chip_label` |
| `welcome_chip` | Welcome chip | `chip_label` |
| `contact_click` | Link clicked | `link_url`, `link_text` |
| `feature_toggle` | sound/crt on/off | `feature`, `state` |
| `easter_egg` | rm -rf, sudo su, fortune | `egg` |
| `milestone_reached` | 2000 XP | `xp`, `commands_used` |
| `window_control` | Dot clicked | `action` |
| `session_end` | Page close | `duration_seconds`, `commands_run`, `is_bounce`, `projects_viewed` |
| `top_command` | Page close | most-used command name + count |
| `project_heatmap` | Page close | `most_viewed`, all view counts |

## Editing Content

All text lives in `js/app.js` → `CONTENT` object.

### Add a new command

In `CONTENT.commands`:
```javascript
"my-command": [
  "Line 1 of output",
  "Line 2",
  { html: '<a href="https://example.com" class="term-link">Link</a>' }
],
```
Then add it to the `help` output, the `commandList` array, and the chip map in `showCommandChips`.

### Add a new project

1. Add `"drwxr-xr-x  my-project"` to the `"ls projects"` array
2. Add `"cat my-project": [...]` with project details
3. Add `'my-project'` to the known list in the unknown-cat handler
4. Add chip suggestions in `showCommandChips`

### Change personal info

Update `CONTENT.meta` for name/email/links, and the `contact` / `sudo hire-me` commands.

## Deployment

### GitHub Pages
```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/palayush16/terminal-portfolio.git
git push -u origin main
```
Settings → Pages → Deploy from `main` branch → `https://palayush16.github.io/terminal-portfolio/`

### Netlify / Vercel
Drag and drop the folder. No build command needed.

## Tech

- Zero dependencies
- Zero build step
- No frameworks
- Works from `file://` (GA4 needs `http://`)
- Single font: JetBrains Mono (Google Fonts CDN)
- 7 source files
