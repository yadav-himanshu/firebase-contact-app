# 📱 ContactHub

**ContactHub** is a premium, full-stack contact management platform built with **React** and **Firebase**. It transforms the traditional address book into a collaborative social experience, featuring real-time sharing, secure authentication, and a data-driven dashboard.

> **Live Demo**: [ContactHub Live](https://firebase-contact-app-gold.vercel.app/)

---

## ✨ Key Features

### 🔐 Advanced Authentication
- **Secure Onboarding**: Sign up with traditional email/password or use **Google Social Login** for instant access.
- **Automated Sync**: User profiles are automatically synced to a global sharing directory upon login.
- **Account Protection**: Built-in re-authentication guards for sensitive email/password updates.

### 🤝 Professional Contact Sharing
- **Request/Approval Workflow**: Securely request access to view another user's contacts via their email.
- **Granular Control**: Approve, deny, or revoke access at any time from the centralized sharing settings.
- **Dynamic Views**: People who share their contacts with you appear automatically in your sidebar for instant access.

### 📊 Real-time Dashboard & Insights
- **Stats Overview**: Get immediate insights into your Total Contacts, Favorites, and Shared Connections.
- **Live Search**: Instant, debounced filtering of your entire network.
- **Persistent Notifications**: A Firestore-backed activity feed tracks all contact additions, edits, and sharing requests.

### 💎 Premium UI/UX
- **Soft UI Design**: A modern, glassmorphic aesthetic focused on readability and elegance.
- **Fluid Animations**: Smooth transitions and layout changes powered by **Framer Motion**.
- **Iconic Visuals**: Crisp, intuitive interface using the **Lucide** icon library.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend / DB**: Firebase Firestore (Real-time DB)
- **Auth**: Firebase Authentication (Email + Google Social)
- **Notifications**: React Toastify (Toasts) + Firestore (Persistent Log)

---

## 📁 Folder Structure

```
src/
├── components/          # Reusable UI & Layout components
├── context/             # Auth and Notification global state
├── hooks/               # Custom hooks for Auth and state
├── pages/               # Feature-rich views (Dashboard, Settings, Sharing)
├── services/            # Firestore service layer (Contact, Access)
├── utils/               # Helper utilities & class merging (cn)
├── config/              # Firebase & App configuration
└── App.jsx              # Main routing and transition logic
```

---

## ⚙️ Setup & Installation

1. **Clone & Install**
   ```bash
   git clone https://github.com/yadav-himanshu/firebase-contact-app.git
   cd firebase-contact-app
   npm install
   ```

2. **Configure Firebase**
   Create a `.env` file in the root and add your credentials:
   ```env
   VITE_FIREBASE_API_KEY=xxx
   VITE_FIREBASE_AUTH_DOMAIN=xxx
   VITE_FIREBASE_PROJECT_ID=xxx
   VITE_FIREBASE_STORAGE_BUCKET=xxx
   VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
   VITE_FIREBASE_APP_ID=xxx
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Security Rules**
   For full sharing functionality, deploy the Firestore Security Rules as detailed in the project's [walkthrough.md].

---

## 👨‍💻 Author

**Himanshu Yadav**
*Frontend Developer & Product Designer*

- **GitHub**: [yadav-himanshu](https://github.com/yadav-himanshu)
- **LinkedIn**: [Himanshu Yadav](https://www.linkedin.com/in/himanshu-yadav-0706a1137)

---
*Built with ❤️ for a better contact management experience.*
