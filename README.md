# Nest 🌿

A mobile-first web app that helps expecting parents organize everything they need to do before their baby arrives. Nest turns a curated library of ~66 baby-prep tasks into a personalized, time-aware schedule based on your due date, hours available per week, and key event dates (like a baby shower).

This is a working prototype: all data is stored locally in the browser (`localStorage`) via Pinia stores — there is currently no backend/auth/sync. See [PLAN.md](PLAN.md) for the original product spec, including the longer-term Supabase-backed, multi-user vision.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Vue 3 (`<script setup>`, Composition API) |
| Build tool | Vite |
| Routing | Vue Router 4 (hash mode) |
| State | Pinia (`auth`, `plan`, `tasks`, `onboarding` stores) |
| Styling | Tailwind CSS v3, themed via CSS variables |
| Task data | Static JSON (`src/data/tasks.json`) |
| Icons | lucide-vue-next |
| Dates | Day.js |

## Features

### Onboarding (5 steps)
1. **Welcome** — parent's name.
2. **Due date** — due date (drives the countdown + schedule) and an optional baby shower date (used to time gift-dependent tasks).
3. **About you & baby** — optional baby name + boy/girl/surprise selection (recolors the whole app to match — blue, pink, or the default sage green), plus first-baby/working-during-pregnancy questions.
4. **Task selection** — all ~66 library tasks grouped by category with per-category counts; each task can be marked **Add**, **Already done**, or **Skip**. Custom tasks can be added inline.
5. **Time budget** — a slider for hours/week, with a computed recommendation (based on total estimated hours ÷ weeks until due) and a warning if the current pace won't finish everything in time.

### Today
- Due-date countdown (shows the baby's name in a handwritten font if provided).
- Overdue tasks banner + list.
- This week's tasks.
- **Quick wins** — short (≤1h) library tasks not yet added or explicitly skipped, addable with one tap.
- A floating "+" button (available on every main screen) opens a modal to add a custom task at any time.

### Schedule
Week-by-week view of upcoming tasks, several weeks out.

### Tasks
Full task list with category (with counts) and status filters.

### Task cards
- Tap to expand for description, status (to do / in progress / done), scheduled week (manually reschedulable), subtasks, and comments.
- **Edit** a task's title/description inline (pencil icon) if the prepopulated wording doesn't quite fit.
- **Subtasks** — break a task into smaller checklist items if it feels too big or undefined.
- **Dependencies** — some tasks (e.g. adding baby to insurance, setting up gifted gear) are scheduled relative to birth or the baby shower date instead of the due date; if the shower date isn't known yet, the card prompts for it inline and reschedules automatically once provided.
- In-progress tasks float to the top of lists; done tasks sink to the bottom.

### Progress
Overall completion ring plus a per-category breakdown.

### Settings
Basic account info and a "reset my plan" action (clears all local data).

### Layout
The whole app is rendered inside a fixed-height, mobile-width shell (a "phone frame" on wider viewports) with only the content area scrolling — the bottom nav and add-task button are always reachable.

## Task scheduling

Library tasks carry a `suggestedWeeksBeforeDue` and priority. The scheduler computes each task's ideal target week (due date minus that offset, or an event-relative date for dependent tasks), then packs tasks into weeks earliest-deadline-first, spilling into later weeks once `hoursPerWeek` is exceeded. Tasks can always be moved to a different week manually from the task card.

## Project structure

```
src/
├── data/
│   ├── tasks.json       # curated task library (~66 tasks)
│   ├── categories.ts    # category labels/colors/icons
│   └── types.ts         # shared TypeScript types
├── lib/
│   └── schedule.ts       # week-math + scheduling/dependency logic
├── stores/               # Pinia stores (auth, plan, tasks, onboarding)
├── router/               # Vue Router config + onboarding guard
├── components/
│   ├── onboarding/        # one component per onboarding step
│   ├── schedule/          # week navigator/summary/list
│   ├── tasks/             # task card/list, filters, add-task modal
│   └── shared/             # badges, nav, countdown widget, etc.
└── views/                 # Today, Schedule, Tasks, Progress, Settings, Onboarding
```

## Getting started

```bash
npm install
npm run dev       # start the Vite dev server
npm run build     # type-check (vue-tsc) + production build
npm run preview   # preview the production build locally
```

## Data & persistence

Everything (profile, plan, tasks) is persisted to `localStorage` by the Pinia stores — there's no server or auth yet. Clearing site data or using "Reset my plan" in Settings wipes it all. `src/data/tasks.json` is the single source of truth for the pre-built task library and is bundled at build time.
