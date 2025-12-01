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

## 🏆 Onsite Challenges 

These tasks were implemented during the onsite session to simulate real-world decision-making, interactivity, and accessibility for farmers.

## Local Risk Landscape Visualization

  - Description: Establishes a Local Risk Map to promote community awareness of spoilage threats.

  - Features:

    - Responsive map (Leaflet.js) centered on the farmer’s district.

    - Mock neighbor data: 10–15 anonymous farms with coordinates and risk levels (Low/Medium/High).

  - Pin Visualization:

       - Farmer’s own location → blue pin
        
       -  Neighbor locations → color-coded markers (Green = Low, Yellow = Medium, Red = High)
         
       - Bangla pop-ups showing General Crop Type, Current Risk Level, and Last Update Time (mocked).
        
       - Touch-friendly interactivity: panning and zooming.
        
       - Privacy: All neighbor data completely anonymous.

## Smart Alert System (Decision Engine)

  - Description: Generates specific actionable advice in Bangla based on crop type, weather, and risk levels.

  - Features:

       - Bad alert example: “Weather is bad.”

       - Good alert example: “আগামীকাল বৃষ্টি় হবে এবং আপনার আলুর গুদামে আর্দ্রতা বেশি। এখনই ফ্যান চালু করুন।”

       - Critical risk triggers a simulated SMS notification in the browser console.

## Bangla Voice/Touchless Interface

  - Description: Farmers can ask questions in spoken Bangla and get spoken answers.

  - Features:

       - Uses Web Speech API for recognition + synthesis (language: bn-BD).

       - Supports 4–5 common questions:

            - “আজকে র আবহাওয়া?”
            
            - “আমার ধানে র অবস্থা?”
            
            - “গুদামে কী করব?”
            
            - “কবে কাটব?”

  - Spoken answers generated dynamically based on mock data.
  
## Team Members
- Fardina Tahsin (Full Stack)
- Sujit Mohajon (Full Stack)
- Junaid Hossain (Backend)
