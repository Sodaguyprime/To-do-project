# Pixel Todos (React + Vite)

Mobile-first, single-user todo app with a pixel-art theme. Data persists in your browser via localStorage so you can update the site any time without losing your todos.

**Live demo:** [`to-dos-private.netlify.app`](https://to-dos-private.netlify.app)
For Android and ios(not tested on ios) you can hit install on the button and have it added to list of apps so you dont have to access the link everytime :)

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
- Priority: tap the priority button to cycle LOW → MEDIUM → HIGH. Old tasks default to LOW.

### Install to Home Screen (PWA)
- Android/Chrome: you’ll see an in‑app popup when install is available; tap Install.
- iOS/Safari: Share → Add to Home Screen.

## Customize
- Colors, spacing, and pixel look are defined in `src/index.css`.
- Title and labels live in `src/App.jsx`.

## Tech
- React + Vite
- Deployed on Netlify with `netlify.toml` config

## Contributing / Reuse
You can fork this repo and deploy your own instance:
1. Fork the repository on GitHub.
2. Update site name/branding in `index.html` and `src/App.jsx` if desired.
3. Deploy to Netlify (settings above). Your users’ data will stay private in their own browsers via localStorage.

## License
MIT
