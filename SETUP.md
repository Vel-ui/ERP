# Maximor ERP – Setup & Run

## Quick start (no terminal needed)

**Double-click `install-and-run.bat`** in this folder.  
It will install dependencies and start the dev server. Then open http://localhost:3000 in your browser.

---

## Why Cursor’s agent terminal fails

Your project path includes an apostrophe: `Vel's Dev`.  
That triggers a bug in Cursor’s PowerShell terminal wrapper, so agent terminal commands fail.

### Option A: Use the batch file (recommended)

Double-click `install-and-run.bat` whenever you need to install or run the app. No terminal needed.

### Option B: Rename the folder (fixes agent terminal)

1. Close Cursor.
2. In File Explorer, rename `Vel's Dev` → `Vels Dev` (or `Vel Dev`).
3. Reopen the project from the new path.

After that, Cursor’s agent terminal should work normally.

### Option C: Change Cursor settings

1. Press **Ctrl+Shift+J** to open Cursor Settings.
2. Go to **Agents → Inline Editing & Terminal**.
3. Turn **ON** the **Legacy Terminal Tool** option.

---

## Manual commands

From a normal Command Prompt or PowerShell:

```bash
npm install
npm run dev
```

Then open http://localhost:3000.
