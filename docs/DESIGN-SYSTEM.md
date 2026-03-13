# Maximor Design System

> **Version 1.0** | Mar 2026

The Maximor Design System defines the visual language for the Maximor ERP platform. All components use the `mx-` CSS class prefix and are defined in `src/styles/mx-styles.css`.

For the full design system specification with prototype code examples and detailed component patterns, see the Maximor Design System skill file.

---

## Brand Colors

### Primary Green Palette

| Token | Hex | Usage |
|-------|-----|-------|
| primaryGreen5 | `#154738` | Primary brand, buttons, links, active states |
| primaryGreen6 | `#134133` | Primary hover |
| primaryGreen7 | `#0f3228` | Primary active / pressed |
| primaryGreen1 | `#e8edeb` | Primary light background, row hover |
| primaryGreen2 | `#b6c6c1` | Primary light hover |

### Semantic Colors

| Purpose | Token | Hex | Background Hex |
|---------|-------|-----|----------------|
| Success | green5 | `#067f54` | `#edfdec` |
| Error | red5 | `#f03c46` | `#feeced` |
| Warning | gold6 | `#e8bf1b` | `#fffbe9` |
| Info | ledgerWhite7 | `#a3a0af` | `#f3f1fb` |

### Neutral Colors

| Purpose | Token | Hex |
|---------|-------|-----|
| Primary text | colorText | `#2D2926` |
| Secondary text | smartGrey7 | `#61636a` |
| Tertiary / placeholder | smartGrey4 | `#a0a2aa` |
| Borders | colorBorder | `#E9E9E9` |
| Page background | colorBgLayout | `#F3F3F4` |
| Container background | colorBgContainer | `#ffffff` |
| Card background | colorFillAlterSolid | `#fafafa` |
| Disabled background | smartGrey1 | `#f3f3f4` |

### Negative Value Convention

In accounting UIs, negative monetary values are displayed in red (`#f03c46`). Positive values use secondary text color (`#61636a`). Zero values use tertiary (`#a0a2aa`). Use `mx-amount-negative`, `mx-amount-positive`, or `mx-amount-zero` CSS classes.

---

## Typography

| Property | Value |
|----------|-------|
| Font family | `'Inter', system-ui, sans-serif` |
| Base size | 14px |
| Small size | 12px |
| Large size | 16px |
| Weight normal | 400 |
| Weight medium | 500 |
| Weight semibold | 600 |

### Heading Classes

- `mx-h1` — Page titles (20px, semibold)
- `mx-h2` — Section titles (16px, semibold)
- `mx-h3` — Card titles (14px, semibold)
- `mx-h4` — Subsection titles (14px, medium)
- `mx-text-secondary` — Muted text (secondary color)
- `mx-text-tertiary` — Placeholder/disabled text

---

## Spacing & Layout

Use Tailwind utility classes for all layout:

| Purpose | Class | Size |
|---------|-------|------|
| Page padding | `p-6` | 24px |
| Card body padding | `p-4` | 16px |
| Section gap | `gap-4` or `gap-6` | 16px / 24px |
| Inline element gap | `gap-2` | 8px |
| Standard radius | `rounded-md` | 6px |
| Card radius | `rounded-lg` | 8px |

---

## Component Library (21 Components)

### Input Components

| Component | CSS Class | Description |
|-----------|-----------|-------------|
| **Button** | `mx-btn-primary`, `mx-btn-default`, `mx-btn-text`, `mx-btn-link`, `mx-btn-danger` | Action buttons with 5 variants |
| **Input** | `mx-input` | Text entry, search fields |
| **InputNumber** | `mx-input-number` | Numeric input with steppers, currency/percentage formatting |
| **Select** | `mx-select` | Dropdown select (native HTML select) |
| **Checkbox** | `mx-checkbox` | Selection, table row selection |
| **Textarea** | `mx-textarea` | Multi-line text input |

### Display Components

| Component | CSS Class | Description |
|-----------|-----------|-------------|
| **Card** | `mx-card`, `mx-card-hoverable` | Containers for dashboard widgets, form sections |
| **Tag** | `mx-tag-success`, `mx-tag-processing`, `mx-tag-warning`, `mx-tag-error` | Status indicators |
| **Badge** | `mx-badge` | Notification counts, status dots, text labels |
| **Avatar** | `mx-avatar` | User/entity display with initials, icons, images |
| **Alert** | `mx-alert-success`, `mx-alert-warning`, `mx-alert-error`, `mx-alert-info` | Inline messages |
| **Progress** | `mx-progress` | Completion bars and metric gauges |

### Navigation Components

| Component | CSS Class | Description |
|-----------|-----------|-------------|
| **Tabs** | `mx-tabs`, `mx-tab` | Module navigation, content organization |
| **SegmentedTabs** | `mx-segmented` | Compact view/filter switching |
| **Breadcrumb** | `mx-breadcrumb` | Hierarchical page navigation path |
| **Pagination** | `mx-pagination` | Table pagination controls |

### Overlay Components

| Component | CSS Class | Description |
|-----------|-----------|-------------|
| **Modal** | `mx-modal` | Confirmations, forms, full-screen document preview |
| **Drawer** | `mx-drawer` | Side panels: detail views (right), filters (left) |
| **Dropdown** | `mx-dropdown` | Action menus, context menus |

### Layout Components

| Component | CSS Class | Description |
|-----------|-----------|-------------|
| **Toolbar** | `mx-toolbar` | Table toolbar with search, filters, action buttons |
| **RadioGroup** | `mx-radio-group` | Button-style toggle groups |

---

## Screen Archetypes

Maximor screens follow five recurring patterns:

### 1. Registry / List View
A table with toolbar above (search, filters, actions). The most common screen type.
- Toolbar: `mx-toolbar` with `mx-toolbar-left` (search + filters) and `mx-toolbar-right` (action buttons)
- Table: `mx-table` with sortable columns, status tags, checkbox selection, row action dropdowns
- Scrollable tables with sticky columns for wide datasets

### 2. Dashboard
KPI summary cards on top, charts in middle, activity feed or table at bottom.
- KPI cards: 3-4 across using `grid grid-cols-4 gap-4`, each `mx-card mx-card-hoverable`
- Charts: recharts (LineChart, BarChart, PieChart)
- Activity section: compact `mx-table`

### 3. Workbench / Action Screen
Split-screen layout — document preview on one side, action form on the other.
- Left panel: document/invoice viewer (scrollable)
- Right panel: form fields, status tags, approval actions
- Used across accruals, AP, AR, fixed assets

### 4. Detail View
Opened in a Drawer (`mx-drawer`, 560px from right). Shows entity details with tabs.
- Header: entity name, status tag, key metadata
- Tabs: Overview, Details, History, Audit Log
- Footer actions: Edit, Approve, Close

### 5. Report View
Full-width table with export options and date range filtering.
- Header: report title, date range select, export button
- Table: dense data, right-aligned numbers, currency formatting
- Totals row at bottom

---

## App Shell

### Sidebar
- Dark green background (`#154738`)
- 56px wide when collapsed, 240px expanded
- Module icons from lucide-react
- Active state: lighter green background with white text
- Organization logo at top, settings gear at bottom

### Topbar
- White background with bottom border
- Breadcrumbs (left), Search + Notifications + User (right)
- 48px height

### Page Layout
- Background: `#F3F3F4` (colorBgLayout)
- Content area: white cards on gray background
- Standard padding: 24px (`p-6`)

---

## Icon System

All icons use **lucide-react**. Common mappings:

| Icon | Usage |
|------|-------|
| `Plus` | Create / Add actions |
| `Search` | Search fields |
| `MoreHorizontal` | Row action menus |
| `Download` | Export / Download |
| `Filter` | Filter controls |
| `Edit` | Edit actions |
| `Trash2` | Delete actions |
| `Eye` | View / Preview |
| `CheckCircle` | Success / Complete |
| `XCircle` | Error / Failed |
| `Clock` | Pending / In Progress |
| `AlertTriangle` | Warning |
| `ArrowUpDown` | Sort controls |
| `ChevronDown` | Dropdown indicators |
| `X` | Close / Dismiss |

---

## CSS File Reference

The complete CSS is in `src/styles/mx-styles.css`. Key sections:

1. **Google Fonts** — Inter font import
2. **CSS Variables** — Color tokens as custom properties
3. **Typography** — Heading and text classes
4. **Buttons** — 5 variants with hover/active/disabled states
5. **Inputs** — Text, number, select, checkbox, textarea
6. **Tags** — 4 semantic color variants
7. **Cards** — Standard and hoverable variants
8. **Tables** — Headers, rows, cells, sticky columns, scrollable wrapper
9. **Modals & Drawers** — Overlay components with backdrop
10. **Navigation** — Tabs, segmented tabs, breadcrumbs, pagination
11. **Alerts & Badges** — Message and notification components
12. **Toolbar** — Table toolbar layout
13. **Accounting** — Negative/positive/zero amount formatting

---

*Design System version: 1.0 | Mar 2026*
