# Project Brief: Nest — Baby Preparation Tracker
**Version:** 1.2  
**Platform:** Mobile web (Vue 3 PWA)  
**Hosting:** Vercel  
**Status:** Planning

---

## 1. Overview

Nest is a mobile-first web app that helps expecting parents organize everything they need to do before their baby arrives. It uses a curated, pre-built library of common preparation tasks — organized by category and trimester urgency — combined with a time-based schedule so parents know what to do and when, without feeling overwhelmed.

Two users (a primary account and a partner) share a single plan. Both can view, update, and add tasks. Changes sync in real time.

### Goals

- Reduce anxiety by turning an open-ended checklist into a structured, time-aware plan
- Provide a comprehensive starting-point task library without requiring an AI API call
- Make day-to-day task management lightweight — checking things off should take seconds
- Support custom tasks so the plan is genuinely theirs, not just a generic list
- Allow both partners to participate and track progress from their own accounts


---

## 2. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Vue 3 (Composition API) | `<script setup>` syntax throughout |
| Build tool | Vite | Fast dev server, first-class Vue support |
| Routing | Vue Router 4 | Hash mode for simpler static deployment |
| State | Pinia | One store per domain (auth, plan, tasks, onboarding) |
| Styling | Tailwind CSS v3 | Custom design tokens via `tailwind.config` |
| Auth + DB | Supabase | Postgres database, email auth, real-time subscriptions |
| Task data | Static JSON (`src/data/tasks.json`) | Curated library, bundled with the app |
| HTTP | Native `fetch` | Only used for Supabase client calls |
| Icons | Heroicons or Lucide Vue | Outline style only |
| Date handling | Day.js | Week math and display formatting |
| Email (invites) | Supabase built-in | Or Resend.com if more control is needed |

No serverless functions are required. Vercel hosts a purely static Vue SPA.

### Project structure

```
/
├── src/
│   ├── data/
│   │   ├── tasks.json          ← curated task library
│   │   └── categories.ts       ← category config (label, color, icon)
│   ├── stores/
│   ├── views/
│   ├── components/
│   └── supabase.ts
├── public/
├── index.html
├── vite.config.ts
└── vercel.json                 ← SPA catch-all rewrite only
```

**`vercel.json`:**

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 3. Task Data Source

All tasks are defined in `src/data/tasks.json`. This file is the single source of truth for the pre-built task library. It is bundled with the app at build time — no network call required.

### JSON structure

```json
{
  "tasks": [
    {
      "id": "med_01",
      "title": "Select an OB/GYN or midwife",
      "description": "Choose your primary prenatal care provider early — practices often fill up quickly.",
      "category": "medical",
      "priority": "high",
      "suggestedWeeksBeforeDue": 30,
      "estimatedHours": 2
    }
  ]
}
```

### Fields

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique, stable identifier (e.g. `"med_01"`) — used to record which tasks users have completed or skipped |
| `title` | string | Max 55 characters, specific and actionable |
| `description` | string | One sentence explaining why this matters |
| `category` | string | One of six fixed values — see categories below |
| `priority` | string | `"high"` / `"medium"` / `"low"` — used for scheduling sort order |
| `suggestedWeeksBeforeDue` | number | How many weeks before the due date this should ideally be done by |
| `estimatedHours` | number | Rough time to complete (0.5–6) — used to fill weeks without exceeding `hoursPerWeek` |

### Categories

| Key | Label | Color |
|---|---|---|
| `medical` | Medical & Health | Amber `#EB8F30` |
| `nursery` | Nursery & Home | Sage `#44A87C` |
| `financial` | Financial & Legal | Periwinkle `#6B7FBB` |
| `gear` | Gear & Shopping | Red `#CC6060` |
| `support` | Support & Planning | Lavender `#9B7EC8` |
| `documents` | Documents & Admin | Teal `#47A8BD` |

### Full task library (~65 tasks)

**Medical & Health**
- Select an OB/GYN or midwife *(30w, high, 2h)*
- Schedule all prenatal appointments *(28w, high, 1h)*
- Complete anatomy scan and key ultrasounds *(20w, high, 0.5h)*
- Select a pediatrician *(12w, high, 2h)*
- Enroll in a childbirth class *(16w, medium, 1h)*
- Take a breastfeeding or feeding preparation class *(10w, medium, 1.5h)*
- Take an infant CPR and first aid class *(10w, medium, 3h)*
- Pre-register at the hospital or birth center *(8w, high, 1h)*
- Tour the hospital or birth center *(10w, medium, 2h)*
- Create a birth plan *(8w, medium, 2h)*
- Receive recommended vaccines — Tdap and flu *(20w, high, 0.5h)*
- Research pain management options for labor *(12w, medium, 1h)*
- Research postpartum mental health support *(14w, medium, 1h)*
- Schedule postpartum follow-up appointments *(6w, medium, 0.5h)*
- Identify a lactation consultant *(8w, medium, 1h)*

**Nursery & Home**
- Set up the crib or bassinet *(10w, high, 2h)*
- Purchase and set up a baby monitor *(10w, medium, 1h)*
- Paint or decorate the nursery *(14w, medium, 4h)*
- Assemble nursery furniture *(12w, medium, 3h)*
- Wash and organize newborn clothing by size *(6w, medium, 2h)*
- Set up a changing station *(8w, high, 1h)*
- Set up a nursing or feeding station *(8w, medium, 1h)*
- Install blackout curtains in the nursery *(10w, low, 1h)*
- Purchase a white noise machine *(8w, low, 0.5h)*
- Baby-proof electrical outlets *(8w, high, 1h)*
- Anchor heavy furniture to walls *(10w, high, 1.5h)*
- Deep clean the home before baby arrives *(4w, medium, 4h)*

**Financial & Legal**
- Research health insurance options for baby *(20w, high, 2h)*
- Add baby to health insurance within 30 days of birth *(0w, high, 1h)*
- Create a monthly baby budget *(20w, high, 2h)*
- Review and update your will *(24w, high, 3h)*
- Review and update life insurance coverage *(24w, high, 2h)*
- Update beneficiary designations on accounts *(20w, medium, 1h)*
- Research childcare costs and options *(20w, high, 3h)*
- Apply for parental or FMLA leave *(16w, high, 2h)*
- Open a college savings account (529 plan) *(16w, low, 2h)*
- Research WIC or financial assistance programs *(20w, medium, 1h)*

**Gear & Shopping**
- Purchase an infant car seat *(10w, high, 2h)*
- Have car seat installation inspected by a certified tech *(8w, high, 1h)*
- Purchase a stroller system *(12w, medium, 2h)*
- Obtain a breast pump (often covered by insurance) *(12w, high, 1h)*
- Stock up on newborn diapers and wipes *(6w, medium, 1h)*
- Set up a baby swing, bouncer, or rocker *(8w, medium, 2h)*
- Purchase a baby carrier or wrap *(10w, medium, 1h)*
- Purchase a baby bathtub *(8w, low, 0.5h)*
- Buy a diaper bag *(10w, medium, 1h)*
- Set up a bottle cleaning station and sterilizer *(8w, medium, 1h)*
- Purchase a baby thermometer and nail file kit *(6w, medium, 0.5h)*
- Stock a medicine cabinet with baby-safe essentials *(6w, medium, 1h)*

**Support & Planning**
- Plan postpartum help from family or friends *(12w, high, 1h)*
- Research and hire a postpartum doula if desired *(16w, medium, 2h)*
- Prepare freezer meals for after the birth *(6w, medium, 4h)*
- Set up a meal train with friends and family *(6w, medium, 1h)*
- Discuss newborn care responsibilities with partner *(12w, high, 1h)*
- Discuss feeding approach with partner *(12w, medium, 1h)*
- Prepare other children for the new baby *(10w, medium, 1h)*
- Prepare pets for the new baby's arrival *(10w, medium, 1h)*
- Identify your postpartum support network *(12w, medium, 1h)*
- Talk to your employer about leave logistics *(16w, high, 1h)*

**Documents & Admin**
- Pack the hospital bag *(6w, high, 2h)*
- Prepare a go-bag for the birth partner *(6w, medium, 1h)*
- Organize important documents for the hospital *(8w, high, 1h)*
- Research newborn screening tests *(10w, medium, 1h)*
- Research and decide on cord blood banking *(14w, medium, 1h)*
- Update emergency contacts *(8w, medium, 0.5h)*
- Plan your birth announcement *(10w, low, 1h)*

---

## 4. Auth & Accounts

### Provider

**Supabase Auth** — email + password for v1.

### Account types

One **plan** per household. Accounts are either **primary** (completes onboarding, creates the plan) or **partner** (invited after onboarding). Both have identical permissions within a plan.

### Auth flows

**Sign up (primary user)**
1. `/signup` — name, email, password
2. Supabase sends confirmation email
3. After confirming → `/onboarding`
4. Completing onboarding creates the plan record

**Sign in**
1. `/login` → email + password → redirect to `/today`

**Partner invite**
1. Primary user enters partner's email in Settings
2. App creates an `invites` record in Supabase with a unique token
3. Supabase sends an email with a join link: `nest.vercel.app/join?token=<token>`
4. Partner visits `/join`, creates an account, and is linked to the plan
5. Partner lands on `/today` with the full shared plan visible

> The invite email is sent directly via Supabase's built-in email — no serverless function required. If more control over email templates is needed, swap Supabase email for Resend.com (a simple SDK call from the client is fine for non-sensitive operations like this).

**Session management**

Supabase manages sessions via JWT in localStorage, with automatic refresh. On app load:

```typescript
const { data: { session } } = await supabase.auth.getSession()
if (!session) router.push('/login')
else if (!planStore.plan?.onboardingComplete) router.push('/onboarding')
else router.push('/today')
```

---

## 5. Database (Supabase / Postgres)

### Schema

```sql
CREATE TABLE plans (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  due_date            date NOT NULL,
  hours_per_week      int  DEFAULT 3,
  onboarding_complete boolean DEFAULT false,
  created_at          timestamptz DEFAULT now()
);

CREATE TABLE profiles (
  id            uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name          text NOT NULL,
  plan_id       uuid REFERENCES plans(id),
  role          text DEFAULT 'primary',  -- 'primary' | 'partner'
  is_first_baby boolean,
  has_partner   boolean,
  is_working    boolean,
  created_at    timestamptz DEFAULT now()
);

CREATE TABLE tasks (
  id                         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id                    uuid NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  library_task_id            text,         -- matches id in tasks.json; null for custom tasks
  title                      text NOT NULL,
  description                text DEFAULT '',
  category                   text NOT NULL,
  priority                   text DEFAULT 'medium',
  estimated_hours            numeric DEFAULT 1,
  suggested_weeks_before_due int,
  scheduled_week             date,         -- Sunday of the target week
  status                     text DEFAULT 'pending',
  assignment                 text DEFAULT 'shared',  -- 'shared' | profile uuid
  is_custom                  boolean DEFAULT false,
  created_at                 timestamptz DEFAULT now(),
  updated_at                 timestamptz DEFAULT now()
);

CREATE TABLE comments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id    uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  author_id  uuid REFERENCES auth.users(id),
  text       text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE invites (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id       uuid NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  invited_email text NOT NULL,
  token         text NOT NULL UNIQUE,
  accepted      boolean DEFAULT false,
  created_at    timestamptz DEFAULT now()
);
```

> **`library_task_id`** stores the `id` from `tasks.json` (e.g. `"med_01"`) for tasks sourced from the pre-built library. This allows the app to cross-reference library metadata if needed and prevents duplicates (check before inserting that no task with the same `library_task_id` exists in the plan). Custom tasks leave this null.

### Row Level Security

```sql
-- Users can only access data within their own plan
CREATE POLICY "plan members only"
  ON tasks FOR ALL
  USING (
    plan_id = (SELECT plan_id FROM profiles WHERE id = auth.uid())
  );
-- Apply equivalent policies to comments and invites
```

### Real-time sync

Subscribe to task changes so both partners see updates immediately:

```typescript
supabase
  .channel('plan-tasks')
  .on('postgres_changes', {
    event: '*', schema: 'public', table: 'tasks',
    filter: `plan_id=eq.${planId}`
  }, (payload) => {
    // Handle INSERT, UPDATE, DELETE in useTasksStore
  })
  .subscribe()
```

---

## 6. User Flow

### First-time (primary user)
```
/signup → confirm email → /onboarding (5 steps) → /today
```

### Returning user
```
/login → /today
```

### Partner
```
Invite email → /join?token=xxx → account creation → /today (shared plan)
```

### Main app
```
Bottom nav → Today / Schedule / Tasks / Progress / Settings
```

---

## 7. Onboarding Wizard

Five steps. No network calls. All task data comes from `tasks.json`.

```
Step 1: Welcome + name
Step 2: Due date → show live countdown (weeks + days)
Step 3: Profile — first baby? / has partner? / still working?
Step 4: Task selection — full library shown, grouped by category
        Each task has three states: Add to plan (default) / Already done / Skip
        Summary at bottom: "X tasks will be added to your plan"
Step 5: Hours per week (slider 1–15h) → schedule preview
        → "Create my plan" writes tasks to Supabase and marks onboarding complete
```

### Step 4 in detail

The task selection screen is the core of onboarding. It shows all ~65 tasks from `tasks.json`, grouped by category with expandable/collapsible sections.

Each task row has an inline three-state toggle:

| State | Meaning | Visual |
|---|---|---|
| **Add to plan** (default) | Will be scheduled and tracked | Selected/filled |
| **Already done** | User has done this; not added to plan | Checked-off style |
| **Skip** | Not relevant; not added to plan | Dimmed |

A sticky summary bar at the bottom of the screen updates live: "Adding 42 tasks to your plan."

Tasks filtered by profile context:
- If `hasPartner = false`, partner-specific tasks (e.g. "prepare a go-bag for your birth partner") are defaulted to **Skip** but remain visible
- If `isFirstBaby = false`, some educational tasks are defaulted to **Skip**

This is purely a UI default — the user can override any state.

---

## 8. Feature Requirements

### 8.1 Task Management

**Status cycling:** `pending → in_progress → done` (tappable inline)

**Task card expanded state:**
- Description
- Category badge + estimated hours
- Status selector (three-option inline toggle)
- Assignment toggle: Shared / Mine / Partner's
- Comments thread (append-only, shows author name + timestamp)
- "Add a note" input field

**Filtering (Tasks view):**
- Status: All / To do / In progress / Done
- Category: horizontal scroll pill row
- Assignment: All / Mine / Partner's / Shared
- All three filters are independent and apply simultaneously

**Overdue handling:**
- Tasks whose `scheduled_week` is in the past and `status !== 'done'` surface at the top of the Today view with a distinct visual treatment

### 8.2 Custom Tasks

- Available in Step 4 of onboarding ("Add your own") and via a persistent add button in the main app
- Required input: title only
- Optional: category (single-select from 6 options — user picks manually), effort level (Quick / A few hours / Big project), timing (This week / This month / Later / Closer to due date)
- Effort maps to `estimated_hours`: Quick = 0.5 / A few hours = 2 / Big project = 5
- Timing maps to `scheduled_week` directly; custom tasks bypass the scheduling algorithm
- `is_custom: true`, `library_task_id: null`
- Custom tasks behave identically to library tasks everywhere in the app

### 8.3 Partner Sharing

- Primary user invites partner from Settings by entering their email
- Partner receives an invite email and creates an account via `/join`
- After joining, partner sees the full shared plan — same tasks, same history
- Assignment toggle on each task lets either user claim or share a task
- Filtering by assignment lets each partner focus on their responsibilities
- Partner's name appears on their comments and on tasks assigned to them
- One plan supports exactly two accounts in v1

### 8.4 Schedule View

- Week navigator with back/forward arrows; current week labeled "This week"
- Tasks for selected week displayed as cards
- Mini upcoming-week list: next 4–6 weeks showing task count + completion bar, tappable to jump

### 8.5 Progress View

- Circular completion ring (overall %)
- "X of Y tasks complete" with countdown to due date
- Per-category breakdown: icon, label, done/total, linear bar
- Category completion celebration state when all tasks in a category are done
- Overall completion celebration when `pct === 100`

---

## 9. Data Models (TypeScript)

```typescript
// src/data/types.ts

type Category   = 'medical' | 'nursery' | 'financial' | 'gear' | 'support' | 'documents'
type Priority   = 'high' | 'medium' | 'low'
type Status     = 'pending' | 'in_progress' | 'done'
type TaskState  = 'add' | 'done' | 'skip'   // onboarding selection state only
type Effort     = 'quick' | 'few_hours' | 'big_project'
type Timing     = 'this_week' | 'this_month' | 'later' | 'near_due'

// Shape of each entry in tasks.json
interface LibraryTask {
  id: string
  title: string
  description: string
  category: Category
  priority: Priority
  suggestedWeeksBeforeDue: number
  estimatedHours: number
}

// Live task record (stored in Supabase)
interface Task {
  id: string                    // Supabase uuid
  planId: string
  libraryTaskId: string | null  // null for custom tasks
  title: string
  description: string
  category: Category
  priority: Priority
  estimatedHours: number
  suggestedWeeksBeforeDue: number
  scheduledWeek: string         // "YYYY-MM-DD" — always a Sunday
  status: Status
  assignment: string            // 'shared' | profile uuid
  isCustom: boolean
  comments: Comment[]
  createdAt: string
  updatedAt: string
}

interface Comment {
  id: string
  taskId: string
  authorId: string
  authorName: string
  text: string
  createdAt: string
}

interface Profile {
  id: string
  name: string
  planId: string | null
  role: 'primary' | 'partner'
  isFirstBaby: boolean | null
  hasPartner: boolean | null
  isWorking: boolean | null
}

interface Plan {
  id: string
  dueDate: string
  hoursPerWeek: number
  onboardingComplete: boolean
}
```

---

## 10. Component Architecture

```
src/
├── supabase.ts
├── App.vue
│
├── views/
│   ├── LoginView.vue
│   ├── SignupView.vue
│   ├── JoinView.vue               # /join?token=xxx partner landing
│   ├── OnboardingView.vue
│   ├── TodayView.vue
│   ├── ScheduleView.vue
│   ├── TasksView.vue
│   ├── ProgressView.vue
│   └── SettingsView.vue           # Invite partner, account info
│
├── components/
│   ├── onboarding/
│   │   ├── StepDots.vue
│   │   ├── StepWelcome.vue
│   │   ├── StepDueDate.vue
│   │   ├── StepProfile.vue
│   │   ├── StepTaskSelection.vue  # Core step: library tasks + custom add
│   │   └── StepTimePrefs.vue
│   │
│   ├── tasks/
│   │   ├── TaskCard.vue           # Collapsed + expanded states
│   │   ├── TaskList.vue
│   │   ├── StatusFilter.vue
│   │   ├── CategoryFilter.vue
│   │   ├── AssignmentFilter.vue
│   │   ├── AddTaskModal.vue       # Bottom sheet for custom task entry
│   │   └── OverdueAlert.vue
│   │
│   ├── schedule/
│   │   ├── WeekNavigator.vue
│   │   ├── WeekSummaryRow.vue
│   │   └── WeekTaskList.vue
│   │
│   └── shared/
│       ├── BottomNav.vue
│       ├── CountdownWidget.vue
│       ├── ProgressRing.vue
│       ├── LinearBar.vue
│       ├── StatusBadge.vue
│       ├── CategoryBadge.vue
│       ├── AssignmentBadge.vue
│       ├── PriorityDot.vue
│       └── TogglePill.vue
```

---

## 11. State Management (Pinia)

### `useAuthStore`

```typescript
state: { session, profile, partnerProfile }
actions: { signUp, signIn, signOut, loadProfile, loadPartnerProfile }
```

### `usePlanStore`

```typescript
state: { plan }
getters: { daysUntilDue, weeksUntilDue, extraDays, trimester, currentWeekKey }
actions: { createPlan, updatePlan, invitePartner }
```

### `useTasksStore`

```typescript
state: { tasks, loading }
getters: { tasksByWeek, overdueTasks, completionPct, categoryStats }
actions: {
  fetchTasks,
  addTask,          // used for both library-sourced and custom tasks
  updateStatus,
  setAssignment,
  addComment,
  deleteTask,
  subscribeToChanges
}
```

### `useOnboardingStore`

```typescript
state: {
  step: number
  // Map of libraryTaskId → 'add' | 'done' | 'skip'
  taskSelections: Record<string, TaskState>
}
getters: {
  selectedTasks: LibraryTask[]    // tasks with state === 'add'
  selectionCount: number
}
actions: {
  setStep(n: number): void
  setTaskState(id: string, state: TaskState): void
  applyProfileDefaults(profile: Profile): void   // pre-sets skip defaults based on profile
  finishOnboarding(hoursPerWeek: number): Promise<void>
    // 1. runs scheduleTasks() on selectedTasks
    // 2. batch-inserts into Supabase tasks table
    // 3. marks plan.onboarding_complete = true
}
```

---

## 12. Routing

```typescript
const routes = [
  { path: '/',           redirect: () => authGuard()              },
  { path: '/login',      component: LoginView,      meta: { public: true, hideNav: true } },
  { path: '/signup',     component: SignupView,      meta: { public: true, hideNav: true } },
  { path: '/join',       component: JoinView,        meta: { public: true, hideNav: true } },
  { path: '/onboarding', component: OnboardingView,  meta: { hideNav: true }               },
  { path: '/today',      component: TodayView                                              },
  { path: '/schedule',   component: ScheduleView                                           },
  { path: '/tasks',      component: TasksView                                              },
  { path: '/progress',   component: ProgressView                                           },
  { path: '/settings',   component: SettingsView                                           },
  { path: '/:pathMatch(.*)*', redirect: '/'                                                },
]
```

---

## 13. Scheduling Algorithm

Runs once when `finishOnboarding()` is called. Pure TypeScript — no dependencies.

```typescript
function scheduleTasks(tasks: LibraryTask[], dueDate: string, hoursPerWeek: number): Partial<Task>[] {
  const priorityOrder = { high: 0, medium: 1, low: 2 }

  const sorted = [...tasks].sort((a, b) => {
    if (priorityOrder[a.priority] !== priorityOrder[b.priority])
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    return a.suggestedWeeksBeforeDue - b.suggestedWeeksBeforeDue
  })

  let currentWeekStart = getWeekStart(new Date())
  let hoursUsed = 0

  return sorted.map(task => {
    const hours = task.estimatedHours ?? 1
    if (hoursUsed + hours > hoursPerWeek) {
      currentWeekStart = addDays(currentWeekStart, 7)
      hoursUsed = 0
    }
    hoursUsed += hours

    return {
      libraryTaskId:            task.id,
      title:                    task.title,
      description:              task.description,
      category:                 task.category,
      priority:                 task.priority,
      estimatedHours:           task.estimatedHours,
      suggestedWeeksBeforeDue:  task.suggestedWeeksBeforeDue,
      scheduledWeek:            toWeekKey(currentWeekStart),
      status:                   'pending',
      assignment:               'shared',
      isCustom:                 false,
    }
  })
}
```

Custom task scheduling maps user input directly to a week:

```typescript
const effortToHours: Record<Effort, number> = {
  quick: 0.5, few_hours: 2, big_project: 5
}

function customTaskWeek(timing: Timing, weeksUntilDue: number): string {
  const offsets: Record<Timing, number> = {
    this_week:  0,
    this_month: 2,
    later:      6,
    near_due:   Math.max(0, weeksUntilDue - 4),
  }
  return toWeekKey(addDays(getWeekStart(new Date()), offsets[timing] * 7))
}
```

---

## 14. Design System

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary:  '#2B3A68',
      accent:   '#EB8F30',
      success:  '#44A87C',
      info:     '#6B7FBB',
      danger:   '#CC6060',
      purple:   '#9B7EC8',
      teal:     '#47A8BD',
    },
    fontFamily: {
      sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
    },
  }
}
```

- Touch targets: minimum 44px height on all interactive elements
- Bottom nav: `position: fixed; bottom: 0` with `padding-bottom: env(safe-area-inset-bottom)` for iOS
- Cards: `rounded-xl`, `border border-gray-100 bg-white`
- Category color: 4px left border stripe on task cards, not card background
- Page background: warm off-white (`bg-gray-50`)
- Max content width: 480px, centered

---

## 15. Out of Scope (v1)

- AI-generated task lists (replaced by static library)
- Push notifications / reminders
- Drag-and-drop task reordering
- Exporting the plan as PDF
- Budget estimates per task
- Medical appointment calendar
- Hospital bag sub-checklist
- More than two users per plan
- Offline mode / service worker caching

---

## 16. Decisions Log

| Question | Decision |
|---|---|
| Hosting | Vercel |
| App name | Nest |
| Task source | Static JSON library (~65 tasks) — no AI API |
| Assignment filtering | Yes — All / Mine / Partner's / Shared |
| Partner access | Full shared plan via email invite |
| Custom task categorization | User picks manually |
| Auth provider | Supabase Auth (email + password) |
| Database | Supabase Postgres with RLS |
| Serverless functions | None required |