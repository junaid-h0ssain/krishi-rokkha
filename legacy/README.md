# 🌾 Krishi Rokkha — HarvestGuard
# 🌾 Krishi Rokkha (HarvestGuard)

**Krishi Rokkha** (HarvestGuard) is a comprehensive web application designed to empower farmers with modern technology. It combines AI-driven crop disease detection, real-time weather risk assessment, and efficient batch management to help farmers maximize their yield and protect their crops.

![Project Status](https://img.shields.io/badge/Status-In%20Development-orange)

## ✨ Features

-   **AI Crop Health Scanner**: Instantly analyze crop photos to detect diseases (Fresh vs. Rotten) using advanced AI models.
-   **Weather & Risk Assessment**: Get real-time weather updates and automated risk alerts for your specific crops.
-   **Batch Management**: Create, track, and manage multiple crop batches with ease.
-   **Secure Authentication**: Easy login via **Google** or **Phone (OTP)** using Firebase Authentication.
-   **Multilingual Support**: Fully localized for **English** and **Bengali (বাংলা)** speakers.
-   **Responsive Design**: Optimized for both desktop and mobile devices.
-   **Educational Resources**: Access farmer stories, research articles, and best practices.

## Tech Stack

-   **Frontend**: HTML5, CSS3, JavaScript (ES6+ Modules)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **3D Visuals**: [Three.js](https://threejs.org/) (for immersive welcome animations)
-   **Backend & Auth**: [Firebase](https://firebase.google.com/) (Authentication, Firestore)
-   **AI/ML**: Roboflow / HuggingFace API integration

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v16 or higher)
-   npm (Node Package Manager)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/fardina-tahsin/krishi-rokkha.git
    cd krishi-rokkha
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    -   Create a `.env` file in the root directory.
    -   Copy the contents of `.env.template` into `.env`.
    -   Fill in your API configuration details:
        
        **Firebase Configuration:**
        ```env
        VITE_FIREBASE_API_KEY=your_firebase_api_key
        VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
        VITE_FIREBASE_PROJECT_ID=your_project_id
        VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
        VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
        VITE_FIREBASE_APP_ID=your_app_id
        VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
        ```
        
        **Cloudinary Configuration (for image uploads):**
        ```env
        VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
        VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
        ```
        
        **HuggingFace API Configuration (for AI model):**
        ```env
        VITE_HF_API_URL=your_huggingface_api_url
        VITE_HF_API_KEY=your_huggingface_api_key
        ```
        
        **Weather API Configuration (OpenWeatherMap):**
        ```env
        VITE_WEATHER_BASE_URL=your_weather_api_url
        VITE_WEATHER_API_KEY=your_weather_api_key
        ```
        
        **Roboflow API Configuration (for crop disease detection):**
        ```env
        VITE_RF_API_URL=your_roboflow_api_url
        VITE_RF_API_KEY=your_roboflow_api_key
        ```

        **Smart Alert API Configuration (use OpenWeatherMap):**
        ```env
        VITE_SMART_AI_API_URL=your_smart_alert_api_url
        VITE_SMART_AI_API_KEY=your_smart_alert_api_key
        ```

        **Google API Configuration:**
        ```env
        VITE_GOOGLE_AI_API_KEY=your_google_api_key
        ```
    
    > **Note:** You'll need to create accounts and obtain API keys from:
    > - [Firebase](https://firebase.google.com/)
    > - [Cloudinary](https://cloudinary.com/)
    > - [HuggingFace](https://huggingface.co/)
    > - [OpenWeatherMap](https://openweathermap.org/api)
    > - [Roboflow](https://roboflow.com/)

4.  **Run the development server**
    ```bash
    npm run dev
    ```
    The app should now be running at `http://localhost:5173` (or similar). (Open in Microsoft Edge) 

It is also deployed in vercel. (Link given above)

## 📂 Project Structure

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

