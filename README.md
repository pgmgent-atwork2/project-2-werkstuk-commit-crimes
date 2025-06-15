# Boudewijn Seapark Quiz Application

An interactive, multilingual quiz application built for **Boudewijn Seapark**, allowing both administrators and users to manage and participate in quizzes. Users can take quizzes in Dutch (NL), French (FR), and English (EN), while admins have access to quiz creation tools and user data exports.

## 🌍 Features

### 🧑‍🎓 For Users
- Take fun and educational quizzes in **Dutch**, **French**, or **English**
- Personalized experience based on name and birthdate
- See your quiz results immediately
- Accessible interface across multiple devices

### 🛠️ For Admins
- Manage quizzes, questions, and answers visually
- Upload images for quiz questions
- Mark correct and incorrect answers
- Set password-protected access for secure admin sessions
- View user participation and responses
- Export all user data to an **Excel file** (`.xlsx`) for analysis

## 🔐 Authentication

Admins can secure their quiz management with a password. A session is valid for **2 hours and 30 minutes**, after which re-authentication is required.

## 📦 Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express
- **Database**: SQLite with Objection.js
- **Excel Export**: xlsx library
- **Multilingual Support**: Separate HTML pages per language
