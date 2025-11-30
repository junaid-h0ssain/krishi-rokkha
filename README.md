# 🌾 Krishi Rokkha — HarvestGuard

Krishi Rokkha (HarvestGuard) is a lightweight, client-first web app that helps farmers monitor crop health, view weather-driven risk, and manage crop batches. The project combines AI-assisted image scanning, weather integration, simple batch management, and local-risk visualization to make agricultural decision-making easier and more accessible.

![Status: In Development](https://img.shields.io/badge/status-in--development-orange)

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Quick start](#quick-start)
- [Environment](#environment)
- [Project structure](#project-structure)
- [Development scripts](#development-scripts)
- [Tests](#tests)
- [Contributing](#contributing)
- [License & contact](#license--contact)

## Features

- AI-powered crop image scanning (integrations for Roboflow / HuggingFace)
- Weather-based risk assessment (OpenWeatherMap)
- Batch creation and basic management interface
- Local risk map visualization with anonymized neighbor data
- Multilingual support (English / বাংলা)
- Firebase Authentication (Google / Phone OTP) and optional Firestore persistence

## Tech stack

- Frontend: HTML, CSS, vanilla JavaScript (ES Modules)
- Bundler: `vite`
- Libraries: `three` (welcome/visuals), Leaflet (maps, if used in UI), Firebase SDK

## Quick start

Prerequisites:

- Node.js (v16+)
- npm (or pnpm/yarn)

Clone and run locally:

```bash
git clone https://github.com/junaid-h0ssain/krishi-rokkha.git
cd krishi-rokkha
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Environment

This project uses Vite and environment variables prefixed with `VITE_`. Example variables used by the app include Firebase, Roboflow/HuggingFace, Cloudinary, and OpenWeatherMap keys. Environment values are referenced in `src` and `modules` files.

Create a `.env` file in the project root and add any required keys, for example:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_WEATHER_API_KEY=your_openweather_api_key
VITE_RF_API_KEY=your_roboflow_api_key
```

If you don't plan to use external APIs, the app includes mocked data in `data/` and some modules that run in offline/demo mode.

## Project structure (high level)

- `modules/` — Core feature modules (AI scan, auth, batches, weather, etc.)
- `public/` — Static HTML pages and assets
- `src/` — App entry points and client scripts
- `data/` — Mock data used for demos and local visualization
- `test_images/` — Example images for AI scanning

See the repository for more details.

## Development scripts

Scripts available in `package.json`:

- `npm run dev` — Start Vite dev server
- `npm run build` — Create production build
- `npm run preview` — Preview the production build locally

Run them from the project root, e.g.:

```bash
npm run dev
```

## Tests

There are a few `*.test.js` files in the workspace (`modules/*.test.js`) but no test runner configured in `package.json`. To add tests, install a test framework (Jest, Vitest, etc.) and add a `test` script.

## Contributing

- Report issues or feature requests via GitHub Issues.
- For code changes: fork the repo, create a feature branch, and open a pull request with a clear description.
- Please include screenshots, example images, or reproduction steps for UI/behavioral changes.

## License & contact

This project does not include a license file in the repository. If you'd like to add one, `MIT` is a common choice for open-source projects.

For questions or to collaborate, contact the maintainer: `junaid.hossain@example.com` (replace with real contact).

---

If you want, I can also:

- add badges (build/test/coverage)
- configure a test runner and add a `test` script
- create a small CONTRIBUTING.md template

