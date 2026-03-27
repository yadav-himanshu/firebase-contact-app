import { createContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateEmail,
    updatePassword,
    updateProfile,
    signInWithPopup
} from "firebase/auth";
import { auth, googleProvider, db } from "../config/firebase";
import { setDoc, doc } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = async (email, password) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const { user } = userCredential;

        // Sync user doc on every login to ensure it exists for sharing
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || email.split('@')[0],
        }, { merge: true });

        return userCredential;
    };

    const signup = async (email, password) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const { user } = userCredential;
        // Create user doc using UID as document ID
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || email.split('@')[0],
        });
        return userCredential;
    };

    const loginWithGoogle = async () => {
        const userCredential = await signInWithPopup(auth, googleProvider);
        const { user } = userCredential;

        // Sync user doc using UID as document ID
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email.split('@')[0],
        }, { merge: true }); // Use merge to avoid overwriting existing data

        return userCredential;
    };

    const logout = () => {
        return signOut(auth);
    };

    const updateUserEmail = (email) => {
        return updateEmail(auth.currentUser, email);
    };

    const updateUserPassword = (password) => {
        return updatePassword(auth.currentUser, password);
    };

    const updateUserProfile = (profileData) => {
        return updateProfile(auth.currentUser, profileData);
    };

    const value = {
        currentUser,
        login,
        signup,
        loginWithGoogle,
        logout,
        updateUserEmail,
        updateUserPassword,
        updateUserProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
