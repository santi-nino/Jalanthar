# Jalanthar — Player's Chronicle

An interactive companion site for the Jalanthar campaign: a pan/zoomable town
map with scroll-styled building labels, a filterable building list, and a
relationship tree of the town's residents — plus a password-protected DM mode
for editing everything in-browser.

## Quick start (local preview, demo mode)

No setup required to preview it. Demo mode uses the starter content in
`src/data/mockData.js` and saves any edits only to your browser's local
storage (not shared, not persisted across devices).

```
npm install
npm run dev
```

Open the printed localhost URL. Click **DM Login** in the sidebar — in demo
mode there's no email, just a password, which you set with
`VITE_DEMO_DM_PASSWORD` in a `.env.local` file (copy `.env.example` and fill
it in). This demo login is **not secure** (the password ships in the browser
bundle) — it exists purely so you can test the edit forms before Firebase is
connected. Don't share the demo build with players as-is.

## Adding your map image

Drop your chosen town map at:

```
public/map/jalanthar-map.jpg
```

The code assumes a 1600×1600px image by default. If your map has a different
resolution or aspect ratio, update `MAP_WIDTH` / `MAP_HEIGHT` at the top of
`src/components/tabs/MapTab.jsx` to match.

Building positions are stored as **percentages** of that image (`coords: {x,
y}`, each 0–100), not pixels — so they stay correct even if you later swap in
a higher-resolution version of the same map layout.

## Connecting Firebase (for real, persistent, shared data)

Right now the site defaults to demo mode. To make DM edits actually persist
and be visible to your players live, connect a Firebase project — free tier
comfortably covers a table of players.

1. **Create the project.** Go to console.firebase.google.com -> Add project -> give it any name (e.g. "jalanthar-chronicle") -> you can skip Google Analytics.
2. **Add a web app.** In the project overview, click the `</>` (web) icon -> register an app (no need for Firebase Hosting) -> copy the `firebaseConfig` object it shows you.
3. **Create the Firestore database.** Left sidebar -> Build -> Firestore Database -> Create database -> start in **production mode** -> pick any region.
4. **Publish the security rules.** In the Firestore console, go to the Rules tab and paste in the contents of `firestore.rules` from this repo, then Publish. (This is what actually enforces "only the DM can write, and unrevealed NPCs can't be read by players" — it's not just a UI convention.)
5. **Enable Auth.** Left sidebar -> Build -> Authentication -> Get started -> enable the **Email/Password** provider -> Users tab -> Add user -> create your own DM login (any email, a real password).
6. **Local `.env.local`.** Copy `.env.example` to `.env.local` and paste in the six values from step 2's `firebaseConfig`. Run `npm run dev` again — the demo-mode banner should disappear, and DM Login will now ask for the email/password you created in step 5.
7. **(Optional) Seed starter content.** Firebase Console -> Project Settings -> Service Accounts -> Generate new private key -> save the file as `scripts/serviceAccountKey.json` -> run `npm run seed`. This pushes the example buildings/NPCs into Firestore so you're not starting from a blank database. Skip this if you'd rather add everything fresh through the DM edit panel.

## Deploying to GitHub Pages

This repo includes a GitHub Actions workflow (`.github/workflows/deploy.yml`)
that builds and deploys automatically on every push to `main`.

1. Push this repo to GitHub.
2. In the repo's **Settings > Pages**, set Source to "GitHub Actions".
3. If you connected Firebase, add the six config values as **Settings >
   Secrets and variables > Actions > Repository secrets**, using the exact
   names in the workflow file (`VITE_FIREBASE_API_KEY`, etc.). If you skip
   this, the deployed site will run in demo mode.
4. Check `vite.config.js` — `base` is set to `/jalanthar-site/`. If your
   GitHub repo has a different name, update that to match
   (`/your-repo-name/`), or to `/` if this is a `username.github.io` repo.
5. Push to `main`. The Actions tab will show the build/deploy running; once
   green, your site is live at `https://<username>.github.io/<repo-name>/`.

## How content is structured

- **Buildings** (`buildings` collection): name, subheader, type, map
  coordinates, description, interior layout, resident list, and
  type-specific fields (wares for shops, menu for taverns, services for
  temples). The "Reveal" button on a building's detail panel is a
  **local, per-visit** UI toggle for players — it isn't tracked in the
  database and isn't DM-controlled; it just paces how info is shown.
- **NPCs** (`npcs` collection): name, family, appearance, personality,
  clothing, history, and a `relationships` array (`family` / `friend` /
  `rival`, each with an optional note). The `visible` field **is**
  DM-controlled — an NPC with `visible: false` never appears on the
  Residents tab (or in a building's resident list) to players, and
  Firestore's rules block players from reading that document at all until
  you flip it on.
- **Families** (`families` collection): just a name (e.g. "The Thickets")
  and an optional description. These are the anchor nodes on the
  relationship tree; NPCs attach to them by matching `familyName`.

## Tech stack

React + Vite + Tailwind CSS v4, `react-zoom-pan-pinch` for the map,
`reactflow` for the relationship tree, Firebase (Firestore + Auth) for
storage, deployed via GitHub Actions to GitHub Pages.
