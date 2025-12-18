# Firebase Contact App

A simple contact management web application built with **React** and **Firebase**. This app allows users to **add, update, delete**, and **search** for contacts, with all data stored and synchronized using Firebase Firestore. 

The app is built with a **responsive design**, making it fully accessible on both desktop and mobile devices.

> **Live Demo**: [Firebase Contact App Live](https://firebase-contact-app-gold.vercel.app/)

## Features

- **Add New Contacts**: Users can add new contacts by providing a name and email.
- **Update Existing Contacts**: Users can update the details of an existing contact.
- **Delete Contacts**: Users can delete contacts from the database.
- **Search Contacts**: Search through contacts by name.
- **Real-time Data Sync**: The app automatically syncs with Firebase Firestore to update contact lists in real-time.
- **Responsive Layout**: Fully responsive UI to ensure great user experience on both desktop and mobile.
- **Modal UI**: A modal is used for adding or updating contacts.
- **Toast Notifications**: Provides success and error messages on adding, updating, or deleting contacts.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Firebase Firestore (Database)
- **Form Validation**: Formik, Yup
- **State Management**: React Hooks (`useState`, `useEffect`)
- **UI Components**: React Icons, React Toastify
- **Deployment**: Vercel (for live deployment)

## 🔗 Live Demo

👉 [Firebase Contact App Live Demo](https://firebase-contact-app-gold.vercel.app/)

## 📁 Folder Structure

```
src/
├── components/
│ ├── AddAndUpdateContact.jsx
│ ├── ContactNotFound.jsx
│ ├── ContactsCard.jsx
│ ├── Modal.jsx
│ ├── Navbar.jsx
├── hooks/
│ └── useDisclose.js
├── config/
│ └── firebase.js
├── App.jsx
├── index.css
└── main.jsx
```


## ⚙️ Setup & Installation

1. Clone the repository

```bash
git clone https://github.com/yadav-himanshu/firebase-contact-app.git
cd firebase-contact-app
```

2. Install dependencies

```bash
npm install
```

3. Add environment variables
   Create a `.env` file in the root:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id

```

4. Run the app

```bash
npm run dev
```

---


## Features Walkthrough

### Add and Update Contacts

The app allows adding new contacts through a modal interface.

If a user wants to update an existing contact, they can do so by opening the same modal and making the necessary changes.

### Real-time Data Sync

Firebase Firestore is used to store the contact data, and the app listens to changes in real-time using Firestore's `onSnapshot` listener.

Any change in the contacts database (add, update, delete) is immediately reflected in the app.

### Search Functionality

The app includes a search bar where users can search for contacts by name. The search is case-insensitive and dynamically filters the contact list based on the search input.

### Contact Deletion

Contacts can be deleted by clicking the delete icon next to the contact. The app uses Firestore's `deleteDoc` method to remove a contact from the database.

## Future Improvements

- **Authentication:** Add user authentication (sign-in, sign-up) using Firebase Authentication.
- **Contact Categorization:** Implement categories (friends, work, family, etc.) for contacts.
- **Offline Mode:** Implement offline capabilities to work when there's no internet connection.
- **Unit Testing:** Add unit and integration tests using Jest or React Testing Library.
- **Dark Mode:** Implement dark mode for the UI.


## 👨‍💻 Author

**Himanshu Yadav**
Frontend Developer

- GitHub: *https://github.com/yadav-himanshu*
- LinkedIn: *https://www.linkedin.com/in/himanshu-yadav-0706a1137*

---
