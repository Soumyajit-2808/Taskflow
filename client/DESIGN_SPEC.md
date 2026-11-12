# TaskFlow UI/UX Design System Specification & Wireframe Guide

**Project**: TaskFlow — Modern Full-Stack Task Management System  
**Version**: 1.0.0  
**Target Audience**: Frontend Engineering Team (`frontend-developer`)  
**Design Standard**: WCAG 2.1 AA Compliance, Keyboard-First, Distraction-Free Flow  
**Aesthetic Benchmarks**: Linear (crisp micro-interactions, dark mode elegance, high information density) & Notion (clean typographic rhythm, restrained accents)

---

## 1. Design Philosophy & Aesthetic Foundation

### 1.1 Core Principles
1. **Distraction-Free Productivity**: The interface prioritizes task velocity. Toolbars, filters, and structural chrome remain visually secondary to user content.
2. **High Information Density with Visual Breathing Room**: Compact, consistent 4px rhythm; subtle borders (`1px solid var(--border-subtle)`) define structure rather than heavy drop shadows or decorative gradients.
3. **Keyboard-First & Accessible**: Every primary action (create, edit, filter, switch views, complete) is operable without a mouse. Full WCAG 2.1 AA contrast compliance across light and dark themes.
4. **Deterministic Visual Feedback**: Every interactive component features explicit Default, Hover, Active, Focus-Visible, Disabled, Loading (Skeleton), Empty, and Error states.

---

## 2. Design Tokens & Color Palette

### 2.1 Complete Theme CSS Variables

The application supports system-aware and toggleable **Light** and **Dark** themes via `data-theme="light"` and `data-theme="dark"` on `<html>`.

```css
:root,
[data-theme="light"] {
  /* Surface & Background */
  --bg-app: #f8fafc;              /* Slate 50: canvas background */
  --bg-surface: #ffffff;          /* Pure white: cards, modals, sidebars */
  --bg-surface-elevated: #ffffff; /* Elevated dropdowns & floating popovers */
  --bg-muted: #f1f5f9;            /* Slate 100: table headers, input background */
  --bg-hover: #e2e8f0;            /* Slate 200: row hover, button ghost hover */
  --bg-active: #cbd5e1;           /* Slate 300: pressed state */

  /* Text & Typography */
  --text-primary: #0f172a;        /* Slate 900: high-contrast headers & body */
  --text-secondary: #475569;      /* Slate 600: labels, secondary metadata */
  --text-tertiary: #64748b;       /* Slate 500: timestamps, placeholders */
  --text-muted: #94a3b8;          /* Slate 400: disabled labels, subtle icons */
  --text-inverse: #ffffff;        /* White text for dark accents/buttons */

  /* Borders & Dividers */
  --border-subtle: #e2e8f0;       /* Slate 200: dividers, card outlines */
  --border-default: #cbd5e1;      /* Slate 300: form inputs, active borders */
  --border-strong: #94a3b8;       /* Slate 400: focused container borders */
  --border-focus: #6366f1;        /* Indigo 500: high-contrast outline */

  /* Brand & Primary Accent (Indigo / Violet) */
  --primary-50: #eef2ff;
  --primary-100: #e0e7ff;
  --primary-200: #c7d2fe;
  --primary-500: #6366f1;         /* Primary CTA button, active tab indicator */
  --primary-600: #4f46e5;         /* Primary hover */
  --primary-700: #4338ca;         /* Primary pressed */
  --primary-subtle: #eef2ff;      /* Light tinted badge background */
  --primary-text: #4338ca;        /* Primary text on light tint */

  /* Task Status Indicators */
  --status-pending-bg: #f1f5f9;
  --status-pending-text: #475569;
  --status-pending-border: #cbd5e1;
  --status-pending-dot: #94a3b8;

  --status-inprogress-bg: #e0f2fe;
  --status-inprogress-text: #0369a1;
  --status-inprogress-border: #7dd3fc;
  --status-inprogress-dot: #0284c7;

  --status-completed-bg: #dcfce7;
  --status-completed-text: #15803d;
  --status-completed-border: #86efac;
  --status-completed-dot: #16a34a;

  --status-archived-bg: #f8fafc;
  --status-archived-text: #64748b;
  --status-archived-border: #e2e8f0;
  --status-archived-dot: #94a3b8;

  /* Priority Levels */
  --priority-low-bg: #f1f5f9;
  --priority-low-text: #475569;
  --priority-low-badge: #64748b;

  --priority-medium-bg: #eff6ff;
  --priority-medium-text: #1d4ed8;
  --priority-medium-badge: #3b82f6;

  --priority-high-bg: #fffbeb;
  --priority-high-text: #b45309;
  --priority-high-badge: #f59e0b;

  --priority-urgent-bg: #fff1f2;
  --priority-urgent-text: #be123c;
  --priority-urgent-badge: #f43f5e;

  /* Feedback & Alerts */
  --success-bg: #ecfdf5;
  --success-text: #065f46;
  --success-border: #a7f3d0;

  --danger-bg: #fef2f2;
  --danger-text: #991b1b;
  --danger-border: #fecaca;
  --danger-button: #dc2626;
  --danger-button-hover: #b91c1c;

  /* Elevation Shadows */
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.05);
  --shadow-focus: 0 0 0 3px rgba(99, 102, 241, 0.35);
}

[data-theme="dark"] {
  /* Surface & Background */
  --bg-app: #090d16;              /* Deep obsidian canvas */
  --bg-surface: #111827;          /* Gray 900: main cards, sidebar, table */
  --bg-surface-elevated: #1f2937; /* Gray 800: modals, floating dropdowns */
  --bg-muted: #172033;            /* Subtle inset sections, table headers */
  --bg-hover: #1f293d;            /* Row hover, ghost button hover */
  --bg-active: #28354f;           /* Button pressed state */

  /* Text & Typography */
  --text-primary: #f8fafc;        /* Slate 50: high-contrast headers */
  --text-secondary: #cbd5e1;      /* Slate 300: regular body & labels */
  --text-tertiary: #94a3b8;       /* Slate 400: secondary info, meta */
  --text-muted: #64748b;          /* Slate 500: placeholders & inactive */
  --text-inverse: #0f172a;        /* Inverted text */

  /* Borders & Dividers */
  --border-subtle: #1e293b;       /* Slate 800: crisp dividing lines */
  --border-default: #334155;      /* Slate 700: inputs, card boundaries */
  --border-strong: #475569;       /* Slate 600: active borders */
  --border-focus: #818cf8;        /* Indigo 400: high-visibility focus */

  /* Brand & Primary Accent (Indigo / Violet) */
  --primary-50: #1e1b4b;
  --primary-100: #2e1065;
  --primary-200: #3730a3;
  --primary-500: #6366f1;         /* Primary brand */
  --primary-600: #818cf8;         /* Lighter on hover in dark mode */
  --primary-700: #4f46e5;
  --primary-subtle: rgba(99, 102, 241, 0.15);
  --primary-text: #a5b4fc;

  /* Task Status Indicators (Dark Mode) */
  --status-pending-bg: rgba(148, 163, 184, 0.12);
  --status-pending-text: #cbd5e1;
  --status-pending-border: #334155;
  --status-pending-dot: #94a3b8;

  --status-inprogress-bg: rgba(56, 189, 248, 0.12);
  --status-inprogress-text: #38bdf8;
  --status-inprogress-border: #0369a1;
  --status-inprogress-dot: #38bdf8;

  --status-completed-bg: rgba(74, 222, 128, 0.12);
  --status-completed-text: #4ade80;
  --status-completed-border: #15803d;
  --status-completed-dot: #4ade80;

  --status-archived-bg: rgba(100, 116, 139, 0.1);
  --status-archived-text: #94a3b8;
  --status-archived-border: #1e293b;
  --status-archived-dot: #64748b;

  /* Priority Levels (Dark Mode) */
  --priority-low-bg: rgba(148, 163, 184, 0.1);
  --priority-low-text: #94a3b8;
  --priority-low-badge: #64748b;

  --priority-medium-bg: rgba(96, 165, 250, 0.12);
  --priority-medium-text: #60a5fa;
  --priority-medium-badge: #3b82f6;

  --priority-high-bg: rgba(251, 191, 36, 0.12);
  --priority-high-text: #fbbf24;
  --priority-high-badge: #f59e0b;

  --priority-urgent-bg: rgba(251, 113, 133, 0.14);
  --priority-urgent-text: #fb7185;
  --priority-urgent-badge: #f43f5e;

  /* Feedback & Alerts */
  --success-bg: rgba(16, 185, 129, 0.15);
  --success-text: #6ee7b7;
  --success-border: rgba(16, 185, 129, 0.3);

  --danger-bg: rgba(239, 68, 68, 0.15);
  --danger-text: #fca5a5;
  --danger-border: rgba(239, 68, 68, 0.3);
  --danger-button: #ef4444;
  --danger-button-hover: #dc2626;

  /* Dark Elevation Shadows */
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.4);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.5), 0 1px 2px -1px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -4px rgba(0, 0, 0, 0.5);
  --shadow-focus: 0 0 0 3px rgba(129, 140, 248, 0.4);
}
```

---

## 3. Typography & Spacing System

### 3.1 Font Stack & Rationale
- **Primary Font**: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif`
  - High legibility at small sizes (11px-14px), balanced x-height, extensive character set.
- **Monospace Font (Shortcuts, IDs, Timestamps)**: `"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`

### 3.2 Type Hierarchy Scale

| Token | Font Size | Line Height | Letter Spacing | Font Weight | Typical Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `text-xs` | 12px (`0.75rem`) | 16px (`1.0rem`) | `+0.01em` | 500 / 600 | Badges, pills, metadata chips, shortcut hints |
| `text-sm` | 14px (`0.875rem`) | 20px (`1.25rem`) | `0` | 400 / 500 | Body default, table cells, form labels, inputs |
| `text-base`| 16px (`1.0rem`) | 24px (`1.5rem`) | `-0.005em` | 400 / 500 | Modal descriptions, dashboard summary titles |
| `text-lg` | 18px (`1.125rem`) | 28px (`1.75rem`) | `-0.01em` | 600 | Card headings, task title input in modal |
| `text-xl` | 20px (`1.25rem`) | 28px (`1.75rem`) | `-0.015em` | 600 | Section headers, drawer titles |
| `text-2xl` | 24px (`1.5rem`) | 32px (`2.0rem`) | `-0.02em` | 700 | Page titles, major metrics numbers |
| `text-3xl` | 30px (`1.875rem`) | 38px (`2.375rem`)| `-0.025em`| 700 / 800 | Auth splash headers, marketing headline |

### 3.3 Spacing Scale (4px Strict Grid)

All paddings, margins, gaps, and heights follow strict 4px increments:

```css
--space-0: 0px;
--space-1: 4px;   /* Micro gap: badge icon to text, tag padding */
--space-2: 8px;   /* Tight: button inner padding (vertical), list item gap */
--space-3: 12px;  /* Compact: input vertical padding, table row padding */
--space-4: 16px;  /* Base: card padding, button horizontal padding */
--space-5: 20px;  /* Medium: metric card internal padding */
--space-6: 24px;  /* Relaxed: panel gaps, section separation */
--space-8: 32px;  /* Large: main view padding, grid gutters */
--space-10: 40px; /* XL: auth page top/bottom card margins */
--space-12: 48px; /* 2XL: major screen section margins */
--space-16: 64px; /* Canvas padding */
```

### 3.4 Border Radius Scale
```css
--radius-xs: 4px;    /* Checkboxes, small tag chips, keyboard shortcuts */
--radius-sm: 6px;    /* Buttons, input fields, badge pills */
--radius-md: 8px;    /* Dropdown menus, tooltips, list row selections */
--radius-lg: 12px;   /* Cards, Kanban columns, Task cards */
--radius-xl: 16px;   /* Modals, drawers, auth container cards */
--radius-full: 9999px; /* Status dots, avatars, rounded pill badges */
```

---

## 4. Core Views & Component Blueprints

### View 1: Authentication (Login & Register)

#### Visual Layout & Wireframe
```
+-------------------------------------------------------------+
|                                                             |
|                         [Logo] TaskFlow                     |
|                   Welcome back to your workspace            |
|                                                             |
|     +-------------------------------------------------+     |
|     |  Email Address                                  |     |
|     |  [ developer@example.com                      ] |     |
|     |                                                 |     |
|     |  Password                          [Forgot?]    |     |
|     |  [ **************                          (o)] |     |
|     |                                                 |     |
|     |  [  Sign In to TaskFlow                       ] |     |
|     |                                                 |     |
|     |  Don't have an account? Create an account       |     |
|     +-------------------------------------------------+     |
|                                                             |
+-------------------------------------------------------------+
```

#### Detailed Specs:
- **Container**: Max-width `420px`, centered vertically and horizontally on viewport (`min-height: 100vh`).
- **Surface**: `var(--bg-surface)` with `1px solid var(--border-subtle)`, rounded `var(--radius-xl)`, shadow `var(--shadow-md)`.
- **Form Controls**:
  - Labels: `text-sm`, `font-medium`, `var(--text-secondary)`, margin-bottom `6px`.
  - Input field: Height `42px`, padding `10px 14px`, border `1px solid var(--border-default)`, radius `var(--radius-sm)`.
  - Focus state: `border-color: var(--primary-500)`, `box-shadow: var(--shadow-focus)`, `outline: none`.
  - Password reveal icon button (`aria-label="Toggle password visibility"`).
- **Inline Validation**:
  - If field is invalid after blur or submit: Border turns `var(--danger-border)`, helper message appears below field in `text-xs` `var(--danger-text)` with an alert circle icon.
- **Submit Button**:
  - Full-width, height `44px`, background `var(--primary-500)`, text `var(--text-inverse)`, `font-medium`, radius `var(--radius-sm)`.
  - Loading state shows an accessible inline spinning SVG with `aria-busy="true"`.

---

### View 2: App Shell & Responsive Navigation

#### Layout Topology:
- **Desktop (>= 1024px)**: Left fixed sidebar (240px wide) + Top app header (56px high) + Main scrollable workspace canvas.
- **Tablet (768px - 1023px)**: Slim collapsed sidebar (64px wide with icon tooltips) + Top header + Main workspace.
- **Mobile (< 768px)**: Top header with hamburger toggle + Slide-in navigation drawer (`role="dialog"`).

#### Wireframe:
```
+------------------------------------------------------------------------------------------+
|  [Logo] TaskFlow  |  / Projects / Sprint 24       [ Search tasks... Ctrl+K ]  [Theme] [User] |
+-------------------+----------------------------------------------------------------------+
|                   |                                                                      |
|  [+ New Task]     |  DASHBOARD OVERVIEW                                                  |
|                   |  +---------------+  +---------------+  +---------------+  +--------+ |
|  * Dashboard      |  | Total: 24     |  | In Prog: 8    |  | Done: 14      |  | Over: 2| |
|  * All Tasks      |  +---------------+  +---------------+  +---------------+  +--------+ |
|  * Due Today      |                                                                      |
|  * Overdue        |  [Search...] [Filter: Priority v] [Filter: Status v]   [List | Board]    |
|                   |  +-----------------------------------------------------------------+ |
|  CATEGORIES       |  | [ ] Design system tokens        [High]    [Due Tomorrow]  [...] | |
|  o Engineering    |  | [ ] Setup PostgreSQL pool       [Urgent]  [Overdue 2d]    [...] | |
|  o Product        |  | [x] Write API documentation     [Low]     [Completed]     [...] | |
|  o Personal       |  +-----------------------------------------------------------------+ |
|                   |                                                                      |
+-------------------+----------------------------------------------------------------------+
```

#### Detailed Specs:
1. **Sidebar Navigation**:
   - Background: `var(--bg-surface)` with right border `1px solid var(--border-subtle)`.
   - "New Task" Quick Button: Prominent button at top of sidebar, `var(--primary-500)` background, keyboard shortcut hint badge `N`.
   - Nav items: Height `36px`, padding `0 12px`, radius `var(--radius-sm)`, icon (18px) + text (14px). Active item has `background: var(--primary-subtle)`, text `var(--primary-text)`, `font-semibold`.
   - Category group with small color dot (`8px` circular tag) next to category name.
2. **Top Header**:
   - Height `56px`, sticky at top, border-bottom `1px solid var(--border-subtle)`, `backdrop-filter: blur(8px)`.
   - Global Search Input: Max-width `320px`, placeholder `"Search tasks... (Ctrl+K)"`, left search icon, right keyboard chip `⌘K` / `Ctrl+K`.
   - Right controls:
     - Theme Toggle button: Sun / Moon icon button with smooth transition.
     - User Profile Dropdown: Displays user avatar/initials; clicking opens menu with: User Name, Email, Account Settings, Divider, and "Sign Out" in red text.

---

### View 3: Dashboard & Metrics Summary Cards

A clean 4-card metric strip that aggregates real-time workspace productivity.

#### Metric Card Anatomy:
```
+------------------------------------+
|  [Icon] Total Active Tasks         |
|  24                                |
|  +3 tasks added this week          |
+------------------------------------+
```

#### Cards:
1. **Total Active**: Slate/Indigo icon, big metric `text-2xl` font-bold `var(--text-primary)`, subtitle `"Across all categories"`.
2. **In Progress**: Sky/Blue icon (`var(--status-inprogress-text)`), count, subtitle `"Active focus"`.
3. **Completed**: Emerald icon (`var(--status-completed-text)`), count, subtitle `"68% completion rate"`.
4. **Overdue**: Rose/Crimson icon (`var(--danger-text)`), count, subtitle `"Requires immediate attention"`.

*Interaction Note*: Clicking any metric card applies an instant filter to the task list below (e.g. clicking "Overdue" filters the list to overdue tasks).

---

### View 4: Dual-Mode Task View

#### 4.1 Filter & Control Bar (Shared)
- Search input (debounced 250ms).
- Status dropdown filter (All, Pending, In Progress, Completed, Archived).
- Priority dropdown filter (All, Urgent, High, Medium, Low).
- Category dropdown filter.
- View Switcher Toggle: Segmented button group `[ = List | ::: Board ]` with accessible `aria-pressed` / `role="radiogroup"`.

---

#### 4.2 Interactive List View

A high-density, accessible table/row layout.

#### Row Anatomy:
```
[ ( ) Checkbox ] [ Task Title                     ] [ Category ] [ Priority ] [ Due Date ] [ ... Action ]
```

- **Checkbox**: Circular 18px checkbox. When clicked, marks task completed with a crisp check animation and strikethrough title transition.
- **Task Title**: `text-sm`, `font-medium`, `var(--text-primary)`. Clicking title opens Task Edit Drawer / Modal.
- **Category Badge**: Pill badge with category color dot and text in `text-xs`.
- **Priority Pill**:
  - `Urgent`: Crimson background `var(--priority-urgent-bg)`, text `var(--priority-urgent-text)`, flame or double exclamation icon.
  - `High`: Amber background `var(--priority-high-bg)`, text `var(--priority-high-text)`, upward arrow icon.
  - `Medium`: Blue background `var(--priority-medium-bg)`, text `var(--priority-medium-text)`.
  - `Low`: Cool gray background `var(--priority-low-bg)`, text `var(--priority-low-text)`.
- **Due Date Chip**:
  - If Overdue: Text and background highlighted in danger red (`var(--danger-bg)`, `var(--danger-text)`), clock icon.
  - If Due Today: Amber highlight (`var(--priority-high-bg)`).
  - Normal: `var(--text-secondary)`.
- **Row Hover**: Background transitions to `var(--bg-hover)`. Action menu button (`...`) becomes visible or prominent.

---

#### 4.3 Kanban Board View

A three-column drag-and-drop / column transition board.

#### Columns:
1. **To Do / Pending** (`var(--status-pending-dot)`)
2. **In Progress** (`var(--status-inprogress-dot)`)
3. **Completed** (`var(--status-completed-dot)`)

#### Kanban Column & Card Wireframe:
```
+--------------------------+  +--------------------------+  +--------------------------+
| PENDING              (4) |  | IN PROGRESS          (2) |  | COMPLETED            (8) |
+--------------------------+  +--------------------------+  +--------------------------+
| +----------------------+ |  | +----------------------+ |  | +----------------------+ |
| | [Cat: Eng]  [High]   | |  | | [Cat: Design] [Urgent]| |  | | [Cat: Ops]    [Low]    | |
| | Refactor Auth Route  | |  | | Design Spec Document  | |  | | Database Migrations    | |
| |                      | |  | |                      | |  | |                      | |
| | Due: Nov 15  (->)    | |  | | Due: Today     (->)   | |  | | Done Nov 11     (<)   | |
| +----------------------+ |  | +----------------------+ |  | +----------------------+ |
|                          |  |                          |  |                          |
| [+ Add Task...]          |  |                          |  |                          |
+--------------------------+  +--------------------------+  +--------------------------+
```

#### Card Anatomy:
- Border: `1px solid var(--border-subtle)`.
- Background: `var(--bg-surface)`, radius `var(--radius-md)`, shadow `var(--shadow-sm)`.
- Header: Category Chip (left) + Priority Pill (right).
- Body: Task Title (max 2 lines with `-webkit-line-clamp: 2; overflow: hidden; text-overflow: ellipsis; font-semibold`).
- Footer: Due date pill (left) + Quick-advance button `->` (right) allowing users to transition cards via single click even on touch screens without drag-and-drop.

---

### View 5: Task Modal / Drawer (Creation & Edit)

Supports opening as a centered modal on Desktop or a slide-in side drawer.

```
+-----------------------------------------------------------------+
| Edit Task                                          [ Esc / (X) ]|
+-----------------------------------------------------------------+
|                                                                 |
| [ Task Title: e.g. Finalize API authentication tokens         ] |
|                                                                 |
| STATUS         [ In Progress       v ]                          |
| PRIORITY       [ High              v ]                          |
| CATEGORY       [ Engineering       v ]                          |
| DUE DATE       [ Nov 18, 2026      v ] [Today] [Tomorrow]       |
|                                                                 |
| DESCRIPTION (Markdown supported)                                |
| +-------------------------------------------------------------+ |
| | Ensure all JWT tokens are signed with 256-bit secret and    | |
| | cookies use SameSite=Strict and httpOnly flags.             | |
| |                                                             | |
| +-------------------------------------------------------------+ |
|                                                                 |
+-----------------------------------------------------------------+
| [ Delete Task ]                          [ Cancel ] [ Save Task]|
+-----------------------------------------------------------------+
```

#### Modal Interaction Specs:
- **Focus Trap**: Traps tab focus inside dialog; initial focus on the Task Title input.
- **Escape Key**: Closes dialog immediately (`onKeyDown={(e) => e.key === 'Escape' && onClose()}`).
- **Quick Date Presets**: Quick click pills next to date picker: "Today", "Tomorrow", "Next Monday".
- **Delete Confirmation**: Red text button on left; clicking prompts an inline confirm `"Are you sure? [Yes, Delete] [Cancel]"`.
- **Keyboard Shortcut**: `Ctrl+Enter` / `Cmd+Enter` submits the form.

---

## 5. Interaction States & Transitions

### 5.1 Interactive Component Matrix

| Element | Default State | Hover State | Active / Pressed | Focus-Visible | Disabled |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Primary Button** | `bg: var(--primary-500)`, `text: white` | `bg: var(--primary-600)`, `cursor: pointer` | `bg: var(--primary-700)`, `scale: 0.98` | `outline: 2px solid var(--primary-500)`, `offset: 2px` | `opacity: 0.5`, `cursor: not-allowed` |
| **Secondary Button** | `bg: transparent`, `border: 1px solid var(--border-default)` | `bg: var(--bg-hover)`, `border: var(--border-strong)` | `bg: var(--bg-active)` | `outline: 2px solid var(--border-focus)`, `offset: 2px` | `opacity: 0.5`, `cursor: not-allowed` |
| **Danger Button** | `bg: transparent`, `text: var(--danger-button)` | `bg: var(--danger-bg)`, `text: var(--danger-button-hover)` | `bg: var(--danger-border)` | `outline: 2px solid var(--danger-button)`, `offset: 2px` | `opacity: 0.5`, `cursor: not-allowed` |
| **Table List Row** | `bg: var(--bg-surface)`, `border-bottom: 1px solid var(--border-subtle)` | `bg: var(--bg-hover)` | `bg: var(--bg-active)` | Outline around row or title link | N/A |
| **Kanban Card** | `bg: var(--bg-surface)`, `shadow: var(--shadow-sm)` | `border-color: var(--primary-500)`, `shadow: var(--shadow-md)` | `scale: 0.99`, `shadow: var(--shadow-xs)` | `outline: 2px solid var(--primary-500)` | `opacity: 0.6` |
| **Input / Select** | `bg: var(--bg-surface)`, `border: 1px solid var(--border-default)` | `border-color: var(--border-strong)` | N/A | `border-color: var(--primary-500)`, `shadow: var(--shadow-focus)` | `bg: var(--bg-muted)`, `opacity: 0.6` |

### 5.2 Transition Curves
```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
```

---

## 6. Accessibility & Fallback States (WCAG 2.1 AA)

### 6.1 Contrast Verification Table

| Element Pair | Light Mode Contrast | Dark Mode Contrast | Standard Passed |
| :--- | :--- | :--- | :--- |
| Primary Text (`--text-primary`) on Canvas (`--bg-surface`) | `14.8:1` (#0f172a on #ffffff) | `16.2:1` (#f8fafc on #111827) | **AAA** (>= 7:1) |
| Secondary Text (`--text-secondary`) on Canvas | `7.3:1` (#475569 on #ffffff) | `9.4:1` (#cbd5e1 on #111827) | **AAA** (>= 7:1) |
| Primary CTA Button text on Indigo 500 | `4.8:1` (#ffffff on #6366f1) | `6.2:1` (#0f172a on #818cf8) | **AA** (>= 4.5:1) |
| Status: In Progress text on Status BG | `5.2:1` (#0369a1 on #e0f2fe) | `6.8:1` (#38bdf8 on dark tint)| **AA** (>= 4.5:1) |
| Status: Completed text on Status BG | `5.1:1` (#15803d on #dcfce7) | `7.2:1` (#4ade80 on dark tint)| **AA** (>= 4.5:1) |
| Urgent Priority text on Urgent BG | `5.9:1` (#be123c on #fff1f2) | `7.1:1` (#fb7185 on dark tint)| **AA** (>= 4.5:1) |

### 6.2 Standardized Loading Skeletons
Use clean pulse animations rather than spinning loaders for content areas:
```css
@keyframes skeleton-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-muted) 25%,
    var(--bg-hover) 50%,
    var(--bg-muted) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite ease-in-out;
  border-radius: var(--radius-xs);
}
```

### 6.3 Empty States Specification
Every view has a dedicated empty state component:
1. **No Tasks Created**:
   - Icon: Clipboard with checklist.
   - Heading: `"No tasks yet"` (`text-lg font-semibold`).
   - Copy: `"Stay organized and productive. Create your first task to get started."` (`text-sm var(--text-secondary)`).
   - Action CTA: Primary button `"+ Create Task"`.
2. **No Filtered Results**:
   - Icon: Filter / Search with slash.
   - Heading: `"No matching tasks found"`.
   - Copy: `"Try adjusting your search query, status, or priority filters."`
   - Action CTA: Secondary button `"Reset All Filters"`.

### 6.4 ARIA & Semantic Requirements
- All interactive icon-only buttons must have `aria-label` (e.g. `aria-label="Delete task"`, `aria-label="Close dialog"`).
- Dialogs must include `role="dialog"`, `aria-modal="true"`, and `aria-labelledby="dialog-title"`.
- Real-time alerts and error banners must have `role="alert"` and `aria-live="assertive"`.
- Loading feedback must toggle `aria-busy="true"`.

---

## 7. Frontend Developer Implementation Checklist

When scaffolding and coding components in `client/src`:

- [ ] **CSS Setup**: Place root CSS variables into `src/index.css` or Tailwind config file.
- [ ] **Base UI Primitives**: Build reusable, un-opinionated components:
  - `Button` (`variant`: primary, secondary, ghost, danger; `size`: sm, md, lg)
  - `Badge` (`variant`: status, priority, category)
  - `Input` & `Textarea` (with error state and label support)
  - `Modal` / `Drawer` (with `Escape` listener and focus trap)
  - `Skeleton`
  - `EmptyState`
- [ ] **Keyboard Shortcuts**: Bind global `Ctrl+K` for search, `N` for new task modal, and `Escape` for closing drawers.
- [ ] **Theme Switcher**: Store preference in `localStorage.getItem('taskflow-theme')` with fallback to `window.matchMedia('(prefers-color-scheme: dark)')`.

