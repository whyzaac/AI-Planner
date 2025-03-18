# 📅 AI-Powered Planner App

An AI-enhanced planner application that allows users to manage tasks, set reminders, and create events efficiently. The app integrates AI to generate tasks from natural language input and provides a seamless user experience with real-time updates.

## 🚀 Features

- 📝 **Task & Event Management** – Add, edit, and delete tasks/events.
- 🔮 **AI-Powered Task Creation** – Uses Google's Gemini API to convert natural language input into tasks.
- 📆 **Daily Overview** – Displays upcoming tasks and reminders on the landing page.
- ☁ **Cloud Storage & Sync** – Stores tasks and chat history using Appwrite.
- 💬 **Chat-Based Input** – Users can enter tasks via a chat interface, with memory persistence.
- 📍 **Location Support** – Allows adding location details to tasks (future feature).
- 🔔 **Push Notifications** – Planned feature to send reminders.

## 🛠️ Tech Stack

- **Frontend:** React Native (Expo Router), Tailwind CSS
- **Backend:** Appwrite (Database & Authentication)
- **AI Integration:** Gemini API (`gemini-2.0-flash-lite`)
- **State Management:** React Context API

## 📥 Installation & Setup

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/yourusername/planner-app.git
cd planner-app
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Setup Environment Variables
Create a `.env` file in the root directory and add your credentials:
```plaintext
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
APPWRITE_PROJECT_ID=your_project_id
APPWRITE_ENDPOINT=https://your-appwrite-server
```

> **Note:** Do **not** commit your `.env` file. Ensure it is added to `.gitignore`.

### 4️⃣ Start the App
```sh
npx expo start
```

## 🏗️ Future Improvements
- 🔄 **AI Auto-Scheduling** – Auto-assign tasks to optimal time slots.
- 🕹 **Voice Commands** – Support for voice-based task creation.
- 🌎 **Offline Mode** – Local storage for tasks when offline.

## 🤝 Contributions
We welcome contributions! Feel free to fork the repo, submit pull requests, and suggest features.

## 📜 License
MIT License © [Tan Yi Jun](https://github.com/whyzaac)

---
Made with ❤️ by [Tan Yi Jun](https://github.com/whyaac)

