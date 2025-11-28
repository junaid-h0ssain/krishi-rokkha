# 🌾 Krishi Rokkha (HarvestGuard)

**Krishi Rokkha** (HarvestGuard) is a comprehensive web application designed to empower farmers with modern technology. It combines AI-driven crop disease detection, real-time weather risk assessment, and efficient batch management to help farmers maximize their yield and protect their crops.

![Project Status](https://img.shields.io/badge/Status-In%20Development-orange)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

-   **🤖 AI Crop Health Scanner**: Instantly analyze crop photos to detect diseases (Fresh vs. Rotten) using advanced AI models.
-   **wx Weather & Risk Assessment**: Get real-time weather updates and automated risk alerts for your specific crops.
-   **📦 Batch Management**: Create, track, and manage multiple crop batches with ease.
-   **🔐 Secure Authentication**: Easy login via **Google** or **Phone (OTP)** using Firebase Authentication.
-   **🌍 Multilingual Support**: Fully localized for **English** and **Bengali (বাংলা)** speakers.
-   **📱 Responsive Design**: Optimized for both desktop and mobile devices.
-   **📚 Educational Resources**: Access farmer stories, research articles, and best practices.

## 🛠️ Tech Stack

-   **Frontend**: HTML5, CSS3, JavaScript (ES6+ Modules)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **3D Visuals**: [Three.js](https://threejs.org/) (for immersive welcome animations)
-   **Backend & Auth**: [Firebase](https://firebase.google.com/) (Authentication, Firestore)
-   **Image Management**: [Cloudinary](https://cloudinary.com/)
-   **AI/ML**: Roboflow / HuggingFace API integration

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v16 or higher)
-   npm (Node Package Manager)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/junaid-h0ssain/krishi-rokkha.git
    cd krishi-rokkha
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    -   Create a `.env` file in the root directory.
    -   Copy the contents of `.env.template` into `.env`.
    -   Fill in your Firebase configuration details:
        ```env
        VITE_FIREBASE_API_KEY=your_api_key
        VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
        VITE_FIREBASE_PROJECT_ID=your_project_id
        VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
        VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
        VITE_FIREBASE_APP_ID=your_app_id
        VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
        ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```
    The app should now be running at `http://localhost:5173` (or similar).

## 📂 Project Structure

```
krishi-rokkha/
├── modules/                # Core feature modules
│   ├── aiScan.js           # AI scanning logic
│   ├── auth.js             # Authentication logic
│   ├── batches.js          # Batch management
│   ├── weather.js          # Weather integration
│   └── ...
├── public/                 # Static assets and HTML pages
│   ├── about.html
│   ├── farmer_stories.html
│   └── ...
├── src/                    # Main application source
│   ├── app.js              # Main app entry logic
│   ├── firebase-config.js  # Firebase setup
│   ├── style.css           # Global styles
│   ├── welcome.js          # Landing page logic
│   └── ...
├── app.html                # Main application interface
├── welcome.html            # Landing page
├── vite.config.js          # Vite configuration
└── package.json            # Dependencies and scripts
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
