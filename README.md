# Pixel Todos (React + Vite)

Mobile-first, single-user todo app with a pixel-art theme. Data persists in your browser via localStorage so you can update the site any time without losing your todos.

## Local Setup (A → Z)

1. Prerequisites
   - Install Node.js LTS from `https://nodejs.org`
   - Optional: install Git from `https://git-scm.com`

2. Install dependencies
   ```bash
   npm install
   ```

3. Run locally
   ```bash
   npm run dev
   ```
   - Open the printed local URL on your phone (same Wi‑Fi) by replacing `localhost` with your computer IP if needed.

4. Build production assets
   ```bash
   npm run build
   ```
   - Output goes to `dist/`.

## Netlify Deployment (A → Z)

1. Push to a Git repository (GitHub, GitLab, Bitbucket).
2. In Netlify, click "Add new site" → "Import an existing project".
3. Pick your repo and set:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Click Deploy. On every push to your default branch, Netlify will auto-deploy.

Notes
- Your todos are stored in `localStorage` under the key `pixel_todos_v1`. Deploying new versions to the same site domain will keep your data.
- To reset, clear browser storage for your site.

## Usage
- Add: type a task and press "+ Add" or Enter.
- Edit: tap "Edit" (or double‑tap task text), press Enter to save.
- Complete: tap the checkbox.
- Clear Done: removes all completed tasks.
- Filter: All / Active / Done.

## Customize
- Colors, spacing, and pixel look are defined in `src/index.css`.
- Title and labels live in `src/App.jsx`.

## Tech
- React + Vite
- Deployed on Netlify with `netlify.toml` config
"# To-do-project" 
